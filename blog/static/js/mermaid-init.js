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

    wireFigureReferences();
  }

  function wireFigureReferences() {
    var captions = document.querySelectorAll(".blog-content .figure-caption");
    if (!captions.length) {
      return;
    }

    var figureNumberById = {};

    captions.forEach(function (caption, index) {
      var figureNumber = index + 1;
      if (!caption.id) {
        caption.id = "fig-" + figureNumber;
      }
      figureNumberById[caption.id] = figureNumber;
    });

    var refs = document.querySelectorAll("a.fig-ref[data-fig-ref]");
    refs.forEach(function (ref) {
      var targetId = ref.getAttribute("data-fig-ref") || "";
      var figureNumber = figureNumberById[targetId];
      if (figureNumber) {
        ref.textContent = "Figure " + figureNumber;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootMermaid, { once: true });
  } else {
    bootMermaid();
  }
})();
