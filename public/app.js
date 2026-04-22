const DOWNLOAD_BASE_URL = "https://freeos.me/downloads";
const PREVIEW_LIMIT = 3;

const versions = [
	{
		name: "FreeOS.me 0.1 Alpha",
		status: "Alpha", //Canary, Beta, Alpha, Planned
		date: "April 2026",
		notes: "First public build with a functional base and initial repository.",
		releaseUrl: "releases.html#v0-1-alpha",
		isoUrl: DOWNLOAD_BASE_URL + "/freeos-me-0.1.0-alpha.iso",
		checksumUrl: DOWNLOAD_BASE_URL + "/freeos-me-0.1.0-alpha.sha256",
		notesUrl: "changelog.html#v0-1-alpha"
	}
];

const logs = [
	{
		version: "0.1 Alpha",
		date: "2026-12-04",
		changes: [
			"Initial project release.",
			"Boot process validated on reference hardware.",
			"Mission statement and base roadmap published."
		]
	}
];

const versionsGrid = document.getElementById("versionsGrid");
const changelogTimeline = document.getElementById("changelogTimeline");

function renderVersions() {
	versionsGrid.innerHTML = versions.slice(0, PREVIEW_LIMIT).map(function(version) {
		const hasIso = version.isoUrl && version.isoUrl !== "#";
		const hasChecksum = version.checksumUrl && version.checksumUrl !== "#";
		const hasNotes = version.notesUrl && version.notesUrl !== "#";
		const hasDetails = version.releaseUrl && version.releaseUrl !== "#";
		const statusClass = "tag-" + version.status.toLowerCase().replace(/[^a-z0-9]+/g, "-");

		return "\n\t\t\t<article class=\"card\" tabindex=\"0\">\n\t\t\t\t<div class=\"version-top\">\n\t\t\t\t\t<h3 class=\"ver-title\">" + version.name + "</h3>\n\t\t\t\t\t<span class=\"tag " + statusClass + "\">" + version.status + "</span>\n\t\t\t\t</div>\n\t\t\t\t<p class=\"meta\"><strong>Released:</strong> " + version.date + "</p>\n\t\t\t\t<p class=\"meta\">" + version.notes + "</p>\n\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t<a class=\"mini-btn " + (hasDetails ? "" : "disabled") + "\" href=\"" + (hasDetails ? version.releaseUrl : "#") + "\"><span class=\"btn-label\"><span class=\"ui-icon icon-details\" aria-hidden=\"true\"></span>Release Details</span></a>\n\t\t\t\t\t<a class=\"mini-btn " + (hasIso ? "" : "disabled") + "\" href=\"" + (hasIso ? version.isoUrl : "#") + "\"><span class=\"btn-label\"><span class=\"ui-icon icon-download\" aria-hidden=\"true\"><span class=\"icon-download-arrow\"></span></span>Download ISO</span></a>\n\t\t\t\t\t<a class=\"mini-btn " + (hasChecksum ? "" : "disabled") + "\" href=\"" + (hasChecksum ? version.checksumUrl : "#") + "\"><span class=\"btn-label\"><span class=\"ui-icon icon-checksum\" aria-hidden=\"true\"></span>SHA256</span></a>\n\t\t\t\t\t<a class=\"mini-btn " + (hasNotes ? "" : "disabled") + "\" href=\"" + (hasNotes ? version.notesUrl : "#") + "\"><span class=\"btn-label\"><span class=\"ui-icon icon-changelog\" aria-hidden=\"true\"></span>Release Notes</span></a>\n\t\t\t\t</div>\n\t\t\t</article>\n\t\t";
	}).join("");
}

function renderLogs() {
	changelogTimeline.innerHTML = logs.slice(0, PREVIEW_LIMIT).map(function(entry) {
		const list = entry.changes.map(function(change) {
			return "<li>" + change + "</li>";
		}).join("");

		return "\n\t\t\t<article class=\"log-item\">\n\t\t\t\t<div class=\"log-top\">\n\t\t\t\t\t<strong>v" + entry.version + "</strong>\n\t\t\t\t\t<span class=\"log-date\">" + entry.date + "</span>\n\t\t\t\t</div>\n\t\t\t\t<ul>" + list + "</ul>\n\t\t\t</article>\n\t\t";
	}).join("");
}

const yearElement = document.getElementById("year");
if (yearElement) {
	yearElement.textContent = new Date().getFullYear();
}
renderVersions();
renderLogs();
