param(
	[Parameter(Mandatory = $true)]
	[string]$Slug,
	[string]$Title = "",
	[string]$Section = "posts"
)

# Stop immediately on errors so the caller never assumes a post exists when creation failed.
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Resolve blog root from script location to keep behavior stable in local and CI shells.
$repoRoot = Split-Path -Parent $PSScriptRoot
$blogRoot = Join-Path $repoRoot "blog"

function Normalize-Slug {
	param([string]$Value)

	# Normalize user input into a predictable URL-safe slug.
	$normalized = $Value.Trim().ToLowerInvariant() -replace "[^a-z0-9-]", "-"
	$normalized = $normalized -replace "-+", "-"
	return $normalized.Trim("-")
}

function Update-GeneratedPostTitle {
	param(
		[string]$Path,
		[string]$Value
	)

	$content = Get-Content -Path $Path -Raw
	# Replace only the first title field produced by Hugo archetypes.
	$content = $content -replace 'title:\s*"[^"]*"', ('title: "' + $Value.Replace('"', '\"') + '"')
	Set-Content -Path $Path -Value $content -Encoding utf8
}

if (-not (Test-Path $blogRoot)) {
	throw "Blog source folder not found at $blogRoot"
}

$hugo = Get-Command hugo -ErrorAction SilentlyContinue
if (-not $hugo) {
	throw "Hugo is not installed or not available in PATH."
}

$cleanSlug = Normalize-Slug -Value $Slug

if (-not $cleanSlug) {
	throw "Slug must contain at least one alphanumeric character."
}

$relativePath = "$Section/$cleanSlug.md"
# Delegate front matter scaffolding to Hugo so the file stays aligned with the active archetype.
& hugo new --source $blogRoot $relativePath

$newPostPath = Join-Path $blogRoot (Join-Path "content" $relativePath)
if (-not (Test-Path $newPostPath)) {
	# Guard against rare cases where Hugo exits successfully but file creation fails.
	throw "Hugo did not create $newPostPath"
}

if ($Title) {
	Update-GeneratedPostTitle -Path $newPostPath -Value $Title
}

Write-Host "Created blog post: $newPostPath"
Write-Host "Tip: set draft = false when ready to publish."
