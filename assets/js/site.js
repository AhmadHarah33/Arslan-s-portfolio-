(() => {
  "use strict";

  const LANGS = { en: { html: "en", dir: "ltr" }, zh: { html: "zh-CN", dir: "ltr" }, ar: { html: "ar", dir: "rtl" } };
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
    try { localStorage.setItem("lang", next); } catch (e) {}
  }

  function initialLang() {
    const hash = location.hash.replace("#", "");
    if (LANGS[hash]) return hash;
    try { const s = localStorage.getItem("lang"); if (LANGS[s]) return s; } catch (e) {}
    for (const l of navigator.languages || [navigator.language || "en"]) {
      const base = String(l).toLowerCase().split("-")[0];
      if (LANGS[base]) return base;
    }
    return "en";
  }

  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        btn.textContent = t("c.copied", "Copied");
      } catch (e) {
        const target = document.getElementById("email");
        const r = document.createRange();
        r.selectNodeContents(target);
        const s = getSelection();
        s.removeAllRanges();
        s.addRange(r);
      }
      setTimeout(() => (btn.textContent = t("c.copy", "Copy")), 1600);
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  setLang(initialLang());
})();
