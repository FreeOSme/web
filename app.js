const versions = [
	{
		name: "FreeOS.me 0.3 Canary",
		status: "Canary",
		date: "Apr 2026",
		notes: "Installer improvements and the first baseline tools bundle.",
		isoUrl: "#",
		notesUrl: "#"
	},
	{
		name: "FreeOS.me 0.2 Beta",
		status: "Beta",
		date: "Feb 2026",
		notes: "New default theme, boot optimization, and networking refinements.",
		isoUrl: "#",
		notesUrl: "#"
	},
	{
		name: "FreeOS.me 0.1 Alpha",
		status: "Alpha",
		date: "Dec 2025",
		notes: "First public build with a functional base and initial repository.",
		isoUrl: "#",
		notesUrl: "#"
	}
];

const logs = [
	{
		version: "0.3 Canary",
		date: "2026-04-11",
		changes: [
			"Boot time was reduced on test hardware.",
			"The base package structure was reorganized.",
			"The initial installation flow was improved."
		]
	},
	{
		version: "0.2 Beta",
		date: "2026-02-08",
		changes: [
			"Networking adjustments improved Wi-Fi stability.",
			"The main visual theme was refreshed.",
			"Legacy dependencies were cleaned up."
		]
	},
	{
		version: "0.1 Alpha",
		date: "2025-12-02",
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
	versionsGrid.innerHTML = versions.map(function(version) {
		const hasIso = version.isoUrl && version.isoUrl !== "#";
		const hasNotes = version.notesUrl && version.notesUrl !== "#";

		return "\n\t\t\t<article class=\"card\" tabindex=\"0\">\n\t\t\t\t<div class=\"version-top\">\n\t\t\t\t\t<h3 class=\"ver-title\">" + version.name + "</h3>\n\t\t\t\t\t<span class=\"tag\">" + version.status + "</span>\n\t\t\t\t</div>\n\t\t\t\t<p class=\"meta\"><strong>Released:</strong> " + version.date + "</p>\n\t\t\t\t<p class=\"meta\">" + version.notes + "</p>\n\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t<a class=\"mini-btn " + (hasIso ? "" : "disabled") + "\" href=\"" + (hasIso ? version.isoUrl : "#") + "\">Download ISO</a>\n\t\t\t\t\t<a class=\"mini-btn " + (hasNotes ? "" : "disabled") + "\" href=\"" + (hasNotes ? version.notesUrl : "#") + "\">Release Notes</a>\n\t\t\t\t</div>\n\t\t\t</article>\n\t\t";
	}).join("");
}

function renderLogs() {
	changelogTimeline.innerHTML = logs.map(function(entry) {
		const list = entry.changes.map(function(change) {
			return "<li>" + change + "</li>";
		}).join("");

		return "\n\t\t\t<article class=\"log-item\">\n\t\t\t\t<div class=\"log-top\">\n\t\t\t\t\t<strong>v" + entry.version + "</strong>\n\t\t\t\t\t<span class=\"log-date\">" + entry.date + "</span>\n\t\t\t\t</div>\n\t\t\t\t<ul>" + list + "</ul>\n\t\t\t</article>\n\t\t";
	}).join("");
}

document.getElementById("year").textContent = new Date().getFullYear();
renderVersions();
renderLogs();
