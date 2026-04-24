param(
	[string]$SourcePath = "wiki",
	[string]$OutputPath = "public/wiki"
)

# Fail fast so CI returns clear errors when Hugo or source files are missing.
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Resolve full paths relative to this script to avoid working-directory surprises.
$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceFullPath = Join-Path $repoRoot $SourcePath
$outputFullPath = Join-Path $repoRoot $OutputPath

function Assert-PathExists {
	param(
		[string]$Path,
		[string]$Message
	)

	if (-not (Test-Path $Path)) {
		throw $Message
	}
}

function Assert-HugoAvailable {
	$hugo = Get-Command hugo -ErrorAction SilentlyContinue
	if (-not $hugo) {
		throw "Hugo is not installed or not available in PATH."
	}
}

Assert-PathExists -Path $sourceFullPath -Message "Hugo source folder '$sourceFullPath' not found."
Assert-HugoAvailable

if (-not (Test-Path $outputFullPath)) {
	New-Item -ItemType Directory -Path $outputFullPath -Force | Out-Null
}

# Build directly into the Pages artifact tree so wiki and static pages deploy together.
& hugo --source $sourceFullPath --destination $outputFullPath --cleanDestinationDir

$generatedIndex = Join-Path $outputFullPath "index.html"
Assert-PathExists -Path $generatedIndex -Message "Hugo build did not produce $generatedIndex"

# Smoke-check expected wiki title to catch broken theme/module builds early.
$generatedContent = Get-Content -Path $generatedIndex -Raw
if ($generatedContent -notmatch "FreeOS.me Wiki") {
	throw "Hugo output does not look like generated wiki index (missing expected title)."
}

Write-Host "Generated Hugo wiki into $outputFullPath"
