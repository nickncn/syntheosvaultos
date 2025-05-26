import confetti from "canvas-confetti";

export function fireConfetti(color?: string) {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: color ? [color] : undefined,
    });
}
