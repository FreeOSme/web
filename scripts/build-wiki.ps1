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
$themesPath = Join-Path $sourceFullPath "themes"
$hextraThemePath = Join-Path $themesPath "hextra"

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

function Assert-GitAvailable {
	$git = Get-Command git -ErrorAction SilentlyContinue
	if (-not $git) {
		throw "Git is not installed or not available in PATH."
	}
}

function Ensure-HextraTheme {
	param(
		[string]$ThemePath,
		[string]$ThemesParentPath
	)

	if (Test-Path $ThemePath) {
		return
	}

	if (-not (Test-Path $ThemesParentPath)) {
		New-Item -ItemType Directory -Path $ThemesParentPath -Force | Out-Null
	}

	Write-Host "Hextra theme not found. Cloning into $ThemePath"
	& git clone --depth 1 https://github.com/imfing/hextra.git $ThemePath
}

Assert-PathExists -Path $sourceFullPath -Message "Hugo source folder '$sourceFullPath' not found."
Assert-HugoAvailable
Assert-GitAvailable
Ensure-HextraTheme -ThemePath $hextraThemePath -ThemesParentPath $themesPath

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
