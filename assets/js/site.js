(() => {
  "use strict";

  // Contact details. Empty entries are hidden on the page.
  const CONTACT = {
    email: "",      // e.g. "ahmed@example.com"
    wechat: "",     // WeChat ID, important for companies in China
    whatsapp: "",   // e.g. "+90 5xx xxx xx xx"
    linkedin: "",   // full URL
    github: "https://github.com/AhmadHarah33",
  };

  const LANGS = { en: { html: "en", dir: "ltr" }, zh: { html: "zh-CN", dir: "ltr" }, ar: { html: "ar", dir: "rtl" }, tr: { html: "tr", dir: "ltr" } };
  const dict = window.I18N || {};
  const nodes = [...document.querySelectorAll("[data-i18n]")];
  const english = new Map(nodes.map((n) => [n, n.innerHTML]));
  const enTitle = document.title;
  let lang = "en";

  const t = (key, fallback) => (dict[lang] && dict[lang][key]) || fallback;

  function setLang(next) {
    if (!LANGS[next]) next = "en";
    lang = next;
    const root = document.documentElement;
    root.lang = LANGS[next].html;
    root.dir = LANGS[next].dir;
    for (const n of nodes) {
      const v = next === "en" ? null : dict[next] && dict[next][n.dataset.i18n];
      n.innerHTML = v != null ? v : english.get(n);
    }
    document.title = next === "en" ? enTitle : t("meta.title", enTitle);
    document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === next)));
    document.querySelectorAll(".copy").forEach((b) => (b.textContent = t("c.copy", "Copy")));
    try { localStorage.setItem("lang", next); } catch (e) {}
  }

  function initialLang() {
    const hash = location.hash.replace("#", "");
    if (LANGS[hash]) return hash;
    try { const s = localStorage.getItem("lang"); if (LANGS[s]) return s; } catch (e) {}
    const nav = (navigator.languages || [navigator.language || "en"]).map((l) => l.toLowerCase());
    for (const l of nav) {
      const base = l.split("-")[0];
      if (LANGS[base]) return base;
    }
    return "en";
  }

  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

  /* contact list */
  function renderContact() {
    for (const row of document.querySelectorAll("[data-contact]")) {
      const key = row.dataset.contact;
      const v = CONTACT[key];
      if (!v) { row.hidden = true; continue; }
      const dd = row.querySelector("dd");
      dd.textContent = "";
      if (key === "github" || key === "linkedin") {
        const a = document.createElement("a");
        a.href = v; a.target = "_blank"; a.rel = "noopener";
        a.textContent = v.replace(/^https?:\/\/(www\.)?/, "");
        dd.append(a);
      } else {
        const span = document.createElement("span");
        span.textContent = v;
        if (key === "email") {
          const a = document.createElement("a");
          a.href = "mailto:" + v; a.append(span); dd.append(a);
        } else dd.append(span);
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "copy"; btn.textContent = t("c.copy", "Copy");
        btn.addEventListener("click", async () => {
          try { await navigator.clipboard.writeText(v); btn.textContent = t("c.copied", "Copied"); }
          catch (e) { const r = document.createRange(); r.selectNodeContents(span); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
          setTimeout(() => (btn.textContent = t("c.copy", "Copy")), 1600);
        });
        dd.append(btn);
      }
    }
  }

  /* photos: drop files into assets/img/ and they appear; until then the frame shows a placeholder */
  function loadPhotos() {
    for (const fig of document.querySelectorAll("[data-photo]")) {
      const img = new Image();
      img.alt = fig.querySelector(".ph__cap")?.textContent.trim() || "";
      img.decoding = "async";
      img.loading = "lazy";
      img.onload = () => {
        fig.querySelector(".ph__empty")?.remove();
        fig.prepend(img);
        fig.classList.add("has-img");
      };
      img.src = fig.dataset.photo;
    }
  }

  /* CV button shows only if assets/cv.pdf exists */
  function checkCv() {
    const link = document.getElementById("cv-link");
    if (!link || location.protocol === "file:") return;
    fetch(link.getAttribute("href"), { method: "HEAD" })
      .then((r) => { if (r.ok) link.hidden = false; })
      .catch(() => {});
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  setLang(initialLang());
  renderContact();
  loadPhotos();
  checkCv();
})();
