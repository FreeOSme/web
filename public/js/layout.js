(function() {
	const currentPath = window.location.pathname.toLowerCase();
	const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

	function isActive(path) {
		// Home: activo si estamos en "/" o no hay página específica
		if (path === "index.html") {
			return (currentPath === "/" || currentPath === "/index.html") ? " active" : "";
		}
		return currentPage === path ? " active" : "";
	}

	function isBlogActive() {
		// Activo para /blog, /blog/ y cualquier subruta del blog
		return (currentPath === "/blog" || currentPath.startsWith("/blog/")) ? " active" : "";
	}

	function isCommunityActive() {
		return currentPath === "/community.html"
			|| currentPath === "/community"
			|| currentPath.startsWith("/community/")
			? " active"
			: "";
	}

	const headerMount = document.getElementById("site-header");
	if (headerMount) {
		headerMount.innerHTML = ""
			+ "<header>"
			+ "\t<div class=\"container nav-wrap\">"
			+ "\t\t<a class=\"brand\" href=\"/\" aria-label=\"Go back to homepage\">"
			+ "\t\t\t<span class=\"brand-logo\" aria-hidden=\"true\"><span class=\"brand-glyph\"></span></span>"
			+ "\t\t\t<span>FreeOS.me</span>"
			+ "\t\t</a>"
			+ "\t\t<nav class=\"nav-links\" aria-label=\"Main navigation\">"
			+ "\t\t\t<a class=\"" + isActive("index.html") + "\" href=\"/\"><span class=\"nav-label\"><span class=\"ui-icon icon-home\" aria-hidden=\"true\"></span>Home</span></a>"
			+ "\t\t\t<a class=\"" + isBlogActive() + "\" href=\"/blog/\"><span class=\"nav-label\"><span class=\"ui-icon icon-summary\" aria-hidden=\"true\"></span>Blog</span></a>"
			+ "\t\t\t<a class=\"" + isActive("releases.html") + "\" href=\"/releases.html\"><span class=\"nav-label\"><span class=\"ui-icon icon-release\" aria-hidden=\"true\"></span>Releases</span></a>"
			+ "\t\t\t<a class=\"" + isActive("changelog.html") + "\" href=\"/changelog.html\"><span class=\"nav-label\"><span class=\"ui-icon icon-changelog\" aria-hidden=\"true\"></span>Changelog</span></a>"
			+ "\t\t\t<a class=\"" + isCommunityActive() + "\" href=\"/community.html\"><span class=\"nav-label\"><span class=\"ui-icon icon-community\" aria-hidden=\"true\"></span>Community</span></a>"
			+ "\t\t\t<a class=\"" + isActive("about.html") + "\" href=\"/about.html\"><span class=\"nav-label\"><span class=\"ui-icon icon-about\" aria-hidden=\"true\"></span>About</span></a>"
			+ "\t\t\t<a href=\"https://gitlab.com/freeos.me\" target=\"_blank\" rel=\"noopener noreferrer\"><span class=\"nav-label\"><span class=\"ui-icon icon-gitlab\" aria-hidden=\"true\"></span>GitLab</span></a>"
			+ "\t\t</nav>"
			+ "\t</div>"
			+ "</header>";

	}

	document.querySelectorAll("a[target=\"_blank\"]").forEach(function(link) {
		if (!link.getAttribute("aria-label")) {
			const baseLabel = (link.textContent || "External link").trim();
			link.setAttribute("aria-label", baseLabel + " (opens in new tab)");
		}
		if (!link.getAttribute("title")) {
			link.setAttribute("title", "Opens in new tab");
		}
	});

	const footerMount = document.getElementById("site-footer");
	if (footerMount) {
		const year = new Date().getFullYear();
		footerMount.innerHTML = ""
			+ "<footer>"
			+ "\t<div class=\"container\">"
			+ "\t\t<p>FreeOS.me @" + year + " · Linux distribution in progress</p>"
			+ "\t</div>"
			+ "</footer>";
	}
})();