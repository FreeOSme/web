(function () {
    "use strict";

    function applyTopOffset() {
        var matrixRoot = document.getElementById("matrixchat");
        if (matrixRoot) {
            matrixRoot.style.paddingTop = "56px";
            matrixRoot.style.boxSizing = "border-box";
        }

        document.body.classList.add("freeos-has-header");
    }

    function ensureHeader() {
        if (document.getElementById("freeos-client-header")) {
            applyTopOffset();
            return;
        }

        var header = document.createElement("header");
        header.id = "freeos-client-header";
        header.setAttribute("aria-label", "FreeOS navigation");

        header.style.position = "fixed";
        header.style.top = "0";
        header.style.left = "0";
        header.style.right = "0";
        header.style.height = "56px";
        header.style.zIndex = "2147483647";
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.justifyContent = "space-between";
        header.style.padding = "0 14px";
        header.style.background = "rgba(246, 245, 244, 0.92)";
        header.style.backdropFilter = "blur(12px)";
        header.style.borderBottom = "1px solid rgba(214, 211, 209, 0.9)";
        header.style.boxShadow = "0 1px 0 rgba(255, 255, 255, 0.6)";
        header.style.fontFamily = "Cantarell, Segoe UI, sans-serif";

        header.innerHTML =
            '<a href="https://freeos.me" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:.55rem;text-decoration:none;color:#241f31;font-weight:700;font-size:.98rem;">' +
            '<span style="width:28px;height:28px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(180deg,#65a3f0,#3584e4);color:#fff;font-size:.72rem;font-weight:700;">OS</span>' +
            '<span>FreeOS.me</span>' +
            '</a>' +
            '<nav aria-label="Main" style="display:flex;gap:.45rem;align-items:center;flex-wrap:wrap;justify-content:flex-end;">' +
            '<a href="https://freeos.me/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;color:#5e5c64;font-size:.9rem;font-weight:600;padding:.35rem .62rem;border-radius:9px;border:1px solid transparent;">Home</a>' +
            '<a href="https://freeos.me/blog/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;color:#5e5c64;font-size:.9rem;font-weight:600;padding:.35rem .62rem;border-radius:9px;border:1px solid transparent;">Blog</a>' +
            '<a href="https://freeos.me/community.html" target="_blank" rel="noopener noreferrer" style="text-decoration:none;color:#241f31;background:#fff;font-size:.9rem;font-weight:600;padding:.35rem .62rem;border-radius:9px;border:1px solid rgba(214, 211, 209, 0.9);">Community</a>' +
            '</nav>';

        document.body.appendChild(header);
        applyTopOffset();
    }

    function init() {
        ensureHeader();

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
