const versionsGrid = document.getElementById("versionsGrid");
const changelogTimeline = document.getElementById("changelogTimeline");
const PREVIEW_LIMIT = 3;
const content = window.FREEOS_CONTENT;
const releasesMarkdown = content.getEmbeddedDoc("RELEASES.md");
const changelogMarkdown = content.getEmbeddedDoc("CHANGELOG.md");

function renderVersions(versions) {
	if (!versions.length) {
		versionsGrid.innerHTML = "<article class=\"card\"><p class=\"meta\">No releases available.</p></article>";
		return;
	}

	versionsGrid.innerHTML = versions.slice(0, PREVIEW_LIMIT).map(function(version) {
		const hasIso = version.isoUrl && version.isoUrl !== "#";
		const hasChecksum = version.checksumUrl && version.checksumUrl !== "#";
		const hasNotes = version.notesUrl && version.notesUrl !== "#";
		const hasDetails = version.releaseUrl && version.releaseUrl !== "#";
		const statusClass = "tag-" + version.status.toLowerCase().replace(/[^a-z0-9]+/g, "-");

		return "\n\t\t\t<article class=\"card\" tabindex=\"0\">\n\t\t\t\t<div class=\"version-top\">\n\t\t\t\t\t<h3 class=\"ver-title\">" + version.name + "</h3>\n\t\t\t\t\t<span class=\"tag " + statusClass + "\">" + version.status + "</span>\n\t\t\t\t</div>\n\t\t\t\t<p class=\"meta\"><strong>Released:</strong> " + version.date + "</p>\n\t\t\t\t<p class=\"meta\">" + version.notes + "</p>\n\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t<a class=\"mini-btn " + (hasDetails ? "" : "disabled") + "\" href=\"" + (hasDetails ? version.releaseUrl : "#") + "\"><span class=\"btn-label\"><span class=\"ui-icon icon-details\" aria-hidden=\"true\"></span>Release Details</span></a>\n\t\t\t\t\t<a class=\"mini-btn " + (hasIso ? "" : "disabled") + "\" href=\"" + (hasIso ? version.isoUrl : "#") + "\" target=\"_blank\" rel=\"noopener noreferrer\"><span class=\"btn-label\"><span class=\"ui-icon icon-download\" aria-hidden=\"true\"><span class=\"icon-download-arrow\"></span></span>Download ISO</span></a>\n\t\t\t\t\t<a class=\"mini-btn " + (hasChecksum ? "" : "disabled") + "\" href=\"" + (hasChecksum ? version.checksumUrl : "#") + "\" target=\"_blank\" rel=\"noopener noreferrer\"><span class=\"btn-label\"><span class=\"ui-icon icon-checksum\" aria-hidden=\"true\"></span>SHA256</span></a>\n\t\t\t\t\t<a class=\"mini-btn " + (hasNotes ? "" : "disabled") + "\" href=\"" + (hasNotes ? version.notesUrl : "#") + "\"><span class=\"btn-label\"><span class=\"ui-icon icon-changelog\" aria-hidden=\"true\"></span>Release Notes</span></a>\n\t\t\t\t</div>\n\t\t\t</article>\n\t\t";
	}).join("");
}

function renderLogs(logs) {
	if (!logs.length) {
		changelogTimeline.innerHTML = "<article class=\"log-item\"><p class=\"meta\">No changelog entries available.</p></article>";
		return;
	}

	changelogTimeline.innerHTML = logs.slice(0, PREVIEW_LIMIT).map(function(entry) {
		const list = entry.changes.map(function(change) {
			return "<li>" + change + "</li>";
		}).join("");

		return "\n\t\t\t<article class=\"log-item\">\n\t\t\t\t<div class=\"log-top\">\n\t\t\t\t\t<strong>v" + entry.version + "</strong>\n\t\t\t\t\t<span class=\"log-date\">" + entry.date + "</span>\n\t\t\t\t</div>\n\t\t\t\t<ul>" + list + "</ul>\n\t\t\t</article>\n\t\t";
	}).join("");
}


if (releasesMarkdown && changelogMarkdown) {
	renderVersions(content.parseReleaseEntries(releasesMarkdown));
	renderLogs(content.parseChangelogEntries(changelogMarkdown));

} else {
	renderVersions([]);
	renderLogs([]);
}