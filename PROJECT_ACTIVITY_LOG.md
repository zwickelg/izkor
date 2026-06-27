# PROJECT_ACTIVITY_LOG.md — Izkor (יזכור)

> Auto-maintained log. Update after every significant change.

---

## Project Overview

**Izkor** is a Hebrew-language PWA for Jewish memorial prayers (Yizkor).  
Users enter the name/gender/details of a deceased person → the app guides them through a prayer sequence (Psalms, Kaddish, El Male Rahamim, etc.) one screen at a time.

- **Repo:** `C:\priv\MyDevelop\izkor\izkor`  
- **CloudFront/S3:** `https://d5ajvage8yosb.cloudfront.net`  
- **Stack:** React 18 + TypeScript, Redux Toolkit, MUI v5 (RTL), HashRouter, LZ-string URL compression, `@react-pdf/renderer`, Web NFC API, `@hebcal/core`
- **Deploy:** `npm run deploy` → builds + syncs to S3 + CloudFront invalidation

---

## Commit History

| Hash | Date | Summary |
|------|------|---------|
| `58efa3e` | 2026-06-27 | Add Android TWA app via Bubblewrap |
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
None — branch fully committed and pushed.

### Google Play Publishing Status
- Developer account (`zwickelg@gmail.com`, ID: `5848737244631385419`) was closed on Mar 14, 2024 due to inactivity.
- Cannot create new account with same Google account — blocked by Google.
- Appeal submitted via Google Play support form (June 2026). Awaiting response (1–5 business days).
- If appeal fails: register new developer account with a different Google account ($25 fee), then update package name in `twa-manifest.json` and rebuild APK.

### Play Store Assets (`play-store-assets/`)
| File | Description |
|------|-------------|
| `screenshot_01_home.png` | Entry form — dark mode |
| `screenshot_03_details.png` | Prayer details — dark mode, male (דוד לוי) |
| `screenshot_04_prayer.png` | Prayer text — dark mode |
| `screenshot_05_prayer2.png` | Psalm 16 — dark mode |
| `screenshot_07_details_light.png` | Prayer details — light mode, female (מרים כהן / אסתר) |
| `screenshot_08_prayer_light.png` | Prayer text — light mode |
| `store_icon.png` | App icon |

**Still needed:** one screenshot showing the share drawer open. `images/Izkor.png` re-uploaded to S3 and CF invalidation submitted 2026-06-27 (should propagate within minutes).

### Privacy Policy
Live at `https://d5ajvage8yosb.cloudfront.net/privacy.html` — bilingual (Hebrew + English). Also in `public/privacy.html`.

### Android TWA Setup
| File | Purpose |
|------|---------|
| `twa-manifest.json` | Bubblewrap configuration (package: `com.izkor.app`) |
| `build.gradle`, `settings.gradle`, `gradle.properties` | Android/Gradle build config |
| `gradlew`, `gradlew.bat` | Gradle wrapper scripts |
| `gradle/` | Gradle wrapper jar + properties |
| `app/` | Android app source (Java + resources) |
| `assetlinks.json` | Digital Asset Links — deployed to `s3://izkor/.well-known/assetlinks.json` |
| `android.keystore` | Signing keystore — **NOT in git**, keep backed up |

**To rebuild the APK:**
```
$env:JAVA_HOME = "C:\Users\zwick\.bubblewrap\jdk\jdk-17.0.11+9"
bubblewrap build
# Enter keystore password when prompted
# Output: app-release-signed.apk (side-load) and app/build/outputs/bundle/release/app-release.aab (Play Store)
```

---

## TODO List

| # | Item | Status |
|---|------|--------|
| 13 | Upload image | ⬜ Pending |
| 15 | Link to download the app | ⬜ Pending |
| 16 | How to quit the app | ⬜ Pending |
| 17 | Adjust screen size to fit | ⬜ Pending |
| 20 | Allow X usage or unlimited usage | ⬜ Pending |

### Completed Items
| # | Item |
|---|------|
| 2 | Android TWA via Bubblewrap — `app-release-signed.apk` + Digital Asset Links at `/.well-known/assetlinks.json` |
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
- **TWA** — Bubblewrap-generated Android project; Digital Asset Links at `/.well-known/assetlinks.json` on CloudFront; Gradle heap reduced to 512m; Bubblewrap JDK at `C:\Users\zwick\.bubblewrap\jdk\jdk-17.0.11+9`

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
| `twa-manifest.json` | Bubblewrap TWA config |
| `android.keystore` | APK signing key (NOT in git — back up separately) |
| `assetlinks.json` | Digital Asset Links (also deployed to S3) |

---

## Resume Prompt

> Paste this into a new Claude Code session to continue exactly where we left off.

---

**Project:** Izkor (`C:\priv\MyDevelop\izkor\izkor`) — Hebrew PWA for Jewish memorial prayers.  
**Stack:** React 18 + TypeScript, Redux Toolkit, MUI v5 RTL, HashRouter, `@hebcal/core`, `@react-pdf/renderer`, Web NFC API.  
**Live:** `https://d5ajvage8yosb.cloudfront.net` (S3 + CloudFront; deploy with `npm run deploy`)  
**GitHub:** `https://github.com/zwickelg/izkor` — branch `main`, fully committed and pushed.

**Recent completed work (this session):**
- Built Android TWA app using Bubblewrap (package: `com.izkor.app`)
- Fixed `public/manifest.json`: split icon purposes into separate entries, `start_url: /`
- Generated `assetlinks.json` and deployed to `s3://izkor/.well-known/assetlinks.json` — enables full-screen TWA (no browser bar)
- Configured `gradle.properties`: Bubblewrap JDK path + reduced heap to 512m (was failing with 1536m)
- APK signed with `android.keystore` (alias: `android`, keystore NOT in git)
- Created privacy policy at `public/privacy.html` — deployed to `https://d5ajvage8yosb.cloudfront.net/privacy.html`
- Uploaded new `images/Izkor.png` to S3; re-uploaded and invalidated CF again 2026-06-27 (was still serving old rose photo)
- Prepared Play Store screenshots in `play-store-assets/` (6 screenshots done; share drawer screenshot still needed)
- Retook `screenshot_03_details.png` (dark, דוד לוי) and `screenshot_07_details_light.png` (light, מרים כהן) with correct candle/Star of David image
- Google Play developer account appeal submitted (account closed for inactivity since Mar 2024)

**Deployment:**
- AWS CLI at `C:\Program Files\Amazon\AWSCLIV2\aws.exe`
- S3 bucket: `izkor`; CloudFront distribution: `E32DMA5MLELYS2`
- IAM user `galit-cloude` (note spelling) — credentials valid 12 hours after `aws login`
- `npm run deploy` = build + S3 sync + CloudFront invalidation

**To rebuild APK:**
```
$env:JAVA_HOME = "C:\Users\zwick\.bubblewrap\jdk\jdk-17.0.11+9"
bubblewrap build
```

**Maintenance rules for Claude:**
- After every significant change, update `PROJECT_ACTIVITY_LOG.md`: add commit to table, update TODO statuses, refresh Resume Prompt.
- Only run `git commit`, `git push`, or `npm run deploy` when the user explicitly says those exact words.
- Never read or write `todo.txt` — it's the user's private notes.

**Pending TODO items:** image upload, download link, quit instructions, screen size adjustment, X usage limits.

**Play Store next steps:**
1. Wait for Google appeal response (zwickelg@gmail.com)
2. ✅ Retake `screenshot_03` and `screenshot_07` — done (2026-06-27)
3. Take share drawer screenshot (light or dark mode)
4. Once account reinstated (or new account created): upload AAB + store listing

---

*Last updated: 2026-06-27*
