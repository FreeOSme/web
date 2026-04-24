param(
	[string]$Ref = "",
	[string]$GitLabHost = "https://gitlab.com",
	[string]$ProjectPath = "freeos.me/core",
	[string]$OutputPath = "public/js/site-content.js"
)

# Use strict error handling so failures propagate to CI instead of generating partial content.
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function Resolve-CoreRef {
	# Priority order:
	# 1) explicit -Ref argument,
	# 2) CORE_REF from CI variables,
	# 3) fallback to main branch.
	if ($Ref) {
		return $Ref
	}

	if ($env:CORE_REF) {
		return $env:CORE_REF
	}

	return "main"
}

function Get-RemoteDocContent {
	param(
		[string]$BaseUrl,
		[string]$FileName
	)

	$response = Invoke-WebRequest -UseBasicParsing -Uri "$BaseUrl/$FileName"
	return $response.Content.TrimEnd()
}

function Ensure-OutputDirectory {
	param([string]$Path)

	$directory = Split-Path -Parent $Path
	if ($directory -and -not (Test-Path $directory)) {
		New-Item -ItemType Directory -Path $directory | Out-Null
	}
}

$Ref = Resolve-CoreRef

# Allow overriding repository path from CI variables when syncing from forks or mirrors.
if ($env:CORE_PROJECT_PATH) {
	$ProjectPath = $env:CORE_PROJECT_PATH
}

$baseUrl = "$GitLabHost/$ProjectPath/-/raw/$Ref"
$docs = [ordered]@{}

foreach ($fileName in @("RELEASES.md", "CHANGELOG.md")) {
	# Keep a local embedded copy of the public docs to avoid runtime CORS issues.
	$docs[$fileName] = Get-RemoteDocContent -BaseUrl $baseUrl -FileName $fileName
}

$payload = [ordered]@{
	ref = $Ref
	generatedAt = (Get-Date).ToUniversalTime().ToString("o")
	docs = $docs
}

$json = $payload | ConvertTo-Json -Depth 4
# Expose the payload as a browser global consumed by content-utils.js and page scripts.
$output = "window.FREEOS_SITE_CONTENT = $json;`n"

Ensure-OutputDirectory -Path $OutputPath
Set-Content -Path $OutputPath -Value $output -Encoding utf8
Write-Host "Generated $OutputPath from $baseUrl"