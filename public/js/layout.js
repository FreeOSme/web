(function() {
	// Analytics
	const _analytics = document.createElement("script");
	_analytics.defer = true;
	_analytics.src = "https://cloud.umami.is/script.js";
	_analytics.dataset.websiteId = "1a0825be-da9b-4123-8871-3374153a3ccb";
	document.head.appendChild(_analytics);

	// Normalize the current location once so every active-state check uses the same source of truth.
	const currentPath = window.location.pathname.toLowerCase();
	const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
	const EXTERNAL_LINKS = {
		gitlab: "https://gitlab.com/freeos.me"
	};
	// Keep navigation data declarative so adding, removing, or reordering items only requires editing this array.
	const NAV_ITEMS = [
		{ label: "Home", href: "/", icon: "icon-home", isActive: isHomeActive },
		{ label: "Blog", href: "/blog/", icon: "icon-summary", isActive: isBlogActive },
        { label: "Community", href: "/community.html", icon: "icon-community", isActive: isCommunityActive },
		{ label: "Releases", href: "/releases.html", icon: "icon-release", isActive: function() { return isPageActive("releases.html"); } },
		{ label: "Changelog", href: "/changelog.html", icon: "icon-changelog", isActive: function() { return isPageActive("changelog.html"); } },		
		{ label: "About", href: "/about.html", icon: "icon-about", isActive: function() { return isPageActive("about.html"); } },
		{ label: "GitLab", href: EXTERNAL_LINKS.gitlab, icon: "icon-gitlab", isExternal: true }
	];

	function isPageActive(pageName) {
		return currentPage === pageName;
	}

	function isHomeActive() {
		return currentPath === "/" || currentPath === "/index.html";
	}

	function isBlogActive() {
		return currentPath === "/blog" || currentPath.startsWith("/blog/");
	}

	function isCommunityActive() {
		return currentPath === "/community.html"
			|| currentPath === "/community"
			|| currentPath.startsWith("/community/");
	}

	function renderNavLink(item) {
		const isActive = item.isActive ? item.isActive() : false;
		const className = isActive ? " class=\"active\"" : "";
		const externalAttrs = item.isExternal ? " target=\"_blank\" rel=\"noopener noreferrer\"" : "";

		// Build the full anchor markup in one place so label, icon, active state, and external behavior stay consistent.
		return "<a"
			+ className
			+ " href=\"" + item.href + "\""
			+ externalAttrs
			+ ">"
			+ "<span class=\"nav-label\"><span class=\"ui-icon " + item.icon + "\" aria-hidden=\"true\"></span>"
			+ item.label
			+ "</span></a>";
	}

	function renderHeader() {
		const headerMount = document.getElementById("site-header");
		if (!headerMount) {
			return;
		}

		// Inject the shared header at runtime so every static page can reuse the same navigation definition.
		headerMount.innerHTML = ""
			+ "<header>"
			+ "\t<div class=\"container nav-wrap\">"
			+ "\t\t<a class=\"brand\" href=\"/\" aria-label=\"Go back to homepage\">"
			+ "\t\t\t<span class=\"brand-logo\" aria-hidden=\"true\"><span class=\"brand-glyph\"></span></span>"
			+ "\t\t\t<span>FreeOS.me</span>"
			+ "\t\t</a>"
			+ "\t\t<nav class=\"nav-links\" aria-label=\"Main navigation\">"
			+ NAV_ITEMS.map(renderNavLink).join("")
			+ "\t\t</nav>"
			+ "\t</div>"
			+ "</header>";
	}

	function decorateExternalLinks() {
		// External-link affordances are added centrally so page templates do not need to repeat accessibility text.
		document.querySelectorAll("a[target=\"_blank\"]").forEach(function(link) {
			if (!link.getAttribute("aria-label")) {
				const baseLabel = (link.textContent || "External link").trim();
				link.setAttribute("aria-label", baseLabel + " (opens in new tab)");
			}

			if (!link.getAttribute("title")) {
				link.setAttribute("title", "Opens in new tab");
			}
		});
	}

	function renderFooter() {
		const footerMount = document.getElementById("site-footer");
		if (!footerMount) {
			return;
		}

		// The footer is generated here for the same reason as the header: one definition across all static pages.
		const year = new Date().getFullYear();
		footerMount.innerHTML = ""
			+ "<footer>"
			+ "\t<div class=\"container\">"
			+ "\t\t<p>FreeOS.me @" + year + " · Linux distribution in progress</p>"
			+ "\t</div>"
			+ "</footer>";
	}

	renderHeader();
	decorateExternalLinks();
	renderFooter();
})();
