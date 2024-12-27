window.onload = function() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const explosionSound = new Audio('src/sounds/phaohoa.mp3');
    const backgroundMusic = new Audio('src/sounds/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.play();

    class Firework {
        constructor(x, y, targetY, color) {
            this.x = x;
            this.y = y;
            this.targetY = targetY;
            this.color = color;
            this.particles = [];
            this.exploded = false;
        }

        update() {
            if (!this.exploded) {
                this.y -= 5;
                if (this.y <= this.targetY) {
                    this.explode();
                }
            } else {
                this.particles.forEach(particle => particle.update());
            }
        }

        draw() {
            if (!this.exploded) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            } else {
                this.particles.forEach(particle => particle.draw());
            }
        }

        explode() {
            this.exploded = true;
            explosionSound.currentTime = 0;
            explosionSound.play();
            for (let i = 0; i < 100; i++) {
                const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                this.particles.push(new Particle(this.x, this.y, color));
            }
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = Math.random() * 4 + 3;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * 6 - 3;
            this.gravity = 0.05;
            this.friction = 0.98;
            this.alpha = 1;
            this.decay = Math.random() * 0.03 + 0.01;
            this.trail = [];
        }

        update() {
            this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
            if (this.trail.length > 10) {
                this.trail.shift();
            }

            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.speedX *= this.friction;
            this.speedY *= this.friction;
            this.size *= 0.96;
            this.alpha -= this.decay;

            if (this.alpha <= 0) {
                this.alpha = 0;
                this.size = 0;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            this.trail.forEach((point, index) => {
                ctx.lineTo(point.x, point.y);
                ctx.globalAlpha = point.alpha;
            });
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    }

    const fireworks = [];

    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = canvas.height;
        const targetY = Math.random() * canvas.height / 2;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        fireworks.push(new Firework(x, y, targetY, color));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fireworks.forEach((firework, index) => {
            firework.update();
            firework.draw();
            if (firework.exploded && firework.particles.length === 0) {
                fireworks.splice(index, 1);
            }
        });
        if (Math.random() < 0.1) { // Giảm tần suất tạo pháo hoa
            createFirework();
        }
        requestAnimationFrame(animate);
    }

    animate();
};