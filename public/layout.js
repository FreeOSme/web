(function() {
	const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

	function isActive(path) {
		return currentPage === path ? " active" : "";
	}

	const headerMount = document.getElementById("site-header");
	if (headerMount) {
		headerMount.innerHTML = ""
			+ "<header>"
			+ "\t<div class=\"container nav-wrap\">"
			+ "\t\t<a class=\"brand\" href=\"index.html\" aria-label=\"Go back to homepage\">"
			+ "\t\t\t<span class=\"brand-logo\" aria-hidden=\"true\"><span class=\"brand-glyph\"></span></span>"
			+ "\t\t\t<span>FreeOS.me</span>"
			+ "\t\t</a>"
			+ "\t\t<nav class=\"nav-links\" aria-label=\"Main navigation\">"
			+ "\t\t\t<a class=\"" + isActive("index.html") + "\" href=\"index.html\"><span class=\"nav-label\"><span class=\"ui-icon icon-home\" aria-hidden=\"true\"></span>Home</span></a>"
			+ "\t\t\t<a class=\"" + isActive("releases.html") + "\" href=\"releases.html\"><span class=\"nav-label\"><span class=\"ui-icon icon-release\" aria-hidden=\"true\"></span>Releases</span></a>"
			+ "\t\t\t<a class=\"" + isActive("changelog.html") + "\" href=\"changelog.html\"><span class=\"nav-label\"><span class=\"ui-icon icon-changelog\" aria-hidden=\"true\"></span>Changelog</span></a>"
			+ "\t\t\t<a class=\"" + isActive("community.html") + "\" href=\"community.html\"><span class=\"nav-label\"><span class=\"ui-icon icon-about\" aria-hidden=\"true\"></span>Community</span></a>"
			+ "\t\t\t<a class=\"" + isActive("about.html") + "\" href=\"about.html\"><span class=\"nav-label\"><span class=\"ui-icon icon-about\" aria-hidden=\"true\"></span>About</span></a>"
			+ "\t\t\t<a href=\"https://gitlab.com/freeos.me\" target=\"_blank\" rel=\"noopener noreferrer\"><span class=\"nav-label\"><span class=\"ui-icon icon-gitlab\" aria-hidden=\"true\"></span>GitLab</span></a>"
			+ "\t\t</nav>"
			+ "\t</div>"
			+ "</header>";
	}

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