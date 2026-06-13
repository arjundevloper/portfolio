const glows = document.querySelectorAll(".glow");
const panther = document.querySelector(".hero-image img");

let mouse = {
    x: window.innerWidth * 0.72,
    y: window.innerHeight * 0.5
};

let current = { ...mouse };
let angle = 0;

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animate() {
    // Very smooth follow
    current.x += (mouse.x - current.x) * 0.025;
    current.y += (mouse.y - current.y) * 0.025;

    angle += 0.008;

    const baseScale = 1 + Math.sin(angle) * 0.12;
    const flicker = 0.65 + Math.sin(angle * 2.3) * 0.15 + Math.random() * 0.08;

    glows.forEach((glow, index) => {
        const offsetX = (index - 1) * 35; // slight horizontal spread
        const offsetY = Math.sin(angle + index) * 20;

        const glowScale = baseScale * (1.4 + index * 0.4); // bigger outer glows
        const glowOpacity = flicker * (0.45 - index * 0.08);

        glow.style.left = (current.x + offsetX) + "px";
        glow.style.top = (current.y + offsetY) + "px";
        glow.style.transform = `translate(-50%, -50%) scale(${glowScale}) rotate(${Math.sin(angle * 0.7) * 8}deg)`;
        glow.style.opacity = Math.max(0.1, glowOpacity);
    });

    const px = (mouse.x - window.innerWidth / 2) * 0.012;
    const py = (mouse.y - window.innerHeight / 2) * 0.012;

    panther.style.transform = `translate(${px}px, ${py}px) scale(1.03)`;

    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    mouse.x = window.innerWidth * 0.72;
    mouse.y = window.innerHeight * 0.5;
});
