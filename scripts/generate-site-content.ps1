param(
	[string]$Ref = "",
	[string]$GitLabHost = "https://gitlab.com",
	[string]$ProjectPath = "freeos.me/core",
	[string]$OutputPath = "public/js/site-content.js"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

if (-not $Ref) {
	if ($env:CORE_REF) {
		$Ref = $env:CORE_REF
	} else {
		$Ref = "main"
	}
}

if ($env:CORE_PROJECT_PATH) {
	$ProjectPath = $env:CORE_PROJECT_PATH
}

$baseUrl = "$GitLabHost/$ProjectPath/-/raw/$Ref"
$docs = [ordered]@{}

foreach ($fileName in @("RELEASES.md", "CHANGELOG.md")) {
	$response = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/$fileName"
	$docs[$fileName] = $response.Content.TrimEnd()
}

$payload = [ordered]@{
	ref = $Ref
	generatedAt = (Get-Date).ToUniversalTime().ToString("o")
	docs = $docs
}

$json = $payload | ConvertTo-Json -Depth 4
$output = "window.FREEOS_SITE_CONTENT = $json;`n"

$directory = Split-Path -Parent $OutputPath
if ($directory -and -not (Test-Path $directory)) {
	New-Item -ItemType Directory -Path $directory | Out-Null
}

Set-Content -Path $OutputPath -Value $output -Encoding utf8
Write-Host "Generated $OutputPath from $baseUrl"