document.getElementById("year").textContent = new Date().getFullYear();

const markdownTarget = document.getElementById("markdown");

function fallbackMarkup() {
	markdownTarget.innerHTML = ""
		+ "<h2>Unable to load RELEASES.md from this context</h2>"
		+ "<p class=\"meta\">If you are opening this page via file://, browser security may block local file fetch.</p>"
		+ "<p><a class=\"btn btn-secondary\" href=\"RELEASES.md\">Open RELEASES.md directly</a></p>"
		+ "<p class=\"meta\">Tip: run a local server for full Markdown rendering, for example: <code>python -m http.server 8080</code></p>";
}

function addVersionAnchors() {
	const sections = markdownTarget.querySelectorAll("h2");
	sections.forEach(function(section) {
		const text = section.textContent || "";
		if (text.includes("1.0.0-stable")) {
			section.id = "v1-0-stable";
		}
		if (text.includes("0.3.0-canary")) {
			section.id = "v0-3-canary";
		}
		if (text.includes("0.2.0-beta")) {
			section.id = "v0-2-beta";
		}
		if (text.includes("0.1.0-alpha")) {
			section.id = "v0-1-alpha";
		}
	});
}

fetch("RELEASES.md")
	.then(function(response) {
		if (!response.ok) {
			throw new Error("Could not fetch releases markdown.");
		}
		return response.text();
	})
	.then(function(markdown) {
		if (typeof marked === "undefined") {
			throw new Error("Markdown renderer is not available.");
		}
		markdownTarget.innerHTML = marked.parse(markdown);
		addVersionAnchors();
	})
	.catch(function() {
		fallbackMarkup();
	});
