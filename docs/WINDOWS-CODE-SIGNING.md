# Windows Code Signing

GlideBlend is configured so `electron-builder` will sign automatically when valid certificate environment variables are present.

## What electron-builder expects
- `CSC_LINK`: path, file URL, HTTPS URL, or base64-encoded PFX/P12 certificate
- `CSC_KEY_PASSWORD`: password for that certificate
- Optional when building Windows from non-Windows hosts: `WIN_CSC_LINK`, `WIN_CSC_KEY_PASSWORD`

## Local signing flow on Windows
1. Export your Authenticode certificate as `.pfx`.
2. Set the environment variables in the current shell.
3. Run `npm run dist:itch`.
4. Verify signatures with `powershell -ExecutionPolicy Bypass -File scripts/check-signature.ps1`.

## Example PowerShell session
```powershell
$env:CSC_LINK = 'C:\certs\glideblend-code-signing.pfx'
$env:CSC_KEY_PASSWORD = 'replace-me'
npm run dist:itch
powershell -ExecutionPolicy Bypass -File scripts/check-signature.ps1
```

## Practical notes
- A trusted code-signing certificate reduces Windows SmartScreen friction.
- Keep the certificate password out of source control.
- If you use CI, set the certificate values as secret environment variables.

## Sources
- electron-builder code-signing setup: https://www.electron.build/code-signing.html
- electron-builder Windows configuration: https://www.electron.build/win.html
