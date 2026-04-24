param(
	[Parameter(Mandatory = $true)]
	[string]$Slug,
	[string]$Section = "posts"
)

# Force strict failure behavior so automation catches publication issues early.
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Build the target markdown path deterministically from section + slug.
$repoRoot = Split-Path -Parent $PSScriptRoot
$postPath = Join-Path $repoRoot (Join-Path "blog/content" (Join-Path $Section ($Slug + ".md")))

function Set-DraftFalse {
	param([string]$Content)

	# Update existing draft field when present.
	if ($Content -match '(?m)^draft:\s*(true|false)\s*$') {
		return [regex]::Replace($Content, '(?m)^draft:\s*(true|false)\s*$', 'draft: false', 1)
	}

	# If draft is missing, inject it right after the opening front matter delimiter.
	return $Content -replace '(?s)^(---\s*\r?\n)', "$1draft: false`r`n"
}

if (-not (Test-Path $postPath)) {
	throw "Post not found: $postPath"
}

$content = Get-Content -Path $postPath -Raw

if ($content -notmatch '(?m)^---\s*$') {
	# Front matter is required because publication status is controlled via draft field.
	throw "Front matter not found in $postPath"
}

$content = Set-DraftFalse -Content $content
Set-Content -Path $postPath -Value $content -Encoding utf8
Write-Host "Published post: $postPath"