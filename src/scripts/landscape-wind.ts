export interface SandContour {
  // Start point followed by cubic Bézier control/end points (six per segment).
  points: number[];
  color: string;
}

function pointOnContour(points: number[], position: number) {
  const segments = (points.length - 2) / 6;
  const along = Math.max(0, Math.min(0.999999, position)) * segments;
  const segment = Math.floor(along);
  const offset = 2 + segment * 6;
  const t = along - segment;
  const u = 1 - t;
  const x0 = segment ? points[offset - 2] : points[0];
  const y0 = segment ? points[offset - 1] : points[1];
  return {
    x: u ** 3 * x0 + 3 * u * u * t * points[offset] + 3 * u * t * t * points[offset + 2] + t ** 3 * points[offset + 4],
    y: u ** 3 * y0 + 3 * u * u * t * points[offset + 1] + 3 * u * t * t * points[offset + 3] + t ** 3 * points[offset + 5],
  };
}

// Shared eddies, not a marching front or independent particle jitter. The two
// wave components are a curl field, superimposed on a prevailing lifting wind.
function windAt(x: number, y: number, time: number) {
  const a = Math.cos(x * 0.006 + y * 0.011 - time * 0.27);
  const b = Math.cos(x * 0.012 - y * 0.006 + time * 0.19);
  return { x: 28 + 22 * a - 12 * b + 5 * Math.sin(time * 0.17), y: -12 - 12 * a - 24 * b };
}

export function createLandscapeWind(canvas: HTMLCanvasElement) {
  let context: CanvasRenderingContext2D | null = null;
  let lastTime: number | null = null;
  let seed = 5719;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const credits: number[] = [];
  const particles: {
    x: number; y: number; vx: number; vy: number; age: number; life: number;
    width: number; height: number; alpha: number; facet: number; catches: boolean; color: string;
  }[] = [];

  function step(time: number, delta: number, contours: SandContour[]) {
    for (let ridge = 0; ridge < contours.length; ridge++) {
      const contour = contours[ridge];
      for (let patch = 0; patch < 12; patch++) {
        const index = ridge * 12 + patch;
        const position = (patch + 0.5) / 12;
        const source = pointOnContour(contour.points, position);
        if (source.x < 15 || source.x > 1585 || source.y < 25 || source.y > 850) continue;
        // Spatially related gusts activate different patches at different times.
        // Quiet stretches between them keep the ridges from constantly smoking.
        const gust = Math.max(0, 0.15 + 0.6 * Math.sin(time * 0.27 + source.x * 0.006 + source.y * 0.011)
          + 0.4 * Math.sin(time * 0.13 - source.x * 0.004));
        credits[index] = (credits[index] || 0) + gust * gust * 90 * delta;
        while (credits[index] >= 1) {
          credits[index]--;
          if (particles.length >= 14000) continue;
          const origin = pointOnContour(contour.points, position + (random() - 0.5) * 0.055);
          const wind = windAt(origin.x, origin.y, time);
          particles.push({
            x: origin.x, y: origin.y - random() * 2,
            vx: wind.x * 0.45, vy: -12 - random() * 12,
            age: 0, life: 5 + random() * 5,
            width: 0.6 + random() * 1.1, height: 0.35 + random() * 0.6,
            alpha: 0.08 + random() * 0.13,
            facet: random() * Math.PI * 2, catches: random() < 0.025, color: contour.color,
          });
        }
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.age += delta;
      if (particle.age >= particle.life || particle.x > 1640 || particle.x < -40 || particle.y < -40 || particle.y > 940) {
        particles[i] = particles[particles.length - 1];
        particles.pop();
        continue;
      }
      const wind = windAt(particle.x, particle.y, time);
      const follow = 1 - Math.exp(-delta * 3);
      particle.vx += (wind.x - particle.vx) * follow;
      particle.vy += (wind.y - particle.vy) * follow;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
    }
  }

  function draw(time: number, strength: number, contours: SandContour[]) {
    canvas.hidden = strength <= 0;
    if (canvas.hidden) {
      lastTime = null;
      particles.length = 0;
      credits.length = 0;
      return;
    }
    context ||= canvas.getContext('2d');
    if (!context || !contours.length) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    // A short deterministic warm-up makes the direction visible on enabling,
    // rather than requiring a wait for the first grains to leave the contours.
    if (lastTime === null || time - lastTime > 0.25) {
      particles.length = 0;
      credits.length = 0;
      seed = 5719;
      for (let i = 0; i < 90; i++) step(time - 3 + i / 30, 1 / 30, contours);
    } else {
      const elapsed = Math.max(0, time - lastTime);
      const steps = Math.max(1, Math.ceil(elapsed * 30));
      for (let i = 0; i < steps; i++) step(lastTime + (i + 1) * elapsed / steps, elapsed / steps, contours);
    }
    lastTime = time;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(width * ratio);
    const pixelHeight = Math.round(height * ratio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.max(width / 1600, height / 900);
    context.setTransform(ratio * scale, 0, 0, ratio * scale,
      ratio * (width - 1600 * scale) / 2, ratio * (height - 900 * scale) / 2);
    for (const particle of particles) {
      const lift = Math.min(1, particle.age / 0.8);
      const disperse = (1 - particle.age / particle.life) ** 1.5;
      const catchLight = particle.catches ? Math.max(0, Math.sin(time * 0.7 + particle.facet)) ** 20 : 0;
      context.globalAlpha = Math.min(0.8, strength * lift * disperse * (particle.alpha + catchLight * 0.55));
      context.fillStyle = catchLight > 0.15 ? '#F0D5A5' : particle.color;
      context.fillRect(particle.x, particle.y, particle.width, particle.height);
    }
    context.globalAlpha = 1;
  }

  return { draw };
}
