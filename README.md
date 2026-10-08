# Ahmed Arslan — portfolio

One-page site for Ahmed Arslan, after-sales service engineer for digital dental lab equipment at
Mars Med Dent, Istanbul. English, 简体中文 and العربية (right-to-left). White mode only.

## Editing

| What | Where |
| --- | --- |
| English text | `index.html` (each translatable element has a `data-i18n` key) |
| Chinese and Arabic text | `assets/js/i18n.js`, same keys |
| Contact details | the Contact section in `index.html` |

Language follows the visitor's browser, is remembered after they switch, and can be forced with a
link ending in `#zh` or `#ar`.

## Built for visitors in China

No Google Fonts, CDNs or other third-party requests. IBM Plex Sans and Plex Sans Arabic are
self-hosted in `assets/fonts/` (SIL Open Font License); Chinese uses the system's PingFang or
Microsoft YaHei.

## Old version

The earlier terminal-style site is kept in `terminal/` but is not linked from the main page.

## Running locally

```bash
python3 -m http.server 8000
```
