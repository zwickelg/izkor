# PROJECT_ACTIVITY_LOG.md — Izkor (יזכור)

> Auto-maintained log. Update after every significant change.

---

## Project Overview

**Izkor** is a Hebrew-language PWA for Jewish memorial prayers (Yizkor).  
Users enter the name/gender/details of a deceased person → the app guides them through a prayer sequence (Psalms, Kaddish, El Male Rahamim, etc.) one screen at a time.

- **Repo:** `C:\priv\MyDevelop\izkor\izkor`  
- **GitHub Pages:** `https://zwickelg.github.io/izkor/`  
- **CloudFront/S3:** `https://d5ajvage8yosb.cloudfront.net`  
- **Stack:** React 18 + TypeScript, Redux Toolkit, MUI v5 (RTL), HashRouter, LZ-string URL compression, `@react-pdf/renderer`, Web NFC API, `@hebcal/core`
- **Deploy:** `npm run deploy` (gh-pages) + manual copy of `/build` to S3  

---

## Commit History

| Hash | Date | Summary |
|------|------|---------|
| `6ff3022` | 2026-06-27 | Round image on last prayer page (PrayerEnd) |
| `7af9c63` | 2026-06-27 | Replace app icon with new candle/Star of David design |
| `ad5490e` | 2026-06-27 | Replace green WhatsApp image icon with MUI WhatsApp icon |
| `cf58971` | 2026-06-27 | Migrate deployment from GitHub Pages to S3/CloudFront |
| `a9a8e4a` | 2026-06-26 | Fix המשך button gradient: opaque dark-to-white via Box backgroundImage |
| `eb07c62` | 2026-06-26 | Improve PrayerDetails layout: centered rows, name+ז"ל on one line |
| `884d6e7` | 2026-06-26 | Fix NFC write: use scan() first to prevent Android OS interception |
| `8e1f725` | 2026-06-26 | Add deceased name to WhatsApp share; fix OG image meta tags |
| `ffadc74` | 2026-06-26 | NFC dialog with instructions/states; SwipeableDrawer; remove X button |
| `9048e73` | 2026-06-26 | Redesign print cover page: full-page border, name+ז"ל, בן/בת, תנצב"ה |
| `9b1c8fa` | 2026-06-26 | Add death date field (Hebrew/Gregorian), print cover page, URL sharing |
| `2c48f33` | 2026-06-26 | Add close button and opaque background to share drawer |
| `c6a578c` | 2026-06-26 | Show NFC always in share drawer, hide Waze |
| `82d7b8e` | 2026-06-26 | Replace share buttons with Share icon + bottom drawer |
| `554ce8b` | 2026-06-26 | Remove redundant logo192/512 from public/images |
| `949dca2` | 2026-06-26 | Fix zoom buttons visibility; update PWA app icons |
| `7de4f00` | 2026-06-26 | Replace A+/A- text buttons with ZoomIn/ZoomOut icons |
| `8678ced` | 2026-06-26 | Remove dead code from TTS removal |
| `2feebbb` | 2026-06-26 | UI overhaul; add CLAUDE.md, activity log, todo.txt |

---

## Current State (as of 2026-06-27)

### Uncommitted Changes
None — branch fully committed and deployed.

### New Files Added
| File | Purpose |
|------|---------|
| `src/components/utils/hebrewDate.ts` | Hebrew calendar utils using `@hebcal/core`: `formatHebrewDate`, `getHebrewDateParts`, `parseHebrewDay`, `parseHebrewYear`, `hebrewToGregorianISO`, `HEBREW_MONTHS` |
| `src/shareDialogBridge.ts` | Module-level singleton for App.tsx → PrayerDetails share drawer cross-component communication |
| `public/favicon.png` | 32×32 PNG favicon (replaced favicon.ico) |

---

## Work Completed This Session

### Death Date Feature
- Added `deathDate: string` to Redux slice (`izkorSlice.ts`)
- `MainForm.tsx`: date input with עברי/לועזי toggle
  - Gregorian: `<TextField type="date" />`
  - Hebrew: 3 fields — day (gematria letters א–ל), month (dropdown), year (gematria e.g. תשמ"ב)
- `deathDate` included in URL sharing (`updateFields` in both MainForm and PrayerAllPrint)
- `PrayerDetails.tsx`: shows date as `15.1.2024 / כ״ב בשבט תשפ״ד`

### Print Cover Page (`PrayerAllPrint.tsx`)
- Full first page with: circular image, name + ז"ל, בן/בת + parent name, date (Hebrew + Gregorian), תנצב"ה
- Full-page black border frame
- All text black, FrankRuehl font throughout

### Share Drawer (`PrayerDetails.tsx`)
- `Drawer` → `SwipeableDrawer`: swipe-to-close on mobile, click handle on desktop
- Removed X button; drag handle has `onClick` to close
- WhatsApp message includes: `תפילות לעילוי נשמת [שם] ז״ל\n[URL]`

### NFC (`NfcHandler.ts` + `PrayerDetails.tsx`)
- Dialog: idle → waiting → success/error (or confirm-overwrite if tag has data)
- Fixed IO error: now uses `scan()` first to claim NFC reader before Android OS intercepts
- `NfcTagNotEmptyError` class for overwrite detection

### PrayerDetails Layout
- Detail rows centered (`justifyContent: "center"`)
- Name + last name combined with ז"ל on one row: `שם: זהבה צויקל ז״ל`

### OG Meta Tags (`public/index.html`)
- Added `og:image`, `og:title`, `og:description`, `og:url` for WhatsApp link preview

---

## TODO List

| # | Item | Status |
|---|------|--------|
| — | **המשך button gradient** — gradient on outer Box (`backgroundImage` via top-level sx callback), Button transparent | ✅ Done |
| — | **Deploy to S3/CloudFront** — `npm run deploy` syncs to `s3://izkor` + CloudFront invalidation | ✅ Done |
| — | **Replace app icon** — new candle/Star of David/יזכור image; all sizes (512, 192, 32 favicon) | ✅ Done |
| — | **Round image on print last page** — `borderRadius: "50%"` in PrayerEnd.tsx | ✅ Done |
| — | **WhatsApp icon** — replaced custom SVG with MUI `<WhatsAppIcon />` (black/white, matches other icons) | ✅ Done |
| — | **Gregorian date picker** — replaced native date input with 3 fields (day text / month select / year text) | ✅ Done |
| — | **Share URL** — uses `window.location.origin` instead of hardcoded GitHub URL | ✅ Done |
| 2 | Wrap to Android app (TWA/Bubblewrap) | ✅ Done |
| 10 | Change the dark/light mode buttons | ⬜ Pending |
| 11 | Change color of name/parent name in prayers | ⬜ Pending |
| 13 | Upload image | ⬜ Pending |
| 14 | Add date and place of grave (Waze) | ⬜ Pending |
| 15 | Link to download the app | ⬜ Pending |
| 16 | How to quit the app | ⬜ Pending |
| 17 | Adjust screen size to fit | ⬜ Pending |
| 18 | Contrast in start page | ⬜ Pending |
| 20 | Allow X usage or unlimited usage | ⬜ Pending |

### Completed Items
| # | Item |
|---|------|
| 2 | Android TWA app via Bubblewrap — `app-release-signed.apk`, Digital Asset Links deployed |
| 1 | Make המשך button bigger in app (same as readonly) |
| 4 | Read-only mode: text not selectable |
| 5 | Divider between prayers |
| 6 | Title spacing |
| 7 | Remove selectable text in prayer text |
| 8 | Titles in bright background change color |
| 9 | Replace A+/A- text buttons with zoom icons |
| 12 | Round corners picture (print last page) |
| 19 | WhatsApp share includes deceased's name |

---

## Key Architecture Decisions

- **HashRouter** — required for GitHub Pages (no server-side routing)
- **URL sharing** — Redux state → LZ-string Base64 → `?data=` param; `mode: "readonly"` disables Back/Edit on shared links
- **RTL** — `stylis-plugin-rtl` + `@emotion/react` CacheProvider; `<html dir="rtl" lang="he">`
- **Hebrew dates** — `@hebcal/core` with `gematriya()` / `gematriyaStrToNum()`; year displayed as `gematriya(fullYear % 1000)` (drops 5000 prefix)
- **Share drawer** — `shareDialogBridge.ts` singleton connects App.tsx Share button → PrayerDetails drawer
- **NFC** — `scan()` must be called first (before `write()`) to prevent Android OS from intercepting the tag
- **Fonts** — `Assistant`, `FrankRuehl`, `nrkis` in `src/fonts/` and `public/fonts/`
- **Theming** — MUI v5 dark/light toggle; dark bg: `linear-gradient(135deg, #1a1c20 0%, #0f1013 100%)`

---

## Key Files

| File | Role |
|------|------|
| `src/Main.tsx` | Routes: `/`, `/page1`, `/page2`, `/print`, `/nfc` |
| `src/features/izkor/izkorSlice.ts` | Redux slice: `firstName, lastName, gender, parentName, version, mode, theme, deathDate` |
| `src/App.tsx` | MUI theme, RTL cache, dark/light toggle, zoom buttons (page2 only), Share button (page1 only) |
| `src/shareDialogBridge.ts` | Cross-component bridge: App.tsx Share button → PrayerDetails drawer |
| `src/components/utils/compressUtil.ts` | LZ-string compress/decompress for URL sharing |
| `src/components/utils/hebrewDate.ts` | Hebrew calendar utilities (`@hebcal/core`) |
| `src/components/utils/NfcHandler.ts` | Web NFC API wrapper; scan() + write() pattern |
| `src/components/prayers/MainForm.tsx` | Route `/` — name/details entry form; decodes `?data=` on load |
| `src/components/prayers/PrayerDetails.tsx` | Route `/page1` — review details; share drawer (WhatsApp/Copy/Print/NFC) |
| `src/components/prayers/PrayerAll.tsx` | Route `/page2` — scroll-paged prayer sequence |
| `src/components/prayers/PrayerAllPrint.tsx` | Route `/print` — print view with cover page |

---

## Resume Prompt

> Paste this into a new Claude Code session to continue exactly where we left off.

---

**Project:** Izkor (`C:\priv\MyDevelop\izkor\izkor`) — Hebrew PWA for Jewish memorial prayers.  
**Stack:** React 18 + TypeScript, Redux Toolkit, MUI v5 RTL, HashRouter, `@hebcal/core`, `@react-pdf/renderer`, Web NFC API.  
**Live:** `https://d5ajvage8yosb.cloudfront.net` (S3 + CloudFront; deploy with `npm run deploy`)  
**GitHub:** `https://github.com/zwickelg/izkor` — branch `main`, fully deployed and up to date.

**Recent completed work (this session):**
- Replaced app icon with new candle/Star of David/יזכור design (1024×1024 source → 512/192/32 sizes, favicon.png)
- Fixed `PrayerDetails.tsx` image src to use `process.env.PUBLIC_URL` instead of `baseUrl` (was causing broken image on dev server)
- Rounded the image on the last prayer page (`PrayerEnd.tsx`: `borderRadius: "50%"`)
- Replaced WhatsApp icon with MUI `<WhatsAppIcon />` (black/white, consistent with other share icons)
- Replaced native date picker with 3-field Gregorian input (day text / month select / year text) in `MainForm.tsx`
- Fixed share/NFC/WhatsApp URLs: `baseUrl = window.location.origin` (no more hardcoded GitHub URL)
- Migrated deployment from GitHub Pages to S3/CloudFront (`package.json` deploy script, `public/index.html` OG tags)

**Deployment:**
- AWS CLI at `C:\Program Files\Amazon\AWSCLIV2\aws.exe`
- S3 bucket: `izkor`; CloudFront distribution: `E32DMA5MLELYS2`
- IAM user `galit-cloude` (note spelling) — credentials valid 12 hours after `aws login`
- `npm run deploy` = `aws s3 sync build/ s3://izkor --delete && aws cloudfront create-invalidation ...`

**Key files changed this session:**
- `src/components/prayers/PrayerDetails.tsx` — image src fix, WhatsApp icon, share URL
- `src/components/prayers/PrayerEnd.tsx` — round image
- `src/components/prayers/MainForm.tsx` — 3-field Gregorian date input, המשך gradient
- `public/images/Izkor.png`, `public/logo512.png`, `public/logo192.png`, `public/favicon.png` — new icon
- `public/index.html` — favicon.png link, CloudFront OG tags
- `package.json` — S3/CloudFront deploy script

**Maintenance rules for Claude:**
- After every significant change, update `PROJECT_ACTIVITY_LOG.md`: add commit to table, update TODO statuses, refresh Resume Prompt.
- Only run `git commit`, `git push`, or `npm run deploy` when the user explicitly says those exact words.
- Never read or write `todo.txt` — it's the user's private notes.

**Pending TODO items:** Android TWA app, dark/light mode button redesign, name color in prayers, image upload, grave location/Waze, download link, quit instructions, screen size adjustment, start page contrast, X usage limits.

---

*Last updated: 2026-06-27*
