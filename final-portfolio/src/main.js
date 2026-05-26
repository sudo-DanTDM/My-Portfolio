// ==========================================================================
// PORTFOLIO LOGIC: VIBRANT AURORA BENTO STREAM ENGINE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initTypewriterConsole();
    initKineticCanvas();
    initAudioMixer();
    initSportsSectionObserver();
});

/* ==========================================================================
   1. REAL-TIME HUD CLOCK
   ========================================================================== */
function initClock() {
    const clockEl = document.getElementById('hud-clock');
    if (!clockEl) return;

    function updateTime() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    updateTime();
    setInterval(updateTime, 1000);
}

/* ==========================================================================
   2. TYPEWRITER CONSOLE (Role Rotator)
   ========================================================================== */
function initTypewriterConsole() {
    const consoleEl = document.getElementById('typed-console');
    if (!consoleEl) return;

    const roles = [
        "Python Developer",
        "Systems Administrator",
        "Motion Graphics Director",
        "Sports Event Coordinator"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            consoleEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            consoleEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2200; // Hold full role title
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   3. KINETIC CONNECTING NODES CANVAS (Glow-Theme Enabled)
   ========================================================================== */
function initKineticCanvas() {
    const canvas = document.getElementById('kinetic-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const maxParticles = 65; // Scaled up density slightly
    const connectionDist = 110; // Expanded connection range for larger screens
    const mouse = { x: null, y: null, radius: 140 };

    // Accent colors matching CSS theme variables
    const colors = [
        'rgba(255, 143, 107, 0.7)',  // Peach Apricot
        'rgba(59, 179, 179, 0.7)',   // Aqua Teal
        'rgba(142, 148, 242, 0.5)'   // Lavender Violet
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 1.5; // Slightly larger nodes
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.vx += (dx / dist) * force * 0.06;
                    this.vy += (dy / dist) * force * 0.06;
                }
            }

            // Cap speeds
            this.vx = Math.max(Math.min(this.vx, 1.0), -1.0);
            this.vy = Math.max(Math.min(this.vy, 1.0), -1.0);

            this.x += this.vx;
            this.y += this.vy;

            // Boundaries
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections first
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < connectionDist) {
                    const alpha = (1 - (dist / connectionDist)) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(94, 120, 110, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        // Draw particles on top
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   4. WORKING AUDIO MIXER (DAW Dashboard)
   ========================================================================== */
function initAudioMixer() {
    const sliderVol = document.getElementById('slider-vol');
    const sliderRvb = document.getElementById('slider-rvb');
    const sliderAsio = document.getElementById('slider-asio');

    const valVol = document.getElementById('val-vol');
    const valRvb = document.getElementById('val-rvb');
    const valAsio = document.getElementById('val-asio');

    const eqBars = document.querySelectorAll('.eq-bar');

    if (!sliderVol || !sliderRvb || !sliderAsio) return;

    let volumeVal = parseFloat(sliderVol.value) / 100;
    let reverbVal = parseFloat(sliderRvb.value) / 100;
    let latencyVal = parseInt(sliderAsio.value);

    sliderVol.addEventListener('input', (e) => {
        volumeVal = parseFloat(e.target.value) / 100;
        valVol.textContent = e.target.value;
    });

    sliderRvb.addEventListener('input', (e) => {
        reverbVal = parseFloat(e.target.value) / 100;
        valRvb.textContent = e.target.value;
    });

    sliderAsio.addEventListener('input', (e) => {
        latencyVal = parseInt(e.target.value);
        valAsio.textContent = e.target.value + 'ms';
    });

    // Equalizer oscillation loop (12 bars visualizer)
    let animTime = 0;
    function animateEqualizer() {
        animTime += 0.06 + (reverbVal * 0.06); // Reverb expands visuals speed

        eqBars.forEach((bar, index) => {
            const speedFactor = 0.9 / (latencyVal / 10);
            const frequencyWave = Math.sin(animTime * speedFactor + index * 0.5);
            
            // Scaled amplitude to fit the new taller 90px equalizer heights
            const amplitude = Math.abs(frequencyWave) * (25 + (volumeVal * 75));
            bar.style.height = `${Math.max(amplitude, 12)}%`;
        });

        requestAnimationFrame(animateEqualizer);
    }

    animateEqualizer();
}

// Value ascending ticker helper
function tickValue(element, targetValue, duration, suffix = "") {
    if (!element) return;
    let start = 0;
    const step = Math.ceil(targetValue / (duration / 20));
    
    const timer = setInterval(() => {
        if (targetValue > 100) {
            start += step;
        } else {
            start += 1;
        }
        if (start >= targetValue) {
            start = targetValue;
            clearInterval(timer);
        }
        element.textContent = start + suffix;
    }, 20);
}

/* ==========================================================================
   5. SPORTS SECTION OBSERVER (Trigger tick anim on visible scroll)
   ========================================================================== */
function initSportsSectionObserver() {
    const sportsCard = document.querySelector('.sports-card');
    const athletesCount = document.getElementById('athletes-count');
    const tournamentsCount = document.getElementById('tournaments-count');

    if (!sportsCard) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger counters increment to new Director values
                tickValue(athletesCount, 1500, 800, "+");
                tickValue(tournamentsCount, 35, 800, "+");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    observer.observe(sportsCard);
}
