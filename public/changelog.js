const yearElement = document.getElementById("year");
if (yearElement) {
	yearElement.textContent = new Date().getFullYear();
}

const markdownTarget = document.getElementById("markdown");

function fallbackMarkup() {
	markdownTarget.innerHTML = ""
		+ "<h2>Unable to load CHANGELOG.md from this context</h2>"
		+ "<p class=\"meta\">If you are opening this page via file://, browser security may block local file fetch.</p>"
		+ "<p><a class=\"btn btn-secondary\" href=\"CHANGELOG.md\">Open CHANGELOG.md directly</a></p>"
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

function decorateMarkdownHeadings() {
	const iconMap = {
		"summary": "icon-summary",
		"artifacts": "icon-artifacts",
		"notes": "icon-notes",
		"added": "icon-added",
		"changed": "icon-changed",
		"removed": "icon-removed",
		"security": "icon-security",
		"performance": "icon-performance",
		"validation": "icon-validation"
	};

	markdownTarget.querySelectorAll("h3").forEach(function(heading) {
		const text = (heading.textContent || "").trim().toLowerCase();
		const iconClass = iconMap[text];

		if (!iconClass || heading.querySelector(".markdown-heading")) {
			return;
		}

		heading.innerHTML = "<span class=\"markdown-heading\"><span class=\"ui-icon " + iconClass + "\" aria-hidden=\"true\"></span><span>" + heading.textContent + "</span></span>";
	});
}

fetch("CHANGELOG.md")
	.then(function(response) {
		if (!response.ok) {
			throw new Error("Could not fetch changelog markdown.");
		}
		return response.text();
	})
	.then(function(markdown) {
		if (typeof marked === "undefined") {
			throw new Error("Markdown renderer is not available.");
		}
		markdownTarget.innerHTML = marked.parse(markdown);
		addVersionAnchors();
		decorateMarkdownHeadings();
	})
	.catch(function() {
		fallbackMarkup();
	});
