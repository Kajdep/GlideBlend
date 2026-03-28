param(
  [string]$PortableExe = "D:\glideblend\GlideBlend-main\release\GlideBlend-1.0.0-portable.exe",
  [int]$WaitSeconds = 8
)

if (-not (Test-Path $PortableExe)) {
  throw "Portable executable not found: $PortableExe"
}

$process = Start-Process -FilePath $PortableExe -PassThru
Start-Sleep -Seconds $WaitSeconds

if ($process.HasExited) {
  throw "Portable build exited early with code $($process.ExitCode)."
}

Stop-Process -Id $process.Id -Force
Write-Host "Smoke test passed. GlideBlend stayed open for $WaitSeconds seconds."