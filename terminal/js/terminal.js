(() => {
  "use strict";

  const P = window.PROFILE;
  const $ = (s) => document.querySelector(s);
  const out = $("#out");
  const screen = $("#screen");
  const input = $("#cmd");
  const form = $("#prompt-form");
  const promptLabel = $("#prompt-label");

  const USER = P.handle;
  const HOST = P.host;
  const PROMPT_HTML = `<span>${USER}</span>@<span class="p-host">${HOST}</span>:<span class="p-path">~</span>$`;
  promptLabel.innerHTML = PROMPT_HTML;

  /* ---------- helpers ---------- */

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const run = (cmd, label) => `<button type="button" class="run" data-cmd="${esc(cmd)}">${esc(label || cmd)}</button>`;
  const link = (href, label) => `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(label || href.replace(/^https?:\/\//, ""))}</a>`;
  const ghUrl = (repo) => `https://github.com/${repo}`;

  let skipping = false;
  const sleep = (ms) => (skipping ? Promise.resolve() : new Promise((r) => setTimeout(r, ms)));

  function scroll() { screen.scrollTop = screen.scrollHeight; }

  function print(html, cls = "blk") {
    const el = document.createElement("div");
    el.className = cls;
    el.innerHTML = html;
    out.appendChild(el);
    scroll();
    return el;
  }
  const line = (html = "") => print(html, "ln");
  const lines = (arr) => print(arr.map((l) => `<div class="ln">${l}</div>`).join(""));

  function echo(cmd) {
    print(`<span class="prompt">${PROMPT_HTML}</span><span class="typed">${esc(cmd)}</span>`, "echo");
  }

  /* ---------- art ---------- */

  const LETTERS = {
    A: [" █████╗ ", "██╔══██╗", "███████║", "██╔══██║", "██║  ██║", "╚═╝  ╚═╝"],
    R: ["██████╗ ", "██╔══██╗", "██████╔╝", "██╔══██╗", "██║  ██║", "╚═╝  ╚═╝"],
    S: ["███████╗", "██╔════╝", "███████╗", "╚════██║", "███████║", "╚══════╝"],
    L: ["██╗     ", "██║     ", "██║     ", "██║     ", "███████╗", "╚══════╝"],
    N: ["███╗   ██╗", "████╗  ██║", "██╔██╗ ██║", "██║╚██╗██║", "██║ ╚████║", "╚═╝  ╚═══╝"],
  };
  const BANNER = [0, 1, 2, 3, 4, 5].map((i) => "ARSLAN".split("").map((c) => LETTERS[c][i]).join(" ")).join("\n");

  const TOOTH = [
    "   .-''''-.  .-''''-.   ",
    "  /        \\/        \\  ",
    " |                    | ",
    " |    ●          ●    | ",
    " |                    | ",
    "  \\                  /  ",
    "   \\     .----.     /   ",
    "    |   /      \\   |    ",
    "    |  |        |  |    ",
    "    \\__/        \\__/    ",
  ].join("\n");

  /* ---------- data views ---------- */

  const uptime = () => {
    const start = new Date(2023, 0, 1);
    const yrs = Math.floor((Date.now() - start) / (365.25 * 864e5));
    return `${yrs} years at ${P.company}`;
  };

  function viewWhoami() {
    print(`<pre class="art banner" aria-label="${esc(P.name)}">${BANNER}</pre>`);
    lines([
      `<span class="b">${esc(P.name)}</span> <span class="dim">·</span> ${esc(P.role)}`,
      `<span class="dim">${esc(P.company)} · ${esc(P.based)}</span>`,
    ]);
    P.summary.forEach((para) => print(`<p class="para">${esc(para)}</p>`));
  }

  function viewExperience() {
    P.experience.forEach((e) => {
      lines([
        `<span class="h">${esc(e.when)}</span>`,
        `<span class="b">${esc(e.title)}</span> <span class="dim">@</span> <span class="acc">${esc(e.org)}</span>`,
        ...e.points.map((p) => `<span class="hang"><span class="dim">├─ </span>${esc(p)}</span>`),
      ]);
    });
    line(`<span class="dim">see also:</span> ${run("machines")}  ${run("software")}  ${run("ssh")}`);
  }

  function viewMachines() {
    const rows = P.machines.map((m) => `<tr><td class="acc2">${esc(m.cat)}</td><td>${m.brands.map((b) => `<span class="pill">${esc(b)}</span>`).join("")}</td></tr>`).join("");
    print(`<div class="ln h">Machines serviced &amp; repaired</div><div class="tbl"><table><thead><tr><th>Type</th><th>Brands</th></tr></thead><tbody>${rows}</tbody></table></div>`);
    line(`<span class="dim">try a remote session:</span> ${Object.keys(SESSIONS).map((k) => run("ssh " + k)).join("  ")}`);
  }

  function viewSoftware() {
    const rows = P.software.map((s) => `<tr><td class="acc2">${esc(s.use)}</td><td>${s.apps.map((a) => `<span class="pill">${esc(a)}</span>`).join("")}</td></tr>`).join("");
    print(`<div class="ln h">Lab software I set up &amp; support</div><div class="tbl"><table><thead><tr><th>Workflow</th><th>Applications</th></tr></thead><tbody>${rows}</tbody></table></div>`);
  }

  function viewProjects() {
    const rows = P.projects.map((p, i) =>
      `<tr><td class="dim">${String(i + 1).padStart(2, "0")}</td><td>${run("open " + p.id, p.id)}</td><td class="dim">${esc(p.tag)}</td><td>${esc(p.blurb)}</td></tr>`
    ).join("");
    print(`<div class="ln dim">~/projects — ${P.projects.length} entries</div><div class="tbl"><table><thead><tr><th>#</th><th>name</th><th>type</th><th>about</th></tr></thead><tbody>${rows}</tbody></table></div>`);
    line(`<span class="dim">type</span> open &lt;name&gt; <span class="dim">or</span> open &lt;#&gt; <span class="dim">for details</span>`);
  }

  function findProject(arg) {
    if (!arg) return null;
    const n = parseInt(arg, 10);
    if (!isNaN(n) && P.projects[n - 1]) return P.projects[n - 1];
    const a = arg.toLowerCase().replace(/^projects\//, "");
    return P.projects.find((p) => p.id === a || p.name.toLowerCase() === a) || null;
  }

  function viewProject(arg) {
    const p = findProject(arg);
    if (!p) {
      line(arg ? `<span class="err">open: ${esc(arg)}: no such project</span>` : `<span class="dim">usage:</span> open &lt;name|#&gt;`);
      return viewProjects();
    }
    const links = [link(ghUrl(p.repo), "github/" + p.repo.split("/")[1])];
    if (p.url) links.unshift(link(p.url));
    lines([
      `<span class="b">${esc(p.name)}</span> <span class="dim">[${esc(p.tag)}]</span>`,
      esc(p.blurb),
      "",
      ...p.details.map((d) => `<span class="hang"><span class="acc">› </span>${esc(d)}</span>`),
      "",
      `${p.stack.map((s) => `<span class="pill">${esc(s)}</span>`).join("")}`,
      links.join("  "),
    ]);
  }

  function viewSkills() {
    const html = Object.entries(P.skills).map(([k, v]) =>
      `<div class="ln h">${esc(k)}</div><div class="ln">${v.map((s) => `<span class="pill">${esc(s)}</span>`).join("")}</div>`
    ).join("");
    print(html);
  }

  function viewLanguages() {
    const W = 20;
    lines(P.languages.map((l) => {
      const n = Math.round((l.pct / 100) * W);
      return `${esc(l.name.padEnd(8))} <span class="bar">${"█".repeat(n)}</span><span class="dim">${"░".repeat(W - n)}</span> ${esc(l.level)}`;
    }));
    line(`<span class="dim">try:</span> ${run("marhaba")}  ${run("merhaba")}  ${run("nihao")}`);
  }

  function viewEducation() {
    lines(P.education.map((e) => `<span class="b">${esc(e.degree)}</span> <span class="dim">·</span> ${esc(e.school)} <span class="dim">· ${esc(e.when)}</span>`));
  }

  function viewContact() {
    const c = P.contact;
    const rows = [];
    if (c.email) rows.push(["email", `<span class="acc">${esc(c.email)}</span> ${run("copy " + c.email, "[copy]")}`]);
    if (c.github) rows.push(["github", link(c.github)]);
    if (c.linkedin) rows.push(["linkedin", link(c.linkedin)]);
    if (c.wechat) rows.push(["wechat", `<span class="acc">${esc(c.wechat)}</span> ${run("copy " + c.wechat, "[copy]")}`]);
    if (c.whatsapp) rows.push(["whatsapp", `<span class="acc">${esc(c.whatsapp)}</span>`]);
    print(`<div class="kv">${rows.map(([k, v]) => `<div>${k}</div><div>${v}</div>`).join("")}</div>`);
    line(`<span class="dim">based in ${esc(P.based)} · open to relocation</span>`);
  }

  function viewHire() {
    lines([
      `<span class="h">Why hire me</span>`,
      `<span class="ok">✔</span> 3 years in the field with dental CAD/CAM, metal &amp; resin 3D printing, scanners and furnaces.`,
      `<span class="ok">✔</span> I fix machines remotely first, so labs lose hours, not days.`,
      `<span class="ok">✔</span> Software engineer: I build the tools service teams actually use.`,
      `<span class="ok">✔</span> Arabic, English and Turkish, ready to support the Middle East and Türkiye.`,
      "",
      `<span class="dim">Open to:</span> ${esc(P.openTo)}`,
      `<span class="dim">Next:</span> ${run("contact")}`,
    ]);
  }

  function viewNeofetch() {
    const info = [
      `<span class="acc b">${USER}</span>@<span class="acc b">${HOST}</span>`,
      `<span class="dim">${"-".repeat(USER.length + HOST.length + 1)}</span>`,
      `<span class="acc2">Name</span>: ${esc(P.name)}`,
      `<span class="acc2">Born</span>: ${esc(P.born)}`,
      `<span class="acc2">Role</span>: ${esc(P.role)}`,
      `<span class="acc2">Uptime</span>: ${esc(uptime())}`,
      `<span class="acc2">Location</span>: ${esc(P.based)}`,
      `<span class="acc2">Degree</span>: ${esc(P.education[0].degree)}`,
      `<span class="acc2">Shell</span>: remote-diagnostics + bare hands`,
      `<span class="acc2">Machines</span>: ${P.machines.length} types, ${new Set(P.machines.flatMap((m) => m.brands)).size} brands`,
      `<span class="acc2">Locale</span>: ar_SY · en_US · tr_TR`,
      `<div class="swatches"><i style="background:var(--accent)"></i><i style="background:var(--accent-2)"></i><i style="background:var(--ok)"></i><i style="background:var(--err)"></i><i style="background:var(--fg)"></i><i style="background:var(--dim)"></i></div>`,
    ];
    print(`<div class="fetch"><pre class="art">${TOOTH}</pre><div>${info.map((l) => `<div class="ln">${l}</div>`).join("")}</div></div>`);
  }

  function viewHelp() {
    const groups = [
      ["About", [["whoami", "who I am"], ["experience", "where I work and what I do"], ["education", "degree"], ["languages", "Arabic · English · Turkish"]]],
      ["Work", [["machines", "equipment I service"], ["software", "CAM & slicing software"], ["projects", "things I've built"], ["open <name>", "project details"], ["skills", "tech & hardware skills"]]],
      ["Try", [["ssh <machine>", "watch a remote repair session"], ["neofetch", "system info"], ["hire", "the short pitch"], ["contact", "get in touch"]]],
      ["Shell", [["theme <uv|furnace|zirconia>", "change colors"], ["clear", "clear screen (alias: floss)"], ["history", "past commands"]]],
    ];
    print(groups.map(([g, cmds]) =>
      `<div class="ln h">${g}</div><div class="kv">${cmds.map(([c, d]) => `<div>${run(c.split(" ")[0] === c ? c : c.split(" ")[0], c)}</div><div class="dim">${esc(d)}</div>`).join("")}</div>`
    ).join(""));
    line(`<span class="dim">Tab completes, ↑/↓ browse history, Ctrl+C skips animations.</span>`);
  }

  /* ---------- remote sessions (simulated) ---------- */

  const SESSIONS = {
    xtcera: {
      machine: "XTCERA zirconia mill",
      fault: "Milling stopped mid-job: tool length out of tolerance",
      steps: [
        ["Reading machine log", "tool T3 Ø1.0 reported length +0.18 mm vs. table"],
        ["Checking tool magazine", "T3 worn, replaced by lab tech on video call"],
        ["Re-measuring tools with length sensor", "T1–T6 within ±0.01 mm"],
        ["Resuming job from last safe layer in CAM", "remaining 41 min"],
      ],
      result: "Job resumed. 9 crowns saved, no site visit needed.",
    },
    riton: {
      machine: "RITON metal laser printer (SLM)",
      fault: "Build paused: chamber oxygen above threshold",
      steps: [
        ["Reading chamber sensors", "O₂ 0.42% (limit 0.10%)"],
        ["Checking argon supply", "cylinder pressure low, swapped by lab"],
        ["Purging chamber", "O₂ 0.42% → 0.06%"],
        ["Resuming build in FastFab", "layer 812 / 1430"],
      ],
      result: "Build resumed. Co-Cr frameworks finished on time.",
    },
    aura: {
      machine: "AURA 3D resin printer",
      fault: "Models detaching from build plate",
      steps: [
        ["Reviewing slice settings in CHITUBOX", "bottom exposure 18 s, too low for this resin"],
        ["Running LCD exposure test", "light engine uniform, 405 nm OK"],
        ["Re-levelling build plate", "Z-offset corrected by 0.05 mm"],
        ["Updating resin profile", "bottom exposure 30 s, lift speed reduced"],
      ],
      result: "Test print passed. Profile saved for the lab's other printers.",
    },
    furnace: {
      machine: "ZETİN sintering furnace",
      fault: "Sintering program aborts at 900 °C",
      steps: [
        ["Reading program and error history", "thermocouple deviation alarm"],
        ["Comparing set vs. measured temperature", "drift of 23 °C above 850 °C"],
        ["Running calibration cycle", "offset corrected"],
        ["Restarting program", "ramp to 1530 °C, hold 120 min"],
      ],
      result: "Zirconia sintered. Calibration logged for next service.",
    },
    dof: {
      machine: "DOF scanner",
      fault: "Calibration fails after Windows update",
      steps: [
        ["Connecting to lab PC", "camera driver missing"],
        ["Reinstalling scanner drivers", "both cameras detected"],
        ["Running calibration with plate", "accuracy within spec"],
        ["Test scan of model", "export to CAD OK"],
      ],
      result: "Scanner back online in 20 minutes.",
    },
  };

  async function viewSsh(arg) {
    const key = (arg || "").toLowerCase();
    const s = SESSIONS[key];
    if (!s) {
      if (arg) line(`<span class="err">ssh: connect to host ${esc(arg)}: unknown machine</span>`);
      line(`<span class="dim">usage:</span> ssh &lt;machine&gt; <span class="dim">— simulated remote support sessions</span>`);
      lines(Object.entries(SESSIONS).map(([k, v]) => `${run("ssh " + k, k.padEnd(8))} <span class="dim">${esc(v.machine)}</span>`));
      return;
    }
    line(`<span class="dim">Connecting to ${esc(s.machine)} at a customer lab…</span>`);
    await sleep(500);
    line(`<span class="ok">Remote session established.</span> <span class="dim">(simulation)</span>`);
    await sleep(300);
    line(`<span class="err">FAULT</span> ${esc(s.fault)}`);
    for (const [step, res] of s.steps) {
      await sleep(350);
      const el = line(`<span class="acc">›</span> ${esc(step)} <span class="progress">…</span>`);
      await sleep(650);
      el.innerHTML = `<span class="ok">✔</span> ${esc(step)} <span class="dim">— ${esc(res)}</span>`;
      scroll();
    }
    await sleep(300);
    line(`<span class="ok b">FIXED</span> ${esc(s.result)}`);
    line(`<span class="dim">Connection to ${esc(key)} closed.</span>`);
  }

  /* ---------- skins ---------- */

  const SKINS = ["uv", "furnace", "zirconia"];
  function setSkin(name, save = true) {
    document.documentElement.setAttribute("data-skin", name);
    if (save) { try { localStorage.setItem("skin", name); } catch (e) {} }
  }
  try { const s = localStorage.getItem("skin"); if (SKINS.includes(s)) setSkin(s, false); } catch (e) {}

  /* ---------- commands ---------- */

  const history = [];
  let histIdx = 0;

  const COMMANDS = {
    help: viewHelp,
    whoami: viewWhoami,
    about: viewWhoami,
    experience: viewExperience,
    exp: viewExperience,
    work: viewExperience,
    machines: viewMachines,
    software: viewSoftware,
    projects: viewProjects,
    open: viewProject,
    cat: viewProject,
    skills: viewSkills,
    languages: viewLanguages,
    lang: viewLanguages,
    education: viewEducation,
    contact: viewContact,
    hire: viewHire,
    neofetch: viewNeofetch,
    ssh: viewSsh,
    banner: () => print(`<pre class="art banner">${BANNER}</pre>`),
    ls: (a) => {
      if (a && a.replace(/\/$/, "") === "projects") return viewProjects();
      line(["about.txt", "experience.log", "machines/", "projects/", "skills.json", "contact.vcf"].map((f) =>
        run({ "about.txt": "whoami", "experience.log": "experience", "machines/": "machines", "projects/": "projects", "skills.json": "skills", "contact.vcf": "contact" }[f], f)).join("   "));
    },
    pwd: () => line(`/home/${USER}`),
    cd: (a) => line(a ? `<span class="dim">cd: no need, just type</span> ${run(a.replace(/\/$/, ""))}` : ""),
    date: () => line(new Date().toString()),
    echo: (a, raw) => line(esc(raw)),
    history: () => lines(history.map((h, i) => `<span class="dim">${String(i + 1).padStart(4)}</span>  ${esc(h)}`)),
    clear: () => { out.innerHTML = ""; },
    floss: () => { out.innerHTML = ""; },
    theme: (a) => {
      if (!SKINS.includes(a)) {
        line(`<span class="dim">usage:</span> theme ${SKINS.map((s) => run("theme " + s, s)).join(" | ")}`);
        line(`<span class="dim">uv = 405 nm resin light · furnace = sintering glow · zirconia = light</span>`);
        return;
      }
      setSkin(a);
      line(`<span class="ok">theme set to ${esc(a)}</span>`);
    },
    copy: async (a) => {
      try { await navigator.clipboard.writeText(a); line(`<span class="ok">copied</span> ${esc(a)}`); }
      catch (e) { line(`<span class="dim">select and copy:</span> ${esc(a)}`); }
    },
    sudo: (a) => line(a && /extract|pull/.test(a)
      ? `<span class="err">Permission denied:</span> you are not a dentist. I just keep their machines running.`
      : `<span class="err">${USER} is not in the sudoers file.</span> This incident will be reported to the head of engineers.`),
    rm: () => line(`<span class="err">rm: refusing to remove the lab.</span> Try ${run("clear")}.`),
    exit: () => line(`<span class="dim">There's no exit from a dental lab. Try</span> ${run("contact")}.`),
    brush: () => line(`<span class="dim">2-minute timer started. Good habit.</span>`),
    drill: () => line(`<span class="acc2">bzzzzzzzzzzzz…</span> <span class="dim">spindle at 60 000 rpm.</span>`),
    marhaba: () => line(`<span class="acc">مرحبا!</span> أنا أحمد، مهندس برمجيات ومهندس خدمة ما بعد البيع.`),
    merhaba: () => line(`<span class="acc">Merhaba!</span> Ben Ahmed, yazılım mühendisi ve satış sonrası hizmet mühendisiyim.`),
    nihao: () => line(`<span class="acc">你好!</span> I'm Ahmed, and I'd love to work with dental equipment companies in China.`),
    hello: () => line(`<span class="acc">Hello!</span> Type ${run("help")} to look around.`),
  };
  COMMANDS["你好"] = COMMANDS.nihao;
  COMMANDS["مرحبا"] = COMMANDS.marhaba;
  COMMANDS.hi = COMMANDS.hello;

  const COMPLETABLE = ["help", "whoami", "experience", "machines", "software", "projects", "open", "skills", "languages", "education", "contact", "hire", "neofetch", "ssh", "theme", "clear", "history", "banner", "ls"];

  function suggest(name) {
    const dist = (a, b) => {
      const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
      for (let j = 1; j <= b.length; j++) d[0][j] = j;
      for (let i = 1; i <= a.length; i++)
        for (let j = 1; j <= b.length; j++)
          d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      return d[a.length][b.length];
    };
    let best = null, bd = 3;
    for (const c of COMPLETABLE) { const x = dist(name, c); if (x < bd) { bd = x; best = c; } }
    return best;
  }

  let busy = false;
  async function exec(raw, { record = true } = {}) {
    const cmdline = raw.trim();
    echo(cmdline);
    if (!cmdline) return;
    if (record) { history.push(cmdline); histIdx = history.length; }
    const [name, ...rest] = cmdline.split(/\s+/);
    const arg = rest.join(" ");
    const fn = COMMANDS[name.toLowerCase()];
    if (!fn) {
      const s = suggest(name.toLowerCase());
      line(`<span class="err">command not found: ${esc(name)}</span>${s ? ` <span class="dim">— did you mean</span> ${run(s)}<span class="dim">?</span>` : ` <span class="dim">— type</span> ${run("help")}`}`);
      return;
    }
    busy = true;
    skipping = false;
    input.disabled = true;
    try { await fn(arg, cmdline.slice(name.length).trim()); }
    finally {
      busy = false;
      skipping = false;
      input.disabled = false;
      if (!matchMedia("(pointer: coarse)").matches) input.focus();
      scroll();
    }
  }

  /* ---------- input ---------- */

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (busy) return;
    const v = input.value;
    input.value = "";
    exec(v);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx > 0) input.value = history[--histIdx];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < history.length - 1) input.value = history[++histIdx];
      else { histIdx = history.length; input.value = ""; }
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      out.innerHTML = "";
    } else if (e.key === "c" && e.ctrlKey && !window.getSelection().toString()) {
      echo(input.value + "^C");
      input.value = "";
    }
  });

  function complete() {
    const v = input.value;
    const parts = v.split(/\s+/);
    let pool, prefix;
    if (parts.length <= 1) { pool = COMPLETABLE; prefix = parts[0] || ""; }
    else {
      const c = parts[0].toLowerCase();
      prefix = parts.slice(1).join(" ");
      pool = c === "open" || c === "cat" ? P.projects.map((p) => p.id)
        : c === "ssh" ? Object.keys(SESSIONS)
        : c === "theme" ? SKINS : [];
    }
    const hits = pool.filter((x) => x.startsWith(prefix.toLowerCase()));
    if (hits.length === 1) {
      input.value = (parts.length <= 1 ? "" : parts[0] + " ") + hits[0] + (parts.length <= 1 ? " " : "");
    } else if (hits.length > 1) {
      echo(v);
      line(hits.map((h) => `<span class="acc">${esc(h)}</span>`).join("   "));
    }
  }

  // Ctrl+C / Escape / click during an animation skips it.
  document.addEventListener("keydown", (e) => {
    if (busy && (e.key === "Escape" || (e.key === "c" && e.ctrlKey))) skipping = true;
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-cmd]");
    if (t) {
      e.preventDefault();
      if (!busy) exec(t.dataset.cmd);
      return;
    }
    if (busy) { skipping = true; return; }
    if (e.target.closest(".screen") && !window.getSelection().toString() && !e.target.closest("a")) input.focus();
  });

  /* ---------- chips ---------- */

  const chips = $("#chips");
  ["help", "whoami", "experience", "machines", "projects", "ssh xtcera", "languages", "hire", "contact", "theme"].forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.cmd = c;
    b.textContent = c;
    chips.appendChild(b);
  });

  /* ---------- status bar telemetry ---------- */

  const stRpm = $("#st-rpm"), stTemp = $("#st-temp"), stUp = $("#st-up");
  stUp.textContent = uptime().split(" ")[0] + "y";
  let rpm = 0, temp = 24, t = 20;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function tick() {
    t++;
    const milling = Math.floor(t / 20) % 3 !== 0;
    rpm += ((milling ? 60000 : 0) - rpm) * 0.25 + (milling ? (Math.random() - 0.5) * 400 : 0);
    temp += (1530 - temp) * 0.015 + (Math.random() - 0.5) * 2;
    stRpm.textContent = Math.max(0, Math.round(rpm / 10) * 10).toLocaleString("en-US");
    stTemp.textContent = Math.round(temp).toLocaleString("en-US");
  }
  if (reduce) { stRpm.textContent = "60,000"; stTemp.textContent = "1,530"; }
  else setInterval(tick, 500);

  /* ---------- boot ---------- */

  const BOOT = [
    ["MarsOS 3.0 (tty1) — dental lab edition", "dim"],
    ["Checking 5 machine types across 9 brands", "dim"],
    ["Spinning up zirconia mill spindle (XTCERA, DOF)", "ok"],
    ["Warming 405 nm light engine (RITON, AURA 3D)", "ok"],
    ["Filling metal laser chamber with argon (RITON, FASTFORM)", "ok"],
    ["Ramping sintering furnace to 1530 °C (ZETİN, XTCERA, IVOCLAR)", "ok"],
    ["Calibrating scanners (DOF)", "ok"],
    ["Loading hyperDENT, Millbox, CHITUBOX, VoxelDance, FastFab", "ok"],
    ["Starting remote-support daemon", "ok"],
    ["Mounting locales ar_SY, en_US, tr_TR", "ok"],
    ["Compiling software-engineer.so", "ok"],
  ];

  async function boot() {
    busy = true;
    input.disabled = true;
    for (const [msg, kind] of BOOT) {
      line(kind === "ok" ? `<span class="dim">[</span><span class="ok"> OK </span><span class="dim">]</span> ${esc(msg)}` : `<span class="dim">${esc(msg)}</span>`);
      await sleep(110);
    }
    await sleep(250);
    out.innerHTML = "";
    busy = false;
    skipping = false;
    viewWhoami();
    line(`Type ${run("help")} or tap a command below. Start with ${run("hire")} if you're in a hurry.`);
    input.disabled = false;
    if (!matchMedia("(pointer: coarse)").matches) input.focus();

    const hash = location.hash.replace("#", "");
    if (hash && COMMANDS[hash]) exec(hash);
  }

  if (reduce) skipping = true;
  boot();
})();
