# PROJECT_ACTIVITY_LOG.md — Izkor (יזכור)

> Auto-maintained log. Update after every significant change.

---

## Project Overview

**Izkor** is a Hebrew-language PWA for Jewish memorial prayers (Yizkor).  
Users enter the name/gender/details of a deceased person → the app guides them through a prayer sequence (Psalms, Kaddish, El Male Rahamim, etc.) one screen at a time.

- **Repo:** `C:\priv\MyDevelop\izkor\izkor`  
- **GitHub Pages:** `https://zwickelg.github.io/izkor/`  
- **CloudFront/S3:** `https://d5ajvage8yosb.cloudfront.net`  
- **Stack:** React 18 + TypeScript, Redux Toolkit, MUI v5 (RTL), HashRouter, LZ-string URL compression, `@react-pdf/renderer`, Web NFC API  
- **Deploy:** `npm run deploy` (gh-pages) + manual copy of `/build` to S3  

---

## Commit History

| Hash | Date | Summary |
|------|------|---------|
| `2c7e399` | recent | Update app with recent changes (MainForm styling, SplashScreen, PrayerDetails, PrayerName, PrayerStart tweaks; deleted PrayerStartN.tsx and copy files) |
| `9a985f3` | recent | Fix reactive compressedUrl in PrayerDetails — WhatsApp share always includes data |
| `64fee35` | recent | Fix GitHub Pages deployment routing and URL parameter extraction |
| `b8dfc16` | recent | UI/UX modernization, print bug fixes, navigation improvements; added fonts, images, PWA manifest, PDF support |
| `71dc70d` | initial | Initialize project using Create React App |

---

## Current State (as of 2026-06-26)

### Uncommitted Changes
There are **many modified files** not yet committed — virtually every component has been touched since the last commit. Key changes pending commit:

- `src/App.tsx`, `src/App.css`, `src/index.css`, `src/index.tsx`
- All prayer components: `PrayerAll`, `PrayerAllPrint`, `PrayerDetails`, `PrayerElMaleRahamim`, `PrayerEnd`, `PrayerKadhshYatom`, `PrayerName`, `PrayerStart`, all `PrayerThilim*`
- `PrayerButtons.tsx/.module.css`, `PrayerAll.module.css`, `PrayerDetails.module.css`
- `IzkorPdfDocument.tsx`
- `public/index.html`, `public/manifest.json`
- **Deleted:** `PrayerStartN.tsx`, `Prayers.module copy.css`

### New Untracked Files (not yet committed)
| File | Status |
|------|--------|
| `src/components/utils/useVoice.ts` | **Fully implemented** TTS hook — Hebrew voice selection, nikud stripping, God's-name substitution, rate/pitch tuning |
| `src/components/utils/VoiceButton.tsx` | **Stubbed** — imports `useVoice` but `return null` (feature started, not wired up yet) |
| `src/components/prayers/PrayerDetails copy.tsx` | Backup copy — can be deleted |
| `CLAUDE.md` | Project instructions for Claude Code |
| `todo.txt` | Task list (see below) |

### Voice/TTS Feature Status
**Removed (2026-06-26)** — the TTS output sounded bad in practice. Files deleted:
- `src/components/utils/useVoice.ts` — deleted
- `src/components/utils/VoiceButton.tsx` — deleted
- All `import VoiceButton` + `<VoiceButton>` usages cleaned from 10 prayer components
- `src/components/prayers/PrayerDetails copy.tsx` — deleted (stale backup)

---

## TODO List (from `todo.txt`)

| # | Item | Status |
|---|------|--------|
| 1 | Bigger main-page button (match readonly size) | ✅ Done |
| 2 | Wrap to Android app | ⬜ Pending |
| 3 | Deploy to S3 | ⬜ Pending |
| 4 | Read-only — text not selectable | ✅ Done |
| 5 | Divider between prayers | ✅ Done |
| 6 | Title spacing | ✅ Done |
| 7 | Remove selectable text in prayer texts | ✅ Done |
| 8 | Titles in bright background should change color | ⬜ Pending |
| 9 | Change A+/A- buttons to magnifying glass | ⬜ Pending |
| 10 | Change dark/bright mode buttons | ⬜ Pending |
| 11 | Change color of name and mother/father name in prayers | ⬜ Pending |
| 12 | Round corners picture | ⬜ Pending |
| 13 | Upload image | ⬜ Pending |
| 14 | Add date and place of grave (maybe Waze integration) | ⬜ Pending |
| 15 | Add link to download the application | ⬜ Pending |
| 16 | How to quit the app | ⬜ Pending |
| 17 | Adjust screen size to fit | ⬜ Pending |
| 18 | Contrast in start page | ⬜ Pending |
| 19 | When sharing via WhatsApp, add name of deceased | ⬜ Pending |
| 20 | Allow X usage or unlimited usage | ⬜ Pending |

---

## Key Architecture Decisions

- **HashRouter** — required for GitHub Pages (no server-side routing)
- **URL sharing** — Redux state → LZ-string Base64 → `?data=` param; `mode: "readonly"` disables Back/Edit on shared links
- **RTL** — `stylis-plugin-rtl` + `@emotion/react` CacheProvider; `<html dir="rtl" lang="he">`
- **Fonts** — `Assistant`, `FrankRuehl`, `nrkis` in `src/fonts/` and `public/fonts/`
- **PDF** — `@react-pdf/renderer` via `IzkorPdfDocument.tsx`, lazily loaded
- **NFC** — `NfcHandler.ts` wraps Web NFC API (Chrome Android only)
- **Theming** — MUI v5 dark/light toggle + `--prayer-font-size` CSS variable for A+/A- font size control

---

## Key Files

| File | Role |
|------|------|
| `src/Main.tsx` | Routes: `/`, `/page1`, `/page2`, `/print`, `/nfc` |
| `src/features/izkor/izkorSlice.ts` | Redux slice: `firstName, lastName, gender, parentName, version, mode, theme` |
| `src/App.tsx` | MUI theme setup, RTL cache, dark/light toggle, font size control |
| `src/components/utils/compressUtil.ts` | LZ-string compress/decompress for URL sharing |
| `src/components/prayers/MainForm.tsx` | Route `/` — name entry form; decompresses `?data=` on load |
| `src/components/prayers/PrayerDetails.tsx` | Route `/page1` — review, share (WhatsApp/NFC), print |
| `src/components/prayers/PrayerAll.tsx` | Route `/page2` — scroll-paged prayer sequence |
| `src/components/prayers/PrayerAllPrint.tsx` | Route `/print` — flat print view |

---

## Resume Prompt

> Paste this into a new Claude Code session to continue exactly where we left off.

---

**Project:** Izkor (`C:\priv\MyDevelop\izkor\izkor`) — Hebrew PWA for Jewish memorial prayers (React 18 + TypeScript + Redux + MUI v5 RTL + HashRouter).

**Current branch:** `main`  
**Last committed state:** `2c7e399` — general component updates. There are many uncommitted modifications across nearly every component.

**Pending work (pick up from here):**
1. Commit the current uncommitted changes (many modified files across all components)
2. Address todo.txt items — see the TODO table in this file; items 8–20 are all pending
3. Deploy: `npm run build && npm run deploy`, then copy `/build` to S3

**Key context:**
- URL sharing works via `?data=` LZ-string compressed Redux state; `mode: "readonly"` disables navigation on shared links
- Hebrew fonts in `public/fonts/` and `src/fonts/`
- NFC write feature in `NfcHandler.ts` (Chrome Android only)
- Check `PROJECT_ACTIVITY_LOG.md` for full context and architecture notes

---

*Last updated: 2026-06-26*
