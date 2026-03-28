# GlideBlend Publishing Checklist

## Before upload
- Run `npm run dist:itch`
- Run `powershell -ExecutionPolicy Bypass -File scripts/check-signature.ps1`
- Run `powershell -ExecutionPolicy Bypass -File scripts/smoke-test-portable.ps1`
- Review the portable bundle in `release/itch-win64`
- Upload the staged folder with butler or zip `release/itch-win64`

## itch.io listing setup
- Project type: Downloadable
- Platform: Windows
- Price: set your paid price or pay-what-you-want
- Cover image: use `output/playwright/itch-cover.png`
- Screenshots: use `output/playwright/glideblend-home.png` and `output/playwright/glideblend-guide.png`
- Paste the copy from `marketing/itch-page.md`

## Release note template
- Initial desktop release for Windows
- Local clip analysis and merge with bundled FFmpeg runtime
- Native save dialog and built-in user guide
