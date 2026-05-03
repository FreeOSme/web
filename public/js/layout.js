(function() {
	// Analytics
	const _matomoSrc = "//stats.garcia.at/matomo.js";
	const _hasMatomo = document.querySelector('script[src*="stats.garcia.at/matomo.js"]');
	if (!_hasMatomo) {
		var _paq = window._paq = window._paq || [];
		_paq.push(["trackPageView"]);
		_paq.push(["enableLinkTracking"]);
		(function() {
			var u = "//stats.garcia.at/";
			_paq.push(["setTrackerUrl", u + "matomo.php"]);
			_paq.push(["setSiteId", "2"]);
			var d = document;
			var g = d.createElement("script");
			var s = d.getElementsByTagName("script")[0];
			g.async = true;
			g.src = _matomoSrc;
			s.parentNode.insertBefore(g, s);
		})();
	}

	// Normalize the current location once so every active-state check uses the same source of truth.
	const currentPath = window.location.pathname.toLowerCase();
	const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
	const EXTERNAL_LINKS = {
		gitlab: "https://gitlab.com/freeos.me",
		mastodon: "https://mastodon.social/@freeos"
	};
	// Keep navigation data declarative so adding, removing, or reordering items only requires editing this array.
	const NAV_ITEMS = [
		{ label: "Home", href: "/", icon: "icon-home", isActive: isHomeActive },
		{ label: "Blog", href: "/blog/", icon: "icon-summary", isActive: isBlogActive },
		// { label: "Wiki", href: "/wiki/", icon: "icon-summary", isActive: isWikiActive },
		// { label: "Community", href: "/community.html", icon: "icon-community", isActive: isCommunityActive },
		{ label: "Releases", href: "/releases.html", icon: "icon-release", isActive: function() { return isPageActive("releases.html"); } },
		{ label: "Changelog", href: "/changelog.html", icon: "icon-changelog", isActive: function() { return isPageActive("changelog.html"); } },		
		{ label: "About", href: "/about.html", icon: "icon-about", isActive: function() { return isPageActive("about.html"); } },
		{ label: "Mastodon", href: EXTERNAL_LINKS.mastodon, icon: "icon-mastodon", isExternal: true, className: "social-mastodon" },
		{ label: "GitLab", href: EXTERNAL_LINKS.gitlab, icon: "icon-gitlab", isExternal: true, className: "social-gitlab" }
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

	function isWikiActive() {
		return currentPath === "/wiki" || currentPath.startsWith("/wiki/");
	}

	function isCommunityActive() {
		return currentPath === "/community.html"
			|| currentPath === "/community"
			|| currentPath.startsWith("/community/");
	}

	function renderNavLink(item) {
		const isActive = item.isActive ? item.isActive() : false;
		const classNames = [];
		if (isActive) {
			classNames.push("active");
		}
		if (item.className) {
			classNames.push(item.className);
		}
		const className = classNames.length ? " class=\"" + classNames.join(" ") + "\"" : "";
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
			+ "\t\t\t<img class=\"brand-image\" src=\"/images/logo.png\" alt=\"FreeOS.me\">"
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
			+ "\t\t<p><a href=\"https://gitlab.com/freeos.me/awesone/\" target=\"_blank\" rel=\"noopener noreferrer\">FreeOS links</a></p>"
			+ "\t</div>"
			+ "</footer>";
	}

	renderHeader();
	decorateExternalLinks();
	renderFooter();
})();
