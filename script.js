// ---- Fill these in before sharing --------------------------------------
// RSVP contacts. Leave the list empty and the RSVP section stays hidden.
// Example: { label: "Call · 98765 43210", number: "919876543210", whatsapp: true }
const RSVP_NUMBERS = [];
// -------------------------------------------------------------------------

// All times are India Standard Time (UTC+05:30)
const EVENTS = {
  reception: { title: "Reception - Ravneet & Chiranjeev", start: "2026-11-22T11:00", mins: 180,
    where: "K.K Resort, Talab Tillo, Bohri, Jammu" },
};

const IST = "+05:30";
const toUTCStamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

// Map links
document.querySelectorAll("[data-map]").forEach((a) => {
  a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(a.dataset.map);
});

// RSVP buttons
if (RSVP_NUMBERS.length) {
  const box = document.getElementById("rsvp-buttons");
  RSVP_NUMBERS.forEach(({ label, number, whatsapp }, i) => {
    const a = document.createElement("a");
    a.className = i === 0 ? "btn" : "btn ghost";
    a.textContent = label;
    if (whatsapp) {
      const msg = "Hello! Regarding the wedding invitation of Ravneet & Chiranjeev — ";
      a.href = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.href = `tel:+${number}`;
    }
    box.append(a);
  });
  document.getElementById("rsvp").hidden = false;
}

// Add to calendar (.ics download)
document.querySelectorAll("[data-cal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const e = EVENTS[btn.dataset.cal];
    const start = new Date(e.start + IST);
    const end = new Date(start.getTime() + e.mins * 60000);
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN",
      "BEGIN:VEVENT",
      `UID:${btn.dataset.cal}@ravneet-chiranjeev-wedding`,
      `DTSTAMP:${toUTCStamp(new Date())}`,
      `DTSTART:${toUTCStamp(start)}`,
      `DTEND:${toUTCStamp(end)}`,
      `SUMMARY:${e.title}`,
      `LOCATION:${e.where.replace(/,/g, "\\,")}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${btn.dataset.cal}.ics`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
});

// Personalised greeting from the link: ?to=Amarjeet Singh&city=Delhi&sub=W/F
// Values are written with textContent, so nothing in the URL can inject markup.
const params = new URLSearchParams(location.search);
const to = (params.get("to") || "").trim().slice(0, 60);
if (to) {
  const city = (params.get("city") || "").trim().slice(0, 40);
  const sub = (params.get("sub") || "W/F").trim().slice(0, 40);
  const guest = document.getElementById("guest");
  guest.querySelector(".guest-name").textContent = city ? `${to}, ${city}` : to;
  guest.querySelector(".guest-sub").textContent = sub;
  guest.hidden = false;
  document.title = `${to} · Ravneet weds Chiranjeev`;
}

// Opening seal: guests tap to open. Skipped on refresh within a session, or with ?intro=0
(() => {
  if (params.get("intro") === "0" || sessionStorage.getItem("opened")) return;

  const el = document.createElement("button");
  el.type = "button";
  el.className = "intro";
  el.setAttribute("aria-label", "Open the invitation");

  const eyebrow = document.createElement("p");
  eyebrow.className = "intro-eyebrow";
  eyebrow.textContent = "You are invited";

  const seal = document.createElement("div");
  seal.className = "seal";
  seal.textContent = "C & R";

  el.append(eyebrow, seal);

  if (to) {
    const forLine = document.createElement("p");
    forLine.className = "intro-for";
    const city = (params.get("city") || "").trim().slice(0, 40);
    forLine.textContent = city ? `${to}, ${city}` : to;
    el.append(forLine);
  }

  const tap = document.createElement("p");
  tap.className = "intro-tap";
  tap.textContent = "Tap to open";
  el.append(tap);

  document.body.classList.add("locked");
  document.body.append(el);

  el.addEventListener("click", () => {
    sessionStorage.setItem("opened", "1");
    el.classList.add("open");
    document.body.classList.remove("locked");
    setTimeout(() => el.remove(), 1100);
  });
  el.focus();
})();

// Twinkling sparkles on the cover
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const sp = document.querySelector(".sparkles");
  for (let i = 0; i < 12; i++) {
    const s = document.createElement("span");
    s.className = "spark";
    const size = 8 + Math.random() * 10;
    s.style.cssText = `left:${5 + Math.random() * 90}%;top:${5 + Math.random() * 90}%;width:${size}px;height:${size}px;` +
      `animation-delay:${-Math.random() * 3}s;animation-duration:${2.5 + Math.random() * 2.5}s`;
    sp.append(s);
  }
}

// Falling petals on the cover
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const box = document.querySelector(".petals");
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("span");
    const size = 8 + Math.random() * 12;
    p.className = "petal";
    p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
      `animation-duration:${9 + Math.random() * 9}s;animation-delay:${-Math.random() * 14}s;` +
      `--drift:${(Math.random() - 0.5) * 160}px`;
    box.append(p);
  }
}

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
