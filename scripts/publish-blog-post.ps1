param(
	[Parameter(Mandatory = $true)]
	[string]$Slug,
	[string]$Section = "posts"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$repoRoot = Split-Path -Parent $PSScriptRoot
$postPath = Join-Path $repoRoot (Join-Path "blog/content" (Join-Path $Section ($Slug + ".md")))

if (-not (Test-Path $postPath)) {
	throw "Post not found: $postPath"
}

$content = Get-Content -Path $postPath -Raw

if ($content -notmatch '(?m)^---\s*$') {
	throw "Front matter not found in $postPath"
}

if ($content -match '(?m)^draft:\s*(true|false)\s*$') {
	$content = [regex]::Replace($content, '(?m)^draft:\s*(true|false)\s*$', 'draft: false', 1)
} else {
	$content = $content -replace '(?s)^(---\s*\r?\n)', "$1draft: false`r`n"
}

Set-Content -Path $postPath -Value $content -Encoding utf8
Write-Host "Published post: $postPath"