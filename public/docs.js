const markdownTarget = document.getElementById("markdown");

if (markdownTarget) {
	const isReleasesPage = !!document.getElementById("releaseAnchors");
	const anchorsContainer = document.getElementById(isReleasesPage ? "releaseAnchors" : "changelogAnchors");
	const docName = isReleasesPage ? "RELEASES.md" : "CHANGELOG.md";
	const docUrls = window.FREEOS_CONTENT.getDocUrls(docName);

	function fallbackMarkup() {
		markdownTarget.innerHTML = ""
			+ "<h2>Unable to load " + docName + " from GitLab</h2>"
			+ "<p class=\"meta\">The remote repository may be unavailable or blocked from this network.</p>"
			+ "<p><a class=\"btn btn-secondary\" href=\"" + docUrls.blob + "\" target=\"_blank\" rel=\"noopener noreferrer\">Open " + docName + " on GitLab</a></p>";

		if (anchorsContainer) {
			anchorsContainer.innerHTML = "<p class=\"meta\">No anchors available.</p>";
		}
	}

	fetch(docUrls.raw)
		.then(function(response) {
			if (!response.ok) {
				throw new Error("Could not fetch markdown.");
			}
			return response.text();
		})
		.then(function(markdown) {
			if (typeof marked === "undefined") {
				throw new Error("Markdown renderer is not available.");
			}
			markdownTarget.innerHTML = marked.parse(markdown);
			window.FREEOS_CONTENT.applyVersionAnchors(markdownTarget, anchorsContainer);
			window.FREEOS_CONTENT.decorateMarkdownHeadings(markdownTarget);
		})
		.catch(function() {
			fallbackMarkup();
		});
}