import confetti from "canvas-confetti";

export function celebrate() {
  const end = Date.now() + 800;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#a855f7", "#fb923c", "#22d3ee"] });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#a855f7", "#fb923c", "#22d3ee"] });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
