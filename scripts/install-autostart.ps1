# Installs an autostart entry so the MBSNM site launches after Windows login.
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
  $projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
  if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
    $projectRoot = "C:\Users\joscom\Mable\abale-school"
  }
}

$batPath = Join-Path $projectRoot "start-site.bat"
if (-not (Test-Path $batPath)) {
  throw "Missing start-site.bat at $batPath"
}

$startupDir = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup"
$shortcutPath = Join-Path $startupDir "MBSNM Website.lnk"

$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $batPath
$shortcut.WorkingDirectory = $projectRoot
$shortcut.WindowStyle = 7 # minimized
$shortcut.Description = "Start Mable School of Nursing website (localhost:3000)"
$shortcut.Save()

Write-Host "Autostart installed:"
Write-Host "  $shortcutPath"
Write-Host ""
Write-Host "After you restart or log in, the site will start at http://localhost:3000"
Write-Host "To remove autostart later, delete that shortcut from the Startup folder."
