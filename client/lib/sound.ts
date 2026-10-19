// Web Audio API synthesized success chime
// High-fidelity, zero external network dependency, ultra-low resource footprint

export function playSuccessChime() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Browser audio policy: resume if suspended
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Harmonic 1: Warm tonal intro (D5 sweeps up to A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880.0, now + 0.08);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.23);

    // Harmonic 2: Sparkling resolution bell (D6 high chime with smooth natural decay)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1174.66, now + 0.08);

    gain2.gain.setValueAtTime(0.0001, now + 0.08);
    gain2.gain.linearRampToValueAtTime(0.1, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.08);
    osc2.stop(now + 0.49);

    // Clean up AudioContext immediately after chime completes to free hardware resources
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 600);
  } catch {
    // Non-blocking: fail gracefully if hardware audio is unavailable or muted
  }
}
