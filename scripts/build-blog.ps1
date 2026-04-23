param(
	[string]$SourcePath = "blog",
	[string]$OutputPath = "public/blog"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

if (-not (Test-Path $SourcePath)) {
	Write-Host "Hugo source folder '$SourcePath' not found. Skipping blog build."
	exit 0
}

$hugo = Get-Command hugo -ErrorAction SilentlyContinue
if (-not $hugo) {
	throw "Hugo is not installed or not available in PATH."
}

if (-not (Test-Path $OutputPath)) {
	New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

& hugo --source $SourcePath --destination $OutputPath --cleanDestinationDir
Write-Host "Generated Hugo blog into $OutputPath"
