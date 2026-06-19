function initStarfieldBackground() {
    const canvas = document.getElementById('starfieldCanvas');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const STAR_COLOR = '#ffffff';
    const STAR_SIZE = 3;
    const STAR_MIN_SCALE = 0.2;
    const OVERFLOW_THRESHOLD = 50;

    let scale = 1;
    let width = 0;
    let height = 0;
    let animationFrameId = null;
    let pointerX = null;
    let pointerY = null;
    let touchInput = false;
    let stars = [];
    let starCount = 0;

    const velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

    function placeStar(star) {
        star.x = Math.random() * width;
        star.y = Math.random() * height;
    }

    function recycleStar(star) {
        let direction = 'z';
        const vx = Math.abs(velocity.x);
        const vy = Math.abs(velocity.y);

        if (vx > 1 || vy > 1) {
            const axis = vx > vy ? (Math.random() < vx / (vx + vy) ? 'h' : 'v') : (Math.random() < vy / (vx + vy) ? 'v' : 'h');
            if (axis === 'h') direction = velocity.x > 0 ? 'l' : 'r';
            else direction = velocity.y > 0 ? 't' : 'b';
        }

        star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

        if (direction === 'z') {
            star.z = 0.1;
            star.x = Math.random() * width;
            star.y = Math.random() * height;
        } else if (direction === 'l') {
            star.x = -OVERFLOW_THRESHOLD;
            star.y = height * Math.random();
        } else if (direction === 'r') {
            star.x = width + OVERFLOW_THRESHOLD;
            star.y = height * Math.random();
        } else if (direction === 't') {
            star.x = width * Math.random();
            star.y = -OVERFLOW_THRESHOLD;
        } else if (direction === 'b') {
            star.x = width * Math.random();
            star.y = height + OVERFLOW_THRESHOLD;
        }
    }

    function createStars() {
        starCount = Math.floor((window.innerWidth + window.innerHeight) / 8);
        stars = Array.from({ length: starCount }, () => ({
            x: 0,
            y: 0,
            z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
        }));
        stars.forEach(placeStar);
    }

    function resize() {
        scale = window.devicePixelRatio || 1;
        width = window.innerWidth * scale;
        height = window.innerHeight * scale;
        canvas.width = width;
        canvas.height = height;
        createStars();
    }

    function update() {
        velocity.tx *= 0.96;
        velocity.ty *= 0.96;
        velocity.x += (velocity.tx - velocity.x) * 0.8;
        velocity.y += (velocity.ty - velocity.y) * 0.8;
        stars.forEach(star => {
            star.x += velocity.x * star.z;
            star.y += velocity.y * star.z;
            star.x += (star.x - width / 2) * velocity.z * star.z;
            star.y += (star.y - height / 2) * velocity.z * star.z;
            star.z += velocity.z;
            if (star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD) {
                recycleStar(star);
            }
        });
    }

    function render() {
        context.clearRect(0, 0, width, height);
        stars.forEach(star => {
            let tailX = velocity.x * 2;
            let tailY = velocity.y * 2;
            if (Math.abs(tailX) < 0.1) tailX = 0.5;
            if (Math.abs(tailY) < 0.1) tailY = 0.5;
            context.beginPath();
            context.lineCap = 'round';
            context.lineWidth = STAR_SIZE * star.z * scale;
            context.globalAlpha = 0.5 + 0.5 * Math.random();
            context.strokeStyle = STAR_COLOR;
            context.moveTo(star.x, star.y);
            context.lineTo(star.x + tailX, star.y + tailY);
            context.stroke();
        });
    }

    function step() {
        update();
        render();
        animationFrameId = requestAnimationFrame(step);
    }

    function movePointer(x, y) {
        if (typeof pointerX === 'number' && typeof pointerY === 'number') {
            const ox = x - pointerX;
            const oy = y - pointerY;
            velocity.tx += (ox / 8) * scale * (touchInput ? 1 : -1);
            velocity.ty += (oy / 8) * scale * (touchInput ? 1 : -1);
        }
        pointerX = x;
        pointerY = y;
    }

    function onMouseMove(e) {
        touchInput = false;
        movePointer(e.clientX, e.clientY);
    }

    function onTouchMove(e) {
        if (!e.touches[0]) return;
        touchInput = true;
        movePointer(e.touches[0].clientX, e.touches[0].clientY);
    }

    function onPointerLeave() {
        pointerX = null;
        pointerY = null;
    }

    resize();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    step();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onPointerLeave, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
}

initStarfieldBackground();
