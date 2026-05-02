(function () {
  function bootMermaid() {
    var mermaid = window.__mermaid;
    if (!mermaid) {
      return;
    }

    var blocks = document.querySelectorAll("pre code.language-mermaid");
    if (!blocks.length) {
      return;
    }

    blocks.forEach(function (code, index) {
      var pre = code.closest("pre");
      if (!pre) {
        return;
      }

      var wrapper = document.createElement("div");
      wrapper.className = "mermaid";
      wrapper.id = "mermaid-diagram-" + index;
      wrapper.textContent = code.textContent || "";
      pre.replaceWith(wrapper);
    });

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "strict",
      flowchart: {
        htmlLabels: false,
        useMaxWidth: true
      }
    });

    mermaid.run({
      querySelector: ".mermaid"
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootMermaid, { once: true });
  } else {
    bootMermaid();
  }
})();
