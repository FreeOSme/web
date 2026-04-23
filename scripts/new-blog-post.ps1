param(
	[Parameter(Mandatory = $true)]
	[string]$Slug,
	[string]$Title = "",
	[string]$Section = "posts"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$repoRoot = Split-Path -Parent $PSScriptRoot
$blogRoot = Join-Path $repoRoot "blog"

if (-not (Test-Path $blogRoot)) {
	throw "Blog source folder not found at $blogRoot"
}

$hugo = Get-Command hugo -ErrorAction SilentlyContinue
if (-not $hugo) {
	throw "Hugo is not installed or not available in PATH."
}

$cleanSlug = $Slug.Trim().ToLowerInvariant() -replace "[^a-z0-9-]", "-"
$cleanSlug = $cleanSlug -replace "-+", "-"
$cleanSlug = $cleanSlug.Trim("-")

if (-not $cleanSlug) {
	throw "Slug must contain at least one alphanumeric character."
}

$relativePath = "$Section/$cleanSlug.md"
& hugo new --source $blogRoot $relativePath

$newPostPath = Join-Path $blogRoot (Join-Path "content" $relativePath)
if (-not (Test-Path $newPostPath)) {
	throw "Hugo did not create $newPostPath"
}

if ($Title) {
	$content = Get-Content -Path $newPostPath -Raw
	$content = $content -replace 'title:\s*"[^"]*"', ('title: "' + $Title.Replace('"', '\"') + '"')
	Set-Content -Path $newPostPath -Value $content -Encoding utf8
}

Write-Host "Created blog post: $newPostPath"
Write-Host "Tip: set draft = false when ready to publish."
