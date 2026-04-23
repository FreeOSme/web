(function() {
	function getRepoConfig() {
		var embeddedContent = window.FREEOS_SITE_CONTENT || {};
		var embeddedRef = embeddedContent.ref;

		return window.FREEOS_REPO_CONFIG || {
			host: "https://gitlab.com",
			projectPath: "freeos.me/core",
			ref: embeddedRef || "d883072cb0df262dfff0e9357938230773eda03f"
		};
	}

	function getEmbeddedDoc(fileName) {
		var content = window.FREEOS_SITE_CONTENT;

		if (!content || !content.docs) {
			return "";
		}

		return content.docs[fileName] || "";
	}

	function getDocsBase() {
		const config = getRepoConfig();
		return config.host + "/" + config.projectPath + "/-/";
	}

	function getDocUrls(fileName) {
		const config = getRepoConfig();
		const base = getDocsBase();
		return {
			raw: base + "raw/" + config.ref + "/" + fileName,
			blob: base + "blob/" + config.ref + "/" + fileName
		};
	}

	function toVersionAnchor(version) {
		return "v" + version.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	}

	function statusFromVersion(version) {
		const lower = version.toLowerCase();
		if (lower.includes("canary")) {
			return "Canary";
		}
		if (lower.includes("beta")) {
			return "Beta";
		}
		if (lower.includes("alpha")) {
			return "Alpha";
		}
		if (lower.includes("stable")) {
			return "Stable";
		}
		return "Planned";
	}

	function prettyVersion(version) {
		const status = statusFromVersion(version);
		const cleaned = version.replace(/-?(alpha|beta|canary|stable)$/i, "").replace(/[\[\]]/g, "").trim();
		if (!cleaned) {
			return version;
		}
		return cleaned + " " + status;
	}

	function parseReleaseEntries(markdown) {
		const sections = markdown.match(/^##\s+.+(?:\n(?!##\s).*)*/gm) || [];

		return sections.map(function(section) {
			const headingMatch =
				section.match(/^##\s+\[?([^\]\n(]+)\]?\s*-\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/m) ||
				section.match(/^##\s+([^\s(]+)\s*\(([^)]+)\)/m);
			if (!headingMatch) {
				return null;
			}

			const rawVersion = headingMatch[1].trim();
			const date = headingMatch[2].trim();
			const notesMatch = section.match(/###\s+Summary[\s\S]*?^[-*]\s+(.+)$/m);
			const isoMatch = section.match(/https?:\/\/\S+\.iso\b/i);
			const checksumMatch = section.match(/https?:\/\/\S+\.sha256\b/i);
			const anchor = toVersionAnchor(rawVersion);

			return {
				name: "FreeOS.me " + prettyVersion(rawVersion),
				status: statusFromVersion(rawVersion),
				date: date,
				notes: notesMatch ? notesMatch[1].trim() : "Release notes available.",
				releaseUrl: "releases.html#" + anchor,
				isoUrl: isoMatch ? isoMatch[0] : "#",
				checksumUrl: checksumMatch ? checksumMatch[0] : "#",
				notesUrl: "changelog.html#" + anchor
			};
		}).filter(Boolean);
	}

	function parseChangelogEntries(markdown) {
		const sections = markdown.match(/^##\s+.+(?:\n(?!##\s).*)*/gm) || [];

		return sections.map(function(section) {
			const headingMatch = section.match(/^##\s+\[?([^\]\n]+)\]?\s*-\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/m);
			if (!headingMatch) {
				return null;
			}

			const versionRaw = headingMatch[1].trim();
			const date = headingMatch[2].trim();
			const bullets = (section.match(/^[-*]\s+.+$/gm) || []).map(function(line) {
				return line.replace(/^[-*]\s+/, "").trim();
			}).slice(0, 3);

			return {
				version: prettyVersion(versionRaw),
				date: date,
				changes: bullets.length ? bullets : ["See full changelog for details."]
			};
		}).filter(Boolean);
	}

	function makeAnchorId(text) {
		const versionMatch = text.match(/([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9]+)?)/i);
		if (versionMatch) {
			return "v" + versionMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, "-");
		}
		return "v" + text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	}

	function extractAnchorLabel(text) {
		const versionMatch = text.match(/([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9]+)?)/i);
		if (versionMatch) {
			return "v" + versionMatch[1].replace(/-(alpha|beta|canary|stable)$/i, function(_, suffix) {
				return " " + suffix.charAt(0).toUpperCase() + suffix.slice(1).toLowerCase();
			});
		}
		return text;
	}

	function applyVersionAnchors(markdownTarget, anchorsContainer) {
		const sections = markdownTarget.querySelectorAll("h2");
		const links = [];

		sections.forEach(function(section) {
			const text = section.textContent || "";
			const id = makeAnchorId(text);
			section.id = id;
			links.push({ id: id, label: extractAnchorLabel(text) });
		});

		if (anchorsContainer) {
			anchorsContainer.innerHTML = links.map(function(link) {
				return "<a class=\"mini-btn\" href=\"#" + link.id + "\">" + link.label + "</a>";
			}).join("") || "<p class=\"meta\">No anchors available.</p>";
		}
	}

	function decorateMarkdownHeadings(markdownTarget) {
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

	function escapeHtml(text) {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	function stripHtmlComments(text) {
		return text.replace(/<!--.*?-->/g, "").trim();
	}

	function buildLink(href, label) {
		var safeHref = escapeHtml(href);
		var safeLabel = escapeHtml(label);
		var isExternal = /^https?:\/\//i.test(href);
		var attrs = isExternal ? ' target=\"_blank\" rel=\"noopener noreferrer\"' : "";

		return '<a href="' + safeHref + '"' + attrs + '>' + safeLabel + '</a>';
	}

	function renderInlineMarkdown(text) {
		var source = stripHtmlComments(text);
		var pattern = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s<]+|[A-Za-z0-9._/-]+\.html#[A-Za-z0-9._-]+)/g;
		var html = "";
		var lastIndex = 0;
		var match;

		while ((match = pattern.exec(source)) !== null) {
			html += escapeHtml(source.slice(lastIndex, match.index));

			if (match[1] && match[2]) {
				html += buildLink(match[2], match[1]);
			} else {
				html += buildLink(match[3], match[3]);
			}

			lastIndex = pattern.lastIndex;
		}

		html += escapeHtml(source.slice(lastIndex));
		return html;
	}

	function renderMarkdown(markdown) {
		var lines = markdown.replace(/\r\n/g, "\n").split("\n");
		var html = [];
		var paragraphLines = [];
		var listItems = [];

		function flushParagraph() {
			if (!paragraphLines.length) {
				return;
			}

			html.push("<p>" + renderInlineMarkdown(paragraphLines.join(" ")) + "</p>");
			paragraphLines = [];
		}

		function flushList() {
			if (!listItems.length) {
				return;
			}

			html.push("<ul>" + listItems.map(function(item) {
				return "<li>" + renderInlineMarkdown(item) + "</li>";
			}).join("") + "</ul>");
			listItems = [];
		}

		lines.forEach(function(line) {
			var trimmed = line.trim();
			var headingMatch;
			var listMatch;

			if (!trimmed) {
				flushParagraph();
				flushList();
				return;
			}

			headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
			if (headingMatch) {
				flushParagraph();
				flushList();
				html.push("<h" + headingMatch[1].length + ">" + renderInlineMarkdown(headingMatch[2]) + "</h" + headingMatch[1].length + ">");
				return;
			}

			listMatch = trimmed.match(/^[-*]\s+(.+)$/);
			if (listMatch) {
				flushParagraph();
				listItems.push(listMatch[1]);
				return;
			}

			paragraphLines.push(trimmed);
		});

		flushParagraph();
		flushList();

		return html.join("");
	}

	window.FREEOS_CONTENT = {
		getDocUrls: getDocUrls,
		getEmbeddedDoc: getEmbeddedDoc,
		parseReleaseEntries: parseReleaseEntries,
		parseChangelogEntries: parseChangelogEntries,
		applyVersionAnchors: applyVersionAnchors,
		decorateMarkdownHeadings: decorateMarkdownHeadings,
		renderMarkdown: renderMarkdown
	};
})();