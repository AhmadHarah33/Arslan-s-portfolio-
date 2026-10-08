# Ahmed Arslan — portfolio

Personal site for Ahmed Arslan, after-sales engineer for digital dental equipment and software
engineer. Available in English, 简体中文, العربية (right-to-left) and Türkçe.

The earlier terminal-style version lives on at [`/terminal/`](terminal/).

## Editing

| What | Where |
| --- | --- |
| English text | `index.html` (every translatable element has a `data-i18n` key) |
| Chinese, Arabic, Turkish text | `assets/js/i18n.js`, same keys |
| Contact details (email, WeChat, WhatsApp, LinkedIn) | `CONTACT` at the top of `assets/js/site.js`; empty entries stay hidden |
| Photos | drop files into `assets/img/`: `portrait.jpg`, `work-1.jpg` … `work-6.jpg` |
| CV | put `cv.pdf` in `assets/`; the Download CV button appears by itself |

Language is picked from the visitor's browser, remembered after they switch, and can be
forced with a link like `…/#zh`.

## Built for visitors in China

No Google Fonts, CDNs or other third-party requests: the IBM Plex fonts are self-hosted in
`assets/fonts/` (SIL Open Font License), and Chinese text uses the system's PingFang /
Microsoft YaHei. Note that GitHub Pages and Vercel can still be slow from mainland China;
see the hosting notes in the chat history or ask before choosing a host.

## Running locally

No build step:

```bash
python3 -m http.server 8000
```
