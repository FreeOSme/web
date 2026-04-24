param(
	[string]$SourcePath = "blog",
	[string]$OutputPath = "public/blog"
)

# Fail fast so CI returns a clear error as soon as a prerequisite is missing.
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Resolve absolute paths from the script location to avoid working-directory surprises in CI runners.
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
	# The script requires Hugo in PATH because the CI image installs it globally.
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

# Build directly into the Pages output folder so CI can publish a single artifact tree.
& hugo --source $sourceFullPath --destination $outputFullPath --cleanDestinationDir

$generatedIndex = Join-Path $outputFullPath "index.html"
Assert-PathExists -Path $generatedIndex -Message "Hugo build did not produce $generatedIndex"

# Basic smoke check to avoid deploying placeholder or broken output when Hugo runs but templates fail.
$generatedContent = Get-Content -Path $generatedIndex -Raw
if ($generatedContent -notmatch "Latest Posts") {
	throw "Hugo output does not look like generated blog index (missing expected heading)."
}

Write-Host "Generated Hugo blog into $outputFullPath"
