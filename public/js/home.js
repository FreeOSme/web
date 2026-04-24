(function() {
	const versionsGrid = document.getElementById("versionsGrid");
	const changelogTimeline = document.getElementById("changelogTimeline");
	const previewLimit = 3;
	const content = window.FREEOS_CONTENT;

	// Abort early when the script is loaded on a page that does not expose the expected home page targets.
	if (!versionsGrid || !changelogTimeline || !content) {
		return;
	}

	const releasesMarkdown = content.getEmbeddedDoc("RELEASES.md");
	const changelogMarkdown = content.getEmbeddedDoc("CHANGELOG.md");

	function hasUsableLink(url) {
		return Boolean(url && url !== "#");
	}

	function buildActionButton(label, iconClass, href, options) {
		const isEnabled = hasUsableLink(href);
		const extraAttrs = options && options.external ? ' target="_blank" rel="noopener noreferrer"' : "";
		// Download uses a nested arrow glyph, so it needs a slightly different icon fragment than the rest.
		const iconMarkup = iconClass === "icon-download"
			? '<span class="ui-icon icon-download" aria-hidden="true"><span class="icon-download-arrow"></span></span>'
			: '<span class="ui-icon ' + iconClass + '" aria-hidden="true"></span>';

		return '<a class="mini-btn ' + (isEnabled ? "" : "disabled") + '" href="' + (isEnabled ? href : "#") + '"' + extraAttrs + '>'
			+ '<span class="btn-label">' + iconMarkup + label + '</span>'
			+ '</a>';
	}

	function renderVersions(versions) {
		if (!versions.length) {
			versionsGrid.innerHTML = '<article class="card"><p class="meta">No releases available.</p></article>';
			return;
		}

		// Only a short preview is rendered on the home page; the full dataset lives on the dedicated releases page.
		versionsGrid.innerHTML = versions.slice(0, previewLimit).map(function(version) {
			const statusClass = "tag-" + version.status.toLowerCase().replace(/[^a-z0-9]+/g, "-");

			return '<article class="card" tabindex="0">'
				+ '<div class="version-top">'
				+ '<h3 class="ver-title">' + version.name + '</h3>'
				+ '<span class="tag ' + statusClass + '">' + version.status + '</span>'
				+ '</div>'
				+ '<p class="meta"><strong>Released:</strong> ' + version.date + '</p>'
				+ '<p class="meta">' + version.notes + '</p>'
				+ '<div class="actions">'
				+ buildActionButton('Release Details', 'icon-details', version.releaseUrl)
				+ buildActionButton('Release Notes', 'icon-changelog', version.notesUrl)
				+ buildActionButton('Download ISO', 'icon-download', version.isoUrl, { external: true })
				+ buildActionButton('SHA256', 'icon-checksum', version.checksumUrl, { external: true })
				+ '</div>'
				+ '</article>';
		}).join("");
	}

	function renderLogs(logs) {
		if (!logs.length) {
			changelogTimeline.innerHTML = '<article class="log-item"><p class="meta">No changelog entries available.</p></article>';
			return;
		}

		// Like releases, changelog items are intentionally truncated here to keep the landing page compact.
		changelogTimeline.innerHTML = logs.slice(0, previewLimit).map(function(entry) {
			const list = entry.changes.map(function(change) {
				return '<li>' + change + '</li>';
			}).join("");

			return '<article class="log-item">'
				+ '<div class="log-top">'
				+ '<strong>v' + entry.version + '</strong>'
				+ '<span class="log-date">' + entry.date + '</span>'
				+ '</div>'
				+ '<ul>' + list + '</ul>'
				+ '</article>';
		}).join("");
	}

	function renderHomePreview() {
		// Embedded markdown is generated at build time; when it is missing we fall back to empty UI states instead of crashing.
		if (!releasesMarkdown || !changelogMarkdown) {
			renderVersions([]);
			renderLogs([]);
			return;
		}

		renderVersions(content.parseReleaseEntries(releasesMarkdown));
		renderLogs(content.parseChangelogEntries(changelogMarkdown));
	}

	renderHomePreview();
})();
