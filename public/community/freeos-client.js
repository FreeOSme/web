(function () {
    "use strict";

    function ensureWebsiteLink() {
        if (document.getElementById("freeos-client-link")) {
            return;
        }

        var link = document.createElement("a");
        link.id = "freeos-client-link";
        link.href = "https://freeos.me";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "FreeOS.me";
        link.setAttribute("aria-label", "Open FreeOS.me website");

        link.style.position = "fixed";
        link.style.right = "14px";
        link.style.bottom = "12px";
        link.style.zIndex = "2147483647";
        link.style.padding = "8px 11px";
        link.style.borderRadius = "10px";
        link.style.border = "1px solid rgba(28, 113, 216, 0.45)";
        link.style.background = "linear-gradient(180deg, #ffffff, #edf5ff)";
        link.style.color = "#1c71d8";
        link.style.font = "600 12px/1.2 Cantarell, Segoe UI, sans-serif";
        link.style.textDecoration = "none";
        link.style.boxShadow = "0 4px 14px rgba(36, 31, 49, 0.12)";

        document.body.appendChild(link);
    }

    function init() {
        ensureWebsiteLink();

        var observer = new MutationObserver(function () {
            ensureWebsiteLink();
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
