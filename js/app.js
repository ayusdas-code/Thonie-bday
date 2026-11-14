(() => {
  const cfg = window.BDAY || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const GIFT_COPY = {
    teddy: {
      emoji: "🧸",
      title: "A teddy to keep you company",
      body: "He is extra squishy on purpose. Whenever the day feels too big, squeeze him and remember: I am loving you from every direction at once."
    },
    ice: {
      emoji: "🍦",
      title: "Vanilla, because you are my favorite flavor",
      body: "Soft, sweet, and impossible not to smile at. If I could, I would buy you a never-ending cone and watch you be happy forever."
    },
    bouquet: {
      emoji: "💐",
      title: "A bouquet that will not wilt",
      body: "These flowers are made of pixels and promises. Every petal means I choose you — today, on your birthday, and in all the quiet days after."
    },
    necklace: {
      emoji: "💗",
      title: "A charm for your pretty heart",
      body: "Wear this in your mind: a tiny heart that says you are treasured. You make ordinary air feel like perfume."
    },
    cakebox: {
      emoji: "🎁",
      title: "A box of things I still owe you",
      body: "More dates. More late-night talks. More ‘I am proud of you.’ More reasons to blush. This box refills itself because my love does too."
    },
    letter: {
      emoji: "💌",
      title: "If my handwriting could hug you",
      body: "Happy birthday, my girl. Thank you for existing in a way that makes the world look more beautiful. I am so lucky it is you."
    }
  };

  function applyNames() {
    $$("[data-her-name]").forEach((el) => {
      el.textContent = cfg.herName || "My Love";
    });
    $$("[data-your-name]").forEach((el) => {
      el.textContent = cfg.yourName || "Yours forever";
    });
    const date = $("[data-date-label]");
    if (date && cfg.dateLabel) date.textContent = cfg.dateLabel;
    document.title = `Happy Birthday, ${cfg.herName || "My Love"}`;
  }

  function petals() {
    const wrap = $("#petals");
    if (!wrap) return;
    for (let i = 0; i < 18; i += 1) {
      const p = document.createElement("i");
      p.className = "petal";
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${8 + Math.random() * 10}s`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      p.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
      wrap.appendChild(p);
    }
  }

  /* Canvas hearts + confetti */
  const canvas = $("#fx-canvas");
  const ctx = canvas.getContext("2d");
  const bits = [];
  function sizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  sizeCanvas();
  addEventListener("resize", sizeCanvas);

  function burst(x, y, n = 80) {
    const colors = ["#ff6b9d", "#ffc2d4", "#fff", "#ffd36a", "#ff8fb3", "#e84a86"];
    for (let i = 0; i < n; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const s = 2 + Math.random() * 6;
      bits.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 4,
        life: 80 + Math.random() * 40,
        c: colors[i % colors.length],
        r: 2 + Math.random() * 3,
        heart: Math.random() > 0.55
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = bits.length - 1; i >= 0; i -= 1) {
      const b = bits[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.08;
      b.life -= 1;
      ctx.globalAlpha = Math.max(b.life / 100, 0);
      ctx.fillStyle = b.c;
      if (b.heart) {
        ctx.font = `${12 + b.r}px serif`;
        ctx.fillText("♥", b.x, b.y);
      } else {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (b.life <= 0) bits.splice(i, 1);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  tick();

  function openSite() {
    const intro = $("#intro");
    intro.classList.add("is-gone");
    setTimeout(() => intro.classList.add("is-removed"), 800);
    burst(innerWidth / 2, innerHeight / 3, 140);
    const song = $("#song");
    if (song && song.src) {
      song.play().catch(() => {});
      $("#music-btn")?.classList.add("is-on");
    }
  }

  $("#open-gift")?.addEventListener("click", openSite);
  $("#envelope")?.addEventListener("click", openSite);

  /* Music */
  const song = $("#song");
  const musicBtn = $("#music-btn");
  if (cfg.songPath && song) {
    fetch(cfg.songPath, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) return;
        song.src = cfg.songPath;
        musicBtn.hidden = false;
      })
      .catch(() => {});
  }
  musicBtn?.addEventListener("click", () => {
    if (!song.src) return;
    if (song.paused) {
      song.play();
      musicBtn.classList.add("is-on");
    } else {
      song.pause();
      musicBtn.classList.remove("is-on");
    }
  });

  /* Nav */
  $("#nav-toggle")?.addEventListener("click", () => {
    $("#nav-links").classList.toggle("is-open");
  });
  $$("#nav-links a").forEach((a) => {
    a.addEventListener("click", () => $("#nav-links").classList.remove("is-open"));
  });

  /* Gifts */
  const modal = $("#modal");
  $$(".gift").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.gift;
      const copy = GIFT_COPY[key];
      if (!copy) return;
      $("#modal-emoji").textContent = copy.emoji;
      $("#modal-title").textContent = copy.title;
      $("#modal-body").textContent = copy.body;
      modal.classList.add("is-open");
      const r = card.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 50);
    });
  });
  function closeModal() {
    modal.classList.remove("is-open");
  }
  $("#modal-close")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeModal();
    lightbox.classList.remove("is-open");
    lbImg.src = "";
  });

  /* Notes */
  const notesGrid = $("#notes-grid");
  (cfg.notes || []).forEach((note) => {
    const btn = document.createElement("button");
    btn.className = "note";
    btn.type = "button";
    btn.innerHTML = `
      <div class="note__inner">
        <div class="note__face note__front">
          <h3>${note.title}</h3>
          <span>Tap to open ♡</span>
        </div>
        <div class="note__face note__back">
          <p>${note.body}</p>
        </div>
      </div>`;
    btn.addEventListener("click", () => btn.classList.toggle("is-open"));
    notesGrid.appendChild(btn);
  });

  /* Reasons */
  const reasons = cfg.reasons || [];
  let ri = 0;
  function renderReason() {
    if (!reasons.length) return;
    $("#reason-text").textContent = reasons[ri];
    $("#reason-index").textContent = `${ri + 1} / ${reasons.length}`;
  }
  renderReason();
  $("#reason-prev")?.addEventListener("click", () => {
    ri = (ri - 1 + reasons.length) % reasons.length;
    renderReason();
  });
  $("#reason-next")?.addEventListener("click", () => {
    ri = (ri + 1) % reasons.length;
    renderReason();
  });
  setInterval(() => {
    if (!reasons.length) return;
    ri = (ri + 1) % reasons.length;
    renderReason();
  }, 7000);

  /* Hearts counter */
  let hearts = 0;
  const heartEl = $("#heart-count");
  $("#send-hearts")?.addEventListener("click", (e) => {
    hearts += 1000;
    heartEl.textContent = hearts.toLocaleString();
    burst(e.clientX, e.clientY, 90);
    const pct = $("#love-percent");
    if (pct) pct.textContent = `${Math.min(100 + Math.floor(hearts / 200), 999)}%`;
  });

  /* Rising hearts on click */
  document.addEventListener("click", (e) => {
    if (e.target.closest("button, a, .note, .gift, .polaroid, input, .intro")) return;
    const span = document.createElement("span");
    span.className = "click-heart";
    span.textContent = ["♡", "♥", "💗", "🌸"][Math.floor(Math.random() * 4)];
    span.style.left = `${e.clientX}px`;
    span.style.top = `${e.clientY}px`;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1000);
  });

  /* Cursor heart on desktop */
  const ch = $("#cursor-heart");
  if (ch && matchMedia("(pointer:fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      ch.style.opacity = "0.7";
      ch.style.left = `${e.clientX + 14}px`;
      ch.style.top = `${e.clientY + 14}px`;
    });
  }

  /* Gallery */
  const gallery = $("#gallery");
  const lightbox = $("#lightbox");
  const lbImg = $("#lightbox-img");
  const count = Number(cfg.photoCount) || 12;
  const folder = cfg.photoFolder || "photos";
  const ext = cfg.photoExt || "jpg";

  function openPhoto(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    lightbox.classList.add("is-open");
  }
  $("#lightbox-close")?.addEventListener("click", (e) => {
    e.stopPropagation();
    lightbox.classList.remove("is-open");
    lbImg.src = "";
  });
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("is-open");
      lbImg.src = "";
    }
  });

  for (let i = 1; i <= count; i += 1) {
    const src = `${folder}/${i}.${ext}`;
    const fig = document.createElement("button");
    fig.className = "polaroid";
    fig.type = "button";
    const img = document.createElement("img");
    img.alt = `${cfg.herName || "Her"} — photo ${i}`;
    img.loading = "lazy";
    const cap = document.createElement("span");
    cap.className = "cap";
    cap.textContent = `pretty no. ${i}`;
    img.src = src;
    img.addEventListener("error", () => {
      img.remove();
      const ph = document.createElement("div");
      ph.className = "ph";
      ph.innerHTML = `Add photo<br/>${i}.${ext}`;
      fig.prepend(ph);
    });
    fig.append(img, cap);
    fig.addEventListener("click", () => {
      if (fig.querySelector("img")) openPhoto(src, img.alt);
    });
    gallery.appendChild(fig);
  }

  /* Timeline + wishes */
  const tl = $("#timeline");
  (cfg.timeline || []).forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<small>${item.kicker}</small><h3>${item.title}</h3><p>${item.text}</p>`;
    tl.appendChild(li);
  });

  const wr = $("#wishes-row");
  (cfg.wishes || []).forEach((w) => {
    const d = document.createElement("article");
    d.className = "wish";
    d.textContent = w;
    wr.appendChild(d);
  });

  /* Cake */
  $("#cake-btn")?.addEventListener("click", (e) => {
    const cake = e.currentTarget;
    cake.classList.toggle("is-out");
    const out = cake.classList.contains("is-out");
    $("#cake-hint").textContent = out
      ? "Wish locked in. I hope every bit of it comes true."
      : "Candles are glowing again… tap to blow them out.";
    burst(innerWidth / 2, e.clientY, 120);
  });

  /* Sparkle counters */
  let k = 0;
  setInterval(() => {
    k += 1;
    const a = $("#spark-1");
    if (a) a.textContent = "∞";
    const b = $("#spark-2");
    if (b) b.textContent = String(100 + (k % 7));
  }, 1800);

  applyNames();
  petals();
})();
