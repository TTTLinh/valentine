const audio = document.getElementById("bgm");
const hint = document.getElementById("hint");
const soundToggle = document.getElementById("soundToggle");
const soundIcon = document.getElementById("soundIcon");

const BPM = 96;
document.documentElement.style.setProperty("--pulseDur", `${Math.round(60000 / BPM)}ms`);

let soundEnabled = false;

function setIcon() {
    soundIcon.textContent = (audio.muted || audio.paused) ? "🔇" : "🔊";
}

function fadeIn(targetVolume = 0.75, durationMs = 900) {
    audio.volume = 0;
    const start = performance.now();
    const tick = (t) => {
        const p = Math.min(1, (t - start) / durationMs);
        const eased = 1 - Math.pow(1 - p, 3);
        audio.volume = +(targetVolume * eased).toFixed(3);
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

async function enableSound() {
    if (soundEnabled) return;

    audio.muted = false;
    try {
        await audio.play();
        fadeIn(0.75, 900);
        soundEnabled = true;
        setIcon();
    } catch (e) {
        audio.muted = true;
        hint.textContent = "Tap again to allow sound 🔇";
        setIcon();
    }
}

window.addEventListener("pointerdown", enableSound, { once: true });
window.addEventListener("keydown", enableSound, { once: true });

soundToggle.addEventListener("click", async (e) => {
    e.stopPropagation();

    if (!soundEnabled) {
        await enableSound();
        return;
    }

    if (audio.muted) {
        audio.muted = false;
        await audio.play().catch(() => { });
        if (audio.volume < 0.05) fadeIn(0.75, 500);
    } else {
        audio.muted = true;
    }
    setIcon();
});
audio.muted = true;
setIcon();

/* ===== Floating hearts effect ===== */
function createFloatingHeart() {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = "♥";

    const size = 12 + Math.random() * 24;
    const startX = Math.random() * window.innerWidth;
    const driftX = (Math.random() - 0.5) * 200;
    const duration = 6000 + Math.random() * 4000;

    heart.style.left = `${startX}px`;
    heart.style.setProperty("--x", `${driftX}px`);
    heart.style.setProperty("--size", `${size}px`);
    heart.style.animationDuration = `${duration}ms`;

    const colors = ["#ff5fa2", "#ff8fcf", "#ff3b6b", "#ffd1e8"];
    heart.style.setProperty(
        "--color",
        colors[Math.floor(Math.random() * colors.length)]
    );

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), duration);
}

/* Tạo tim liên tục */
setInterval(createFloatingHeart, 200);
/* ===== Burst on GIF click ===== */
const gifImg = document.querySelector('.top-gif img');

function burstLove(x, y) {
    const colors = ['#ff4f9a', '#ff77b7', '#ff2f6d', '#ffc1dc'];
    const texts = ['em bé yêu anh', 'Linh yêu anh', 'Em yêu anh']; // lặp để ra nhiều chữ

    const total = 32; // số item nổ ra

    for (let i = 0; i < total; i++) {
        const el = document.createElement('div');
        el.className = 'burst-item';

        const isText = Math.random() > 0.6;
        if (isText) {
            el.classList.add('burst-text');
            el.textContent = texts[Math.floor(Math.random() * texts.length)];
        } else {
            el.classList.add('burst-heart');
            el.textContent = '♥';
        }

        const size = isText
            ? 12 + Math.random() * 8
            : 14 + Math.random() * 20;

        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 140;

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.setProperty('--x', `${dx}px`);
        el.style.setProperty('--y', `${dy}px`);
        el.style.setProperty('--size', `${size}px`);
        el.style.setProperty(
            '--color',
            colors[Math.floor(Math.random() * colors.length)]
        );

        const duration = 900 + Math.random() * 700;
        el.style.animationDuration = `${duration}ms`;

        document.body.appendChild(el);
        setTimeout(() => el.remove(), duration);
    }
}

if (gifImg) {
    gifImg.style.pointerEvents = 'auto'; // cho click
    gifImg.addEventListener('click', (e) => {
        const rect = gifImg.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        burstLove(x, y);
    });
}
/* ===== Background click: hearts + "em bé yêu anh" ===== */
function burstBackground(x, y) {
    const colors = ['#ff6fae', '#ff9fd0', '#ff3b6b', '#ffd1e8'];
    const text = 'yêu anh';

    const total = 14; // số item nhẹ hơn GIF

    for (let i = 0; i < total; i++) {
        const el = document.createElement('div');
        el.className = 'burst-item';

        const isText = Math.random() > 0.65; // ~35% chữ
        if (isText) {
            el.classList.add('burst-text');
            el.textContent = text;
        } else {
            el.classList.add('burst-heart');
            el.textContent = '♥';
        }

        const size = isText
            ? 11 + Math.random() * 6
            : 12 + Math.random() * 16;

        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 110; // nhẹ hơn
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.setProperty('--x', `${dx}px`);
        el.style.setProperty('--y', `${dy}px`);
        el.style.setProperty('--size', `${size}px`);
        el.style.setProperty(
            '--color',
            colors[Math.floor(Math.random() * colors.length)]
        );

        const duration = 700 + Math.random() * 600;
        el.style.animationDuration = `${duration}ms`;

        document.body.appendChild(el);
        setTimeout(() => el.remove(), duration);
    }
}

/* Click nền (trừ GIF) */
document.addEventListener('click', (e) => {

    if (e.target.closest('.top-gif')) return;

    burstBackground(e.clientX, e.clientY);
});

const letter = document.getElementById("openLetter");
const layer = document.getElementById("heartBurstLayer");

let lastBurst = 0;

function burstHearts(x, y) {
    if (!layer) return;

    const now = Date.now();
    if (now - lastBurst < 450) return;
    lastBurst = now;

    const heartCount = 14;
    const textCount = 3; // 👈 số chữ "yêu anh"

    // bắn tim
    for (let i = 0; i < heartCount; i++) {
        const p = document.createElement("div");
        p.className = "heart-particle";
        p.textContent = ["💗", "💖", "💘", "💞", "❤️", "🌸"][Math.floor(Math.random() * 6)];

        p.style.left = x + "px";
        p.style.top = y + "px";

        const dx = (Math.random() * 140 - 70).toFixed(0) + "px";
        const dy = (-(Math.random() * 160 + 80)).toFixed(0) + "px";
        p.style.setProperty("--dx", dx);
        p.style.setProperty("--dy", dy);

        p.style.fontSize = (14 + Math.random() * 14).toFixed(0) + "px";

        layer.appendChild(p);
        p.addEventListener("animationend", () => p.remove());
    }

    const LOVE_TEXTS = [
        "yêu anh 💖",
        "em bé yêu anh 💗",
        "Linh yêu anh 💞",
        "love you ❤️",
        "my valentine 💘",
        "forever 💕"
    ];
    for (let i = 0; i < textCount; i++) {
        const t = document.createElement("div");
        t.className = "heart-particle love-particle";
        t.textContent = LOVE_TEXTS[Math.floor(Math.random() * LOVE_TEXTS.length)];

        t.style.left = x + "px";
        t.style.top = y + "px";

        const dx = (Math.random() * 120 - 60).toFixed(0) + "px";
        const dy = (-(Math.random() * 140 + 100)).toFixed(0) + "px";
        t.style.setProperty("--dx", dx);
        t.style.setProperty("--dy", dy);

        t.style.fontSize = (12 + Math.random() * 10).toFixed(0) + "px";

        layer.appendChild(t);
        t.addEventListener("animationend", () => t.remove());
    }
}

// Hover / touch chỉ khi tồn tại letter
if (letter) {
    letter.addEventListener("mouseenter", () => {
        const r = letter.getBoundingClientRect();
        burstHearts(r.left + r.width / 2, r.top + r.height / 2);
    });

    letter.addEventListener("mousemove", (e) => {
        burstHearts(e.clientX, e.clientY);
    });

    letter.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        burstHearts(t.clientX, t.clientY);
    }, { passive: true });
}


const openLetter = document.getElementById("openLetter");
const backHome = document.getElementById("backHome");
const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

function showPage(n) {
    if (n === 1) {
        page1.classList.add("active");
        page2.classList.remove("active");
    } else {
        page2.classList.add("active");
        page1.classList.remove("active");
    }
}

if (openLetter) {
    openLetter.addEventListener("click", (e) => {
        e.preventDefault();
        showPage(2);
    });
}

if (backHome) {
    backHome.addEventListener("click", () => showPage(1));
}

const flipCard = document.getElementById("flipCard");

/* ===== SLIDESHOW (như trước) ===== */
const slides = Array.from(document.querySelectorAll("#slideshow .slide"));
let slideIdx = 0;
let slideTimer = null;

function clearSlideTimers() {
    if (slideTimer) {
        clearTimeout(slideTimer);
        slideTimer = null;
    }
}

function resetAllVideos() {
    slides.forEach(s => {
        if (s.tagName === "VIDEO") {
            s.onended = null;
            s.pause();
            try { s.currentTime = 0; } catch (e) { }
        }
    });
}

function showSlide(i) {
    clearSlideTimers();
    resetAllVideos();

    slides.forEach((s, k) => s.classList.toggle("active", k === i));

    const current = slides[i];
    if (!current) return;

    if (current.tagName === "VIDEO") {
        // autoplay yêu cầu muted + playsinline trong HTML
        current.onended = () => {
            slideIdx = (slideIdx + 1) % slides.length;
            showSlide(slideIdx);
        };

        const p = current.play();
        if (p && typeof p.catch === "function") p.catch(() => { });
    } else {
        // IMG
        slideTimer = setTimeout(() => {
            slideIdx = (slideIdx + 1) % slides.length;
            showSlide(slideIdx);
        }, 2500);
    }
}

function startSlideShow() {
    if (slides.length <= 1) return;
    showSlide(slideIdx);
}

function stopSlideShow() {
    clearSlideTimers();
    resetAllVideos();
    slideIdx = 0;
    showSlide(0);
}

/* ===== TYPEWRITER ===== */
const textEl = document.getElementById("typeText");
const fullText = textEl.innerText.trim();
let charIndex = 0;
let typingTimer = null;

function startTyping() {
    textEl.innerHTML = "";
    textEl.classList.add("type-cursor");
    charIndex = 0;

    typingTimer = setInterval(() => {
        textEl.innerHTML += fullText[charIndex] === "\n"
            ? "<br>"
            : fullText[charIndex];

        charIndex++;

        if (charIndex >= fullText.length) {
            clearInterval(typingTimer);
            textEl.classList.remove("type-cursor");
        }
    }, 40); // tốc độ gõ (ms)
}

function resetTyping() {
    clearInterval(typingTimer);
    textEl.innerHTML = "";
    textEl.classList.remove("type-cursor");
}

/* ===== FLIP CARD ===== */
flipCard.addEventListener("click", () => {
    flipCard.classList.toggle("open");

    if (flipCard.classList.contains("open")) {
        startSlideShow();
        startTyping();
    } else {
        stopSlideShow();
        resetTyping();
    }
});


const signature = document.getElementById("signature");

function startTyping() {
    textEl.innerHTML = "";
    textEl.classList.add("type-cursor");
    signature.classList.remove("show");
    charIndex = 0;

    typingTimer = setInterval(() => {
        textEl.innerHTML += fullText[charIndex] === "\n"
            ? "<br>"
            : fullText[charIndex];

        charIndex++;

        if (charIndex >= fullText.length) {
            clearInterval(typingTimer);
            textEl.classList.remove("type-cursor");

            // hiện chữ ký sau khi gõ xong
            setTimeout(() => {
                signature.classList.add("show");
            }, 400);
        }
    }, 40);
}

function resetTyping() {
    clearInterval(typingTimer);
    textEl.innerHTML = "";
    signature.classList.remove("show");
    textEl.classList.remove("type-cursor");
}
