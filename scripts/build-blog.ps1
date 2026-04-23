param(
	[string]$SourcePath = "blog",
	[string]$OutputPath = "public/blog"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceFullPath = Join-Path $repoRoot $SourcePath
$outputFullPath = Join-Path $repoRoot $OutputPath

if (-not (Test-Path $sourceFullPath)) {
	throw "Hugo source folder '$sourceFullPath' not found."
}

$hugo = Get-Command hugo -ErrorAction SilentlyContinue
if (-not $hugo) {
	throw "Hugo is not installed or not available in PATH."
}

if (-not (Test-Path $outputFullPath)) {
	New-Item -ItemType Directory -Path $outputFullPath -Force | Out-Null
}

& hugo --source $sourceFullPath --destination $outputFullPath --cleanDestinationDir

$generatedIndex = Join-Path $outputFullPath "index.html"
if (-not (Test-Path $generatedIndex)) {
	throw "Hugo build did not produce $generatedIndex"
}

$generatedContent = Get-Content -Path $generatedIndex -Raw
if ($generatedContent -notmatch "Latest Posts") {
	throw "Hugo output does not look like generated blog index (missing expected heading)."
}

Write-Host "Generated Hugo blog into $outputFullPath"
