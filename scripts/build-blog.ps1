param(
	[string]$SourcePath = "blog",
	[string]$OutputPath = "public/blog"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

if (-not (Test-Path $SourcePath)) {
	throw "Hugo source folder '$SourcePath' not found."
}

$hugo = Get-Command hugo -ErrorAction SilentlyContinue
if (-not $hugo) {
	throw "Hugo is not installed or not available in PATH."
}

if (-not (Test-Path $OutputPath)) {
	New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

& hugo --source $SourcePath --destination $OutputPath --cleanDestinationDir

$generatedIndex = Join-Path $OutputPath "index.html"
if (-not (Test-Path $generatedIndex)) {
	throw "Hugo build did not produce $generatedIndex"
}

$generatedContent = Get-Content -Path $generatedIndex -Raw
if ($generatedContent -match "Blog build pending") {
	throw "Hugo output still contains placeholder content."
}

Write-Host "Generated Hugo blog into $OutputPath"
