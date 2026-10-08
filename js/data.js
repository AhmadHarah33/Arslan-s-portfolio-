// Everything the terminal says about Ahmed lives here.
// Edit this file to update the site; terminal.js only renders it.

window.PROFILE = {
  name: "Ahmed Arslan",
  handle: "arslan",
  host: "mars-lab",
  role: "Software Engineer · After-Sales Engineer",
  company: "Mars Med Dent",
  born: "2004, Aleppo, Syria",
  based: "Turkey · Syria",
  openTo: "Engineering roles with dental CAD/CAM, 3D-printing and equipment companies, including relocation to China.",
  summary: [
    "I keep dental labs running. For three years I have been the engineer labs call when a milling machine, 3D printer, scanner or furnace stops. Most of the time I fix it remotely, by connecting to the machine and working through the fault. When remote isn't enough, I open it up and repair it by hand.",
    "I'm also a software engineer, so I build the tools my team and the business use: a technical-support platform for our engineers, an ERP for a dental equipment company, and a few products of my own.",
  ],

  experience: [
    {
      title: "After-Sales Engineer",
      org: "Mars Med Dent",
      when: "2023 – present",
      points: [
        "Install, service and repair CAD/CAM and digital-lab equipment for dental labs and clinics.",
        "Most cases are solved remotely: connect to the lab PC, read the machine logs, fix the setup.",
        "Hands-on repairs on zirconia mills, metal laser printers, resin printers, scanners and furnaces.",
        "Configure and support CAM and slicing software for milling, laser sintering and resin printing.",
        "Built the team's internal technical-support platform (customers, spare parts, service tasks).",
      ],
    },
  ],

  education: [
    {
      degree: "B.Sc. Software Engineering",
      school: "Nişantaşı University, Istanbul",
      when: "Graduated",
    },
  ],

  // Machines Ahmed has installed, serviced and repaired.
  machines: [
    { cat: "Zirconia milling", brands: ["XTCERA", "DOF"] },
    { cat: "Metal 3D laser",   brands: ["RITON", "FASTFORM"] },
    { cat: "Resin 3D printing", brands: ["RITON", "AURA 3D"] },
    { cat: "Intraoral & lab scanners", brands: ["DOF"] },
    { cat: "Lab furnaces",     brands: ["ZETİN", "XTCERA", "IVOCLAR", "+ other brands"] },
  ],

  // Software Ahmed configures and supports.
  software: [
    { use: "Milling CAM (zirconia & metal)", apps: ["hyperDENT", "Millbox"] },
    { use: "Resin 3D printing",              apps: ["CHITUBOX", "VoxelDance Tango"] },
    { use: "Metal laser printing (SLM)",     apps: ["VoxelDance Additive", "FastFab"] },
  ],

  skills: {
    "Hardware & service": ["Remote diagnostics", "Machine installation", "Calibration", "Spindle & axis repair", "Preventive maintenance", "Customer training"],
    "Languages & frameworks": ["TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS", "Node.js", "SQL"],
    "Data & infrastructure": ["PostgreSQL", "Supabase", "Docker", "Self-hosting", "Cloudflare Tunnel", "Vercel"],
    "Product": ["PWAs", "Arabic RTL interfaces", "Multilingual UIs (AR / EN / TR)", "Offline-first apps"],
  },

  languages: [
    { name: "Arabic",  level: "Native",  pct: 100 },
    { name: "English", level: "Fluent",  pct: 90 },
    { name: "Turkish", level: "Fluent",  pct: 90 },
  ],

  projects: [
    {
      id: "mars-support",
      name: "Mars Technical Support",
      repo: "AhmadHarah33/ahmad-arslan",
      tag: "work",
      blurb: "Internal work organizer and database for the Mars Med Dent support team.",
      details: [
        "Customers with their machines and serial numbers, spare-parts inventory, and engineer tasks on a Kanban board.",
        "Roles for the head of engineers and engineers, enforced with Postgres row-level security.",
        "Global search, QR codes per machine, service-report PDFs, preventive-maintenance schedules and warranty alerts.",
        "Installable PWA on phones; runs on a self-hosted Supabase in Docker.",
      ],
      stack: ["Next.js", "TypeScript", "Tailwind", "Supabase", "PWA"],
    },
    {
      id: "dentec-erp",
      name: "Dentec ERP",
      repo: "AhmadHarah33/dentec-erp",
      tag: "work",
      blurb: "Inventory, sales, purchasing, service and accounting for a dental equipment business.",
      details: [
        "Arabic-first (RTL) and Turkish-ready.",
        "Stock is an append-only ledger: on-hand is always derived, never stored.",
        "Invoices with per-line VAT, discounts, multi-currency and printable A4.",
        "Service jobs consume spare parts straight from stock. Self-hosted behind a tunnel.",
      ],
      stack: ["Next.js 15", "React 19", "TypeScript", "PostgreSQL", "Tailwind v4"],
    },
    {
      id: "pixmorph",
      name: "Pixmorph",
      repo: "AhmadHarah33/Pixmorph",
      url: "https://pixmorph.app",
      tag: "product",
      blurb: "Image converter that runs entirely in the browser. No file is ever uploaded.",
      details: [
        "Reads HEIC, JPG, PNG, WebP, AVIF, BMP, GIF, SVG and PDF; writes JPG, PNG, WebP and PDF.",
        "Compress-to-target-size, resize, crop and images-to-PDF.",
        "Conversion runs in a pool of up to four web workers.",
        "Fully static site, so hosting costs stay flat no matter the traffic.",
      ],
      stack: ["Next.js", "Web Workers", "pdf.js", "pdf-lib", "Static export"],
    },
    {
      id: "finance",
      name: "Finance Tracker",
      repo: "AhmadHarah33/finance-tracker",
      tag: "personal",
      blurb: "Expense tracker for the iPhone home screen: open, log one expense, close.",
      details: [
        "Opens straight onto a number pad; logging never waits on the network.",
        "Local-first in IndexedDB, works offline, any currency per account.",
        "Scans QR codes on Turkish market receipts to prefill expenses.",
        "Monthly reports, goals and per-category budgets.",
      ],
      stack: ["Next.js", "IndexedDB", "PWA", "Vitest"],
    },
    {
      id: "dentec-web",
      name: "DENTEC Website",
      repo: "AhmadHarah33/DENTEC-WEB",
      tag: "work",
      blurb: "Product website for DENTEC Premium Dental Solutions, in English, Turkish and Arabic.",
      details: [
        "Catalog of dental units, imaging, sterilization, air systems and operatory equipment.",
        "Three languages with full right-to-left support for Arabic.",
        "Includes an admin panel for managing products.",
      ],
      stack: ["React", "Vite", "TypeScript", "Tailwind"],
    },
    {
      id: "mars-expo",
      name: "Mars Med Dent Exhibition",
      repo: "AhmadHarah33/Mars",
      tag: "work",
      blurb: "Product categorization and search app used at the Mars Med Dent exhibition stand.",
      details: [
        "Visitors and staff search the product range by model (e.g. Xmill, DeskFab) and category.",
        "Turkish interface built for a fast, touch-friendly booth experience.",
      ],
      stack: ["React", "Vite", "TypeScript", "Tailwind"],
    },
  ],

  // Only filled-in entries are shown by the `contact` command.
  contact: {
    github: "https://github.com/AhmadHarah33",
    email: "",     // e.g. "ahmed@example.com"
    linkedin: "",  // e.g. "https://www.linkedin.com/in/..."
    wechat: "",    // useful for companies in China
    whatsapp: "",
  },
};
