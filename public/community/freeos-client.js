(function () {
    "use strict";

    var EXTERNAL_LINKS = {
        gitlab: "https://gitlab.com/freeos.me",
        mastodon: "https://mastodon.social/@freeos",
    };

    var NAV_ITEMS = [
        { label: "Home", href: "/", icon: "icon-home", active: isHomeActive },
        { label: "Blog", href: "/blog/", icon: "icon-summary", active: isBlogActive },
        // { label: "Wiki", href: "/wiki/", icon: "icon-summary", active: isWikiActive },
        // { label: "Community", href: "/community.html", icon: "icon-community", active: isCommunityActive },
        { label: "Releases", href: "/releases.html", icon: "icon-release", active: isReleasesActive },
        { label: "Changelog", href: "/changelog.html", icon: "icon-changelog", active: isChangelogActive },
        { label: "About", href: "/about.html", icon: "icon-about", active: isAboutActive },
        { label: "Mastodon", href: EXTERNAL_LINKS.mastodon, icon: "icon-mastodon", className: "social-mastodon", external: true },
        { label: "GitLab", href: EXTERNAL_LINKS.gitlab, icon: "icon-gitlab", external: true },
    ];

    function getCurrentPath() {
        return (window.location.pathname || "").toLowerCase();
    }

    function isHomeActive() {
        var path = getCurrentPath();
        return path === "/" || path === "/index.html";
    }

    function isBlogActive() {
        return getCurrentPath().indexOf("/blog") === 0;
    }

    function isWikiActive() {
        return getCurrentPath().indexOf("/wiki") === 0;
    }

    function isCommunityActive() {
        var path = getCurrentPath();
        return path === "/community" || path === "/community/" || path === "/community.html" || path.indexOf("/community/") === 0;
    }

    function isReleasesActive() {
        return getCurrentPath() === "/releases.html";
    }

    function isChangelogActive() {
        return getCurrentPath() === "/changelog.html";
    }

    function isAboutActive() {
        return getCurrentPath() === "/about.html";
    }

    function ensureHeaderStyles() {
        if (document.getElementById("freeos-client-header-style")) {
            return;
        }

        var style = document.createElement("style");
        style.id = "freeos-client-header-style";
        style.textContent =
            "#freeos-client-header{position:fixed;top:0;left:0;right:0;z-index:2147483647;backdrop-filter:blur(18px);background:rgba(246,245,244,.82);border-bottom:1px solid rgba(214,211,209,.9);box-shadow:0 1px 0 rgba(255,255,255,.6)}" +
            "#freeos-client-header .nav-wrap{display:flex;align-items:center;justify-content:space-between;padding:.85rem 0;gap:1rem;width:min(1120px,calc(100% - 2rem));margin:0 auto}" +
            "#freeos-client-header .brand{display:flex;align-items:center;gap:0;text-decoration:none;color:#241f31;font-weight:700;font-size:1.02rem}" +
            "#freeos-client-header .brand-image{height:34px;width:auto;display:block}" +
            "#freeos-client-header .brand-logo{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(180deg,#65a3f0,#3584e4);color:#fff;font-family:Cantarell,Segoe UI,sans-serif;font-weight:700;box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 2px 6px rgba(36,31,49,.06)}" +
            "#freeos-client-header .brand-glyph{width:15px;height:15px;border-radius:4px;background:radial-gradient(circle at 25% 25%,#fff 0 2px,transparent 2.4px),radial-gradient(circle at 75% 25%,#fff 0 2px,transparent 2.4px),radial-gradient(circle at 25% 75%,#fff 0 2px,transparent 2.4px),radial-gradient(circle at 75% 75%,#fff 0 2px,transparent 2.4px);opacity:.96}" +
            "#freeos-client-header .nav-links{display:flex;gap:.55rem;align-items:center;flex-wrap:wrap;justify-content:flex-end}" +
            "#freeos-client-header .nav-links a{text-decoration:none;color:#5e5c64;font-size:.94rem;font-weight:600;padding:.48rem .8rem;border-radius:10px;transition:background-color 160ms ease,color 160ms ease,border-color 160ms ease;border:1px solid transparent}" +
            "#freeos-client-header .nav-links a:hover,#freeos-client-header .nav-links a:focus-visible{color:#241f31;background:#f1f3f5;border-color:rgba(214,211,209,.8)}" +
            "#freeos-client-header .nav-links a.active{color:#241f31;background:#fff;border-color:#d6d3d1;box-shadow:0 2px 6px rgba(36,31,49,.06)}" +
            "#freeos-client-header .nav-links a.social-mastodon{color:#6364ff}" +
            "#freeos-client-header .nav-links a.social-mastodon:hover,#freeos-client-header .nav-links a.social-mastodon:focus-visible{color:#4f52cc}" +
            "#freeos-client-header .nav-label{display:inline-flex;align-items:center;gap:.5rem}" +
            "#freeos-client-header .ui-icon{display:inline-block;position:relative;flex:0 0 auto;color:currentColor;width:14px;height:14px}" +
            "#freeos-client-header .icon-release::before,#freeos-client-header .icon-changelog::before,#freeos-client-header .icon-about::before,#freeos-client-header .icon-community::before,#freeos-client-header .icon-gitlab::before,#freeos-client-header .icon-home::before,#freeos-client-header .icon-summary::before,#freeos-client-header .icon-mastodon::before{content:'';position:absolute;inset:0;border:1.8px solid currentColor;border-radius:3px;box-sizing:border-box}" +
            "#freeos-client-header .icon-home::before{border:0;background:currentColor;clip-path:polygon(50% 5%,92% 38%,92% 44%,82% 44%,82% 92%,18% 92%,18% 44%,8% 44%,8% 38%);opacity:.95}" +
            "#freeos-client-header .icon-home::after{content:'';position:absolute;left:5px;right:5px;bottom:1px;height:6px;background:#f6f5f4;border-radius:2px 2px 0 0}" +
            "#freeos-client-header .icon-summary::before{inset:1px}" +
            "#freeos-client-header .icon-summary::after{content:'';position:absolute;left:4px;right:4px;top:4px;height:1.8px;background:currentColor;box-shadow:0 4px 0 currentColor}" +
            "#freeos-client-header .icon-release::after{content:'';position:absolute;left:3px;right:3px;top:3px;height:1.8px;background:currentColor;box-shadow:0 4px 0 currentColor,0 8px 0 currentColor}" +
            "#freeos-client-header .icon-changelog::before{border-radius:999px;border-width:1.8px;clip-path:inset(0 round 999px)}" +
            "#freeos-client-header .icon-changelog::after{content:'';position:absolute;left:6px;top:2px;width:1.8px;height:10px;background:currentColor;box-shadow:-3px 3px 0 currentColor,3px 5px 0 currentColor;transform:rotate(35deg);transform-origin:center}" +
            "#freeos-client-header .icon-about::before{border-radius:999px;border-width:1.8px}" +
            "#freeos-client-header .icon-about::after{content:'';position:absolute;left:6px;top:3px;width:2px;height:2px;border-radius:999px;background:currentColor;box-shadow:0 4px 0 currentColor,0 6px 0 currentColor}" +
            "#freeos-client-header .icon-community::before{border-radius:999px;border-width:1.8px;opacity:.95}" +
            "#freeos-client-header .icon-community::after{content:'';position:absolute;left:3px;right:3px;bottom:2px;height:5px;border:1.8px solid currentColor;border-top:0;border-radius:0 0 999px 999px;box-sizing:border-box}" +
            "#freeos-client-header .icon-gitlab::before{border:0;background:currentColor;clip-path:polygon(22% 34%,30% 20%,39% 20%,43% 15%,50% 12%,57% 15%,61% 20%,70% 20%,78% 34%,78% 50%,72% 61%,72% 81%,63% 81%,63% 67%,56% 64%,56% 82%,44% 82%,44% 64%,37% 67%,37% 81%,28% 81%,28% 61%,22% 50%);opacity:.95}" +
            "#freeos-client-header .icon-gitlab::after{content:'';position:absolute;left:4px;top:4px;width:2px;height:2px;border-radius:999px;background:#f6f5f4;box-shadow:4px 0 0 #f6f5f4}" +
            "#freeos-client-header .icon-mastodon::before{border:0;background:currentColor;border-radius:4px;clip-path:polygon(14% 88%,14% 32%,24% 18%,40% 18%,50% 31%,60% 18%,76% 18%,86% 32%,86% 88%,74% 88%,74% 44%,66% 34%,58% 44%,58% 88%,42% 88%,42% 44%,34% 34%,26% 44%,26% 88%);opacity:.95}" +
            "#freeos-client-header .icon-mastodon::after{content:'';position:absolute;left:4px;top:5px;width:2px;height:2px;border-radius:999px;background:#f6f5f4;box-shadow:4px 0 0 #f6f5f4}" +
            "#freeos-client-header .nav-links a[target='_blank'] .nav-label::after{content:'';display:inline-block;width:.5rem;height:.5rem;border-top:1.6px solid currentColor;border-right:1.6px solid currentColor;transform:translateY(-1px);box-sizing:border-box;opacity:.82}" +
            "@media (max-width:980px){#freeos-client-header .nav-wrap{padding:.55rem 0}.freeos-has-header #matrixchat{padding-top:68px!important}}";

        document.head.appendChild(style);
    }

    function applyTopOffset() {
        var matrixRoot = document.getElementById("matrixchat");
        if (matrixRoot) {
            matrixRoot.style.paddingTop = window.innerWidth <= 980 ? "68px" : "60px";
            matrixRoot.style.boxSizing = "border-box";
        }

        document.body.classList.add("freeos-has-header");
    }

    function renderNavItems() {
        return NAV_ITEMS.map(function (item) {
            var active = item.active ? item.active() : false;
            var activeClass = active ? " active" : "";
            var customClass = item.className ? " " + item.className : "";
            var external = item.external ? " target=\"_blank\" rel=\"noopener noreferrer\"" : "";

            return "<a class=\"" + (activeClass + customClass).trim() + "\" href=\"" + item.href + "\"" + external + ">" +
                "<span class=\"nav-label\"><span class=\"ui-icon " + item.icon + "\" aria-hidden=\"true\"></span>" + item.label + "</span>" +
                "</a>";
        }).join("");
    }

    function ensureHeader() {
        if (document.getElementById("freeos-client-header")) {
            applyTopOffset();
            return;
        }

        ensureHeaderStyles();

        var header = document.createElement("header");
        header.id = "freeos-client-header";
        header.setAttribute("aria-label", "FreeOS navigation");

        header.innerHTML =
            '<div class="nav-wrap">' +
            '<a class="brand" href="/" aria-label="Go back to homepage">' +
            '<img class="brand-image" src="/images/logo.png" alt="FreeOS.me">' +
            '</a>' +
            '<nav class="nav-links" aria-label="Main navigation">' +
            renderNavItems() +
            '</nav>' +
            '</div>';

        document.body.appendChild(header);
        applyTopOffset();
    }

    function init() {
        ensureHeader();

        window.addEventListener("resize", applyTopOffset);

        var observer = new MutationObserver(function () {
            ensureHeader();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
