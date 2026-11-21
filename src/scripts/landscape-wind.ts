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

// Shared eddies span multiple stretches of ridge. Wavelengths are over twice
// the earlier scale; pickup stays local even though the carrying wind is broad.
// Both wave components remain a curl field, with a prevailing lifting wind.
function windAt(x: number, y: number, time: number) {
  const a = Math.cos(x * 0.0027 + y * 0.00495 - time * 0.18);
  const b = Math.cos(x * 0.0054 - y * 0.0027 + time * 0.13);
  return { x: 36 + 27.5 * a - 15 * b + 5 * Math.sin(time * 0.17), y: -20 - 15 * a - 30 * b };
}

// Smooth seeded noise changes gust lengths without fresh per-frame randomness.
// Two overlapping noise scales avoid a regular swell/rest rhythm; nearby sources
// share the same weather rather than choosing independent random directions.
function weatherNoise(position: number, salt: number) {
  function hash(index: number) {
    let value = Math.imul(index ^ salt, 0x45d9f3b);
    value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295 * 2 - 1;
  }
  const cell = Math.floor(position);
  const t = position - cell;
  const blend = t * t * t * (t * (t * 6 - 15) + 10);
  return hash(cell) * (1 - blend) + hash(cell + 1) * blend;
}

function naturalWeather(time: number, visitSeed: number) {
  const angle = weatherNoise(time / 29, 197 ^ visitSeed) * 0.18;
  return {
    cosine: Math.cos(angle), sine: Math.sin(angle),
    phaseA: time * 0.18 + weatherNoise(time / 19, 521 ^ visitSeed) * 1.6,
    phaseB: time * 0.13 + weatherNoise(time / 31, 913 ^ visitSeed) * 1.8,
    carry: 1 + weatherNoise(time / 17, 307 ^ visitSeed) * 0.16,
  };
}

function naturalWindAt(x: number, y: number, weather: ReturnType<typeof naturalWeather>) {
  const localX = x * weather.cosine + y * weather.sine;
  const localY = -x * weather.sine + y * weather.cosine;
  const a = Math.cos(localX * 0.0027 + localY * 0.00495 - weather.phaseA);
  const b = Math.cos(localX * 0.0054 - localY * 0.0027 + weather.phaseB);
  const vx = 36 * weather.carry + 27.5 * a - 15 * b;
  const vy = -20 * weather.carry - 15 * a - 30 * b;
  return { x: vx * weather.cosine - vy * weather.sine, y: vx * weather.sine + vy * weather.cosine };
}

// Most slider travel now explores the former useful middle, not 0–4 linearly.
// Keep a continuous fade from zero; level 2 corresponds to the former strength 3.
export function landscapeSandStrength(level: number) {
  const value = Math.max(0, Math.min(4, level));
  return value < 0.5 ? value * 5.25 : 2.5 + value * 0.25;
}

export function createLandscapeWind(canvas: HTMLCanvasElement) {
  let context: CanvasRenderingContext2D | null = null;
  let lastTime: number | null = null;
  let previousNatural = false;
  // One fresh seed per page load, shared by weather and grain variation.
  // Never reseed on a frame, pause/resume, resize, or comparison-mode switch.
  const visitSeed = crypto.getRandomValues(new Uint32Array(1))[0];
  let seed = 5719;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const credits: number[] = [];
  const particles: {
    x: number; y: number; vx: number; vy: number; age: number; life: number;
    width: number; height: number; alpha: number; facet: number; catches: boolean; color: string;
    buoyancy: number; response: number;
  }[] = [];

  function step(time: number, delta: number, contours: SandContour[], natural: boolean) {
    const weather = natural ? naturalWeather(time, visitSeed) : null;
    for (let ridge = 0; ridge < contours.length; ridge++) {
      const contour = contours[ridge];
      for (let patch = 0; patch < 12; patch++) {
        const index = ridge * 12 + patch;
        const position = (patch + 0.5) / 12;
        const source = pointOnContour(contour.points, position);
        if (source.x < 15 || source.x > 1585 || source.y < 25 || source.y > 850) continue;
        // A broad gust can reach several ridges. Smaller-scale, stable exposure
        // still controls how much each patch sheds: broad wind, selective pickup.
        const gust = natural
          ? Math.max(0, 0.18
            + 0.85 * weatherNoise(time / 18 - source.x * 0.001 - source.y * 0.0015, 1129 ^ visitSeed)
            + 0.6 * weatherNoise(time / 9 + source.x * 0.0016 - source.y * 0.0007, 2081 ^ visitSeed))
          : Math.max(0, 0.15 + 0.6 * Math.sin(time * 0.18 + source.x * 0.0027 + source.y * 0.00495)
            + 0.4 * Math.sin(time * 0.09 - source.x * 0.0018));
        const exposure = 1 + 0.6 * Math.sin(source.x * 0.019 - source.y * 0.015 + ridge * 0.7);
        // No extra emission sites or blanket release across the landscape.
        credits[index] = (credits[index] || 0) + gust * gust * exposure * 180 * delta;
        while (credits[index] >= 1) {
          credits[index]--;
          if (particles.length >= 22000) continue;
          const origin = pointOnContour(contour.points, position + (random() - 0.5) * 0.055);
          const wind = weather ? naturalWindAt(origin.x, origin.y, weather) : windAt(origin.x, origin.y, time);
          particles.push({
            x: origin.x, y: origin.y - random() * 2,
            vx: wind.x * 0.45, vy: -12 - random() * 24,
            age: 0, life: 6.5 + random() * 6.5,
            width: 0.65 + random() * 1.15, height: 0.35 + random() * 0.6,
            alpha: 0.07 + random() * 0.11,
            facet: random() * Math.PI * 2, catches: random() < 0.004, color: contour.color,
            // Stable variation in grain response opens the wisps without jitter.
            buoyancy: 0.7 + random() * 0.7, response: 1.3 + random() * 1.5,
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
      const wind = weather ? naturalWindAt(particle.x, particle.y, weather) : windAt(particle.x, particle.y, time);
      const follow = 1 - Math.exp(-delta * particle.response);
      particle.vx += (wind.x - particle.vx) * follow;
      particle.vy += (wind.y * particle.buoyancy - particle.vy) * follow;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
    }
  }

  function draw(time: number, strength: number, contours: SandContour[], natural = false) {
    // Restart the comparison cleanly instead of mixing two wind models in flight.
    if (natural !== previousNatural) {
      lastTime = null;
      previousNatural = natural;
    }
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
      seed = natural ? visitSeed : 5719;
      for (let i = 0; i < 90; i++) step(time - 3 + i / 30, 1 / 30, contours, natural);
    } else {
      const elapsed = Math.max(0, time - lastTime);
      const steps = Math.max(1, Math.ceil(elapsed * 30));
      for (let i = 0; i < steps; i++) step(lastTime + (i + 1) * elapsed / steps, elapsed / steps, contours, natural);
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
      const disperse = (1 - particle.age / particle.life) ** 1.3;
      const catchLight = particle.catches ? Math.max(0, Math.sin(time * 0.7 + particle.facet)) ** 20 : 0;
      context.globalAlpha = Math.min(0.6, strength * 1.5 * lift * disperse * (particle.alpha + catchLight * 0.18));
      context.fillStyle = catchLight > 0.3 ? '#D8AF6B' : particle.color;
      context.fillRect(particle.x, particle.y, particle.width, particle.height);
    }
    context.globalAlpha = 1;
  }

  return { draw };
}
