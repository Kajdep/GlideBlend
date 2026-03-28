param(
  [string[]]$Targets = @(
    "D:\glideblend\GlideBlend-main\release\GlideBlend-1.0.0-portable.exe",
    "D:\glideblend\GlideBlend-main\release\GlideBlend Setup 1.0.0.exe"
  )
)

$results = foreach ($target in $Targets) {
  if (-not (Test-Path $target)) {
    [pscustomobject]@{
      File = $target
      Status = 'Missing'
      Signer = ''
      Message = 'File not found'
    }
    continue
  }

  $signature = Get-AuthenticodeSignature -FilePath $target
  [pscustomobject]@{
    File = $target
    Status = $signature.Status
    Signer = $signature.SignerCertificate.Subject
    Message = $signature.StatusMessage
  }
}

$results | Format-Table -AutoSize

if ($results.Status -contains 'NotSigned' -or $results.Status -contains 'UnknownError') {
  exit 1
}