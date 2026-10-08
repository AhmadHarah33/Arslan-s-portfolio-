# Ahmed Arslan — terminal portfolio

A portfolio site that works like a terminal on a dental-lab machine. Visitors type commands
(or tap the chips at the bottom) to see my work, the machines I service, and my projects.

## Commands

| Command | Shows |
| --- | --- |
| `help` | All commands |
| `whoami` | Who I am |
| `experience` | After-sales engineering at Mars Med Dent |
| `machines` / `software` | Equipment and lab software I support |
| `projects`, `open <name>` | Things I've built |
| `ssh <machine>` | A simulated remote repair session (`xtcera`, `riton`, `aura`, `furnace`, `dof`) |
| `languages`, `skills`, `education` | The rest of the CV |
| `hire`, `contact` | The short pitch and how to reach me |
| `neofetch`, `theme <uv\|furnace\|zirconia>` | Extras |

A link like `…/#projects` opens the site and runs that command.

## Editing content

All text lives in [`js/data.js`](js/data.js). Fill in `contact` (email, LinkedIn, WeChat,
WhatsApp); empty entries are hidden.

## Running and hosting

No build step. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

To publish on GitHub Pages: repository **Settings → Pages → Deploy from a branch**, pick the
branch and `/ (root)`.
