const markdownTarget = document.getElementById("markdown");

if (markdownTarget) {
	const isReleasesPage = !!document.getElementById("releaseAnchors");
	const anchorsContainer = document.getElementById(isReleasesPage ? "releaseAnchors" : "changelogAnchors");
	const docName = isReleasesPage ? "RELEASES.md" : "CHANGELOG.md";
	const docUrls = window.FREEOS_CONTENT.getDocUrls(docName);
	const markdown = window.FREEOS_CONTENT.getEmbeddedDoc(docName);

	function fallbackMarkup() {
		markdownTarget.innerHTML = ""
			+ "<h2>Unable to load generated content for " + docName + "</h2>"
			+ "<p class=\"meta\">The published site does not currently include an embedded copy of this document.</p>"
			+ "<p><a class=\"btn btn-secondary\" href=\"" + docUrls.blob + "\" target=\"_blank\" rel=\"noopener noreferrer\">Open " + docName + " on GitLab</a></p>";

		if (anchorsContainer) {
			anchorsContainer.innerHTML = "<p class=\"meta\">No anchors available.</p>";
		}
	}

	if (!markdown) {
		fallbackMarkup();
	} else {
		markdownTarget.innerHTML = window.FREEOS_CONTENT.renderMarkdown(markdown);
		window.FREEOS_CONTENT.applyVersionAnchors(markdownTarget, anchorsContainer);
		window.FREEOS_CONTENT.decorateMarkdownHeadings(markdownTarget);
	}
}