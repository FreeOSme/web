(function() {
	// These patterns define the lightweight markdown dialect we expect from the generated project documents.
	const RELEASE_SECTION_PATTERN = /^##\s+.+(?:\n(?!##\s).*)*/gm;
	const CHANGELOG_HEADING_PATTERN = /^##\s+\[?([^\]\n]+)\]?\s*-\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/m;
	const RELEASE_HEADING_PATTERNS = [
		/^##\s+\[?([^\]\n(]+)\]?\s*-\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/m,
		/^##\s+([^\s(]+)\s*\(([^)]+)\)/m
	];
	const ICON_MAP = {
		summary: "icon-summary",
		artifacts: "icon-artifacts",
		notes: "icon-notes",
		added: "icon-added",
		changed: "icon-changed",
		removed: "icon-removed",
		security: "icon-security",
		performance: "icon-performance",
		validation: "icon-validation"
	};

	function getRepoConfig() {
		const embeddedContent = window.FREEOS_SITE_CONTENT || {};
		const embeddedRef = embeddedContent.ref;

		// Allow runtime overrides, but default to the build-generated reference so links always match the embedded docs.
		return window.FREEOS_REPO_CONFIG || {
			host: "https://gitlab.com",
			projectPath: "freeos.me/core",
			ref: embeddedRef || "d883072cb0df262dfff0e9357938230773eda03f"
		};
	}

	function getEmbeddedDoc(fileName) {
		const content = window.FREEOS_SITE_CONTENT;
		return content && content.docs ? (content.docs[fileName] || "") : "";
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

	function getSections(markdown) {
		// Both releases and changelog documents are organized around level-2 headings, so one splitter serves both parsers.
		return markdown.match(RELEASE_SECTION_PATTERN) || [];
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
		const cleaned = version
			.replace(/-?(alpha|beta|canary|stable)$/i, "")
			.replace(/[\[\]]/g, "")
			.trim();

		return cleaned ? (cleaned + " " + status) : version;
	}

	function matchReleaseHeading(section) {
		// Support both heading formats currently used by the project without forcing one canonical markdown style.
		for (let index = 0; index < RELEASE_HEADING_PATTERNS.length; index += 1) {
			const match = section.match(RELEASE_HEADING_PATTERNS[index]);
			if (match) {
				return match;
			}
		}

		return null;
	}

	function parseReleaseEntries(markdown) {
		// Extract only the fields needed by the home page preview cards and release CTA buttons.
		return getSections(markdown).map(function(section) {
			const headingMatch = matchReleaseHeading(section);
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
		// Changelog previews intentionally keep only a few bullets so the home page stays readable.
		return getSections(markdown).map(function(section) {
			const headingMatch = section.match(CHANGELOG_HEADING_PATTERN);
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
		if (!versionMatch) {
			return text;
		}

		return "v" + versionMatch[1].replace(/-(alpha|beta|canary|stable)$/i, function(_, suffix) {
			return " " + suffix.charAt(0).toUpperCase() + suffix.slice(1).toLowerCase();
		});
	}

	function applyVersionAnchors(markdownTarget, anchorsContainer) {
		const sections = markdownTarget.querySelectorAll("h2");
		const links = [];

		// Anchor IDs are synthesized after markdown rendering so source documents do not need embedded HTML IDs.
		sections.forEach(function(section) {
			const text = section.textContent || "";
			const id = makeAnchorId(text);
			section.id = id;
			links.push({ id: id, label: extractAnchorLabel(text) });
		});

		if (!anchorsContainer) {
			return;
		}

		anchorsContainer.innerHTML = links.map(function(link) {
			return '<a class="mini-btn" href="#' + link.id + '">' + link.label + '</a>';
		}).join("") || '<p class="meta">No anchors available.</p>';
	}

	// Add semantic icons to recognized markdown subheadings without changing the source docs.
	function decorateMarkdownHeadings(markdownTarget) {
		markdownTarget.querySelectorAll("h3").forEach(function(heading) {
			const text = (heading.textContent || "").trim().toLowerCase();
			const iconClass = ICON_MAP[text];

			if (!iconClass || heading.querySelector(".markdown-heading")) {
				return;
			}

			heading.innerHTML = '<span class="markdown-heading"><span class="ui-icon ' + iconClass + '" aria-hidden="true"></span><span>' + heading.textContent + '</span></span>';
		});
	}

	function escapeHtml(text) {
		// This renderer is intentionally simple, so escaping happens explicitly before building any HTML string.
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
		const safeHref = escapeHtml(href);
		const safeLabel = escapeHtml(label);
		const isExternal = /^https?:\/\//i.test(href);
		const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";

		return '<a href="' + safeHref + '"' + attrs + '>' + safeLabel + '</a>';
	}

	function renderInlineMarkdown(text) {
		// Inline rendering only supports links and plain text because the source docs do not require richer inline markdown today.
		const source = stripHtmlComments(text);
		const pattern = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s<]+|[A-Za-z0-9._/-]+\.html#[A-Za-z0-9._-]+)/g;
		let html = "";
		let lastIndex = 0;
		let match;

		while ((match = pattern.exec(source)) !== null) {
			html += escapeHtml(source.slice(lastIndex, match.index));
			html += match[1] && match[2] ? buildLink(match[2], match[1]) : buildLink(match[3], match[3]);
			lastIndex = pattern.lastIndex;
		}

		html += escapeHtml(source.slice(lastIndex));
		return html;
	}

	function renderMarkdown(markdown) {
		// This is a deliberately small renderer for headings, paragraphs, and bullet lists used by the project docs.
		const lines = markdown.replace(/\r\n/g, "\n").split("\n");
		const html = [];
		let paragraphLines = [];
		let listItems = [];

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
			const trimmed = line.trim();
			const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
			const listMatch = trimmed.match(/^[-*]\s+(.+)$/);

			if (!trimmed) {
				flushParagraph();
				flushList();
				return;
			}

			if (headingMatch) {
				flushParagraph();
				flushList();
				html.push("<h" + headingMatch[1].length + ">" + renderInlineMarkdown(headingMatch[2]) + "</h" + headingMatch[1].length + ">");
				return;
			}

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
