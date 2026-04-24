(function() {
	const markdownTarget = document.getElementById("markdown");
	const content = window.FREEOS_CONTENT;

	// This script is shared by releases and changelog pages, so it must no-op cleanly elsewhere.
	if (!markdownTarget || !content) {
		return;
	}

	// The presence of the release anchors container is the switch that tells us which generated document to render.
	const isReleasesPage = Boolean(document.getElementById("releaseAnchors"));
	const anchorsContainer = document.getElementById(isReleasesPage ? "releaseAnchors" : "changelogAnchors");
	const docName = isReleasesPage ? "RELEASES.md" : "CHANGELOG.md";
	const docUrls = content.getDocUrls(docName);
	const markdown = content.getEmbeddedDoc(docName);

	function renderFallback() {
		// If embedded content is missing from the deployed site, send the user to the source document instead of showing a blank page.
		markdownTarget.innerHTML = ""
			+ "<h2>Unable to load generated content for " + docName + "</h2>"
			+ "<p class=\"meta\">The published site does not currently include an embedded copy of this document.</p>"
			+ "<p><a class=\"btn btn-secondary\" href=\"" + docUrls.blob + "\" target=\"_blank\" rel=\"noopener noreferrer\">Open " + docName + " on GitLab</a></p>";

		if (anchorsContainer) {
			anchorsContainer.innerHTML = "<p class=\"meta\">No anchors available.</p>";
		}
	}

	function renderDocument() {
		// Rendering is split into content, anchors, and heading decoration so each concern can evolve independently.
		markdownTarget.innerHTML = content.renderMarkdown(markdown);
		content.applyVersionAnchors(markdownTarget, anchorsContainer);
		content.decorateMarkdownHeadings(markdownTarget);
	}

	if (!markdown) {
		renderFallback();
		return;
	}

	renderDocument();
})();
