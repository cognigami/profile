// A transparent airborne layer, not a light/filter applied to the artwork.
// The hero owns the animation clock, visibility, and reduced-motion handling.
export function createSandPlume(canvas: HTMLCanvasElement) {
  let context: CanvasRenderingContext2D | null = null;
  let seed = 9137;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const particles: {
    offset: number; height: number; ribbon: number; drift: number;
    width: number; thickness: number; alpha: number; catches: boolean;
    phase: number; period: number; color: string;
  }[] = [];

  function prepare() {
    if (particles.length) return;
    for (let i = 0; i < 18000; i++) {
      particles.push({
        offset: random() * 1400,
        height: Math.sqrt(-2 * Math.log(Math.max(random(), 0.000001))) * Math.cos(random() * Math.PI * 2),
        ribbon: Math.floor(random() * 3) - 1,
        drift: 8 + random() * 16,
        width: 0.65 + random() * 1.15,
        thickness: 0.35 + random() * 0.55,
        alpha: 0.055 + random() * 0.11,
        catches: random() < 0.025,
        phase: random() * Math.PI * 2,
        period: 9 + random() * 15,
        color: random() < 0.65 ? '#DDB681' : '#B9976C',
      });
    }
  }

  function smoothstep(value: number) {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  }

  function draw(time: number, strength: number) {
    canvas.hidden = strength <= 0;
    if (canvas.hidden) return;
    context ||= canvas.getContext('2d');
    if (!context) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    prepare();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(width * ratio);
    const pixelHeight = Math.round(height * ratio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Match the SVG's xMidYMid slice crop on desktop and portrait screens.
    const scale = Math.max(width / 1600, height / 900);
    context.setTransform(ratio * scale, 0, 0, ratio * scale,
      ratio * (width - 1600 * scale) / 2, ratio * (height - 900 * scale) / 2);

    // One plume passes, disperses offscreen, then a new one enters. Its wrap
    // occurs beyond both screen edges, never as an on-screen reversal/reset.
    const plumeX = -1100 + ((time * 48 + 1850) % 3800);
    const plumeY = 350 + Math.sin(time * 0.09) * 38;
    for (const particle of particles) {
      const localX = ((particle.offset + time * particle.drift) % 1400) - 1000;
      const x = plumeX + localX;
      if (x < -3 || x > 1603) continue;
      const along = Math.exp(-(((localX + 220) / 470) ** 2));
      // Long, uneven ribbons rather than round patches or a spotlight edge.
      const wisp = 0.65 + 0.35 * Math.sin(localX * 0.009 + particle.ribbon * 2 + time * 0.13);
      const density = along * wisp * smoothstep((localX + 1000) / 120) * smoothstep((400 - localX) / 180);
      const spread = 16 + 24 * (1 - along);
      const y = plumeY + particle.ribbon * (22 + 15 * (1 - along))
        + Math.sin(localX * 0.004 + particle.ribbon * 1.8 + time * 0.08) * 22
        + particle.height * spread;
      // Only a few of the actual moving grains catch light, with a soft rise
      // and fall. No stationary twinkles, halos, crosses, or separate glitter.
      const catchLight = particle.catches
        ? Math.max(0, Math.sin(time * Math.PI * 2 / particle.period + particle.phase)) ** 16
        : 0;
      const alpha = Math.min(0.8, strength * density * (particle.alpha + catchLight * 0.55));
      if (alpha < 0.004) continue;
      context.globalAlpha = alpha;
      context.fillStyle = catchLight > 0.15 ? '#F0D5A5' : particle.color;
      context.fillRect(x, y, particle.width, particle.thickness);
    }
    context.globalAlpha = 1;
  }

  return { draw };
}
