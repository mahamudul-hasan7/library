// PDF Viewer - Handles PDF.js rendering and controls
(function () {
  const MIN_SCALE = 0.65;
  const MAX_SCALE = 3;
  const SCALE_STEP = 0.2;
  const DEFAULT_SCALE = 1.0;

  function initializePdfViewer() {
    if (window.PDFViewer) {
      return true;
    }

    if (typeof pdfjsLib === "undefined") {
      return false;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = "../Assets/vendor/pdfjs/pdf.worker.min.js";

    let pdfDoc = null;
    let currentPage = 1;
    let pageCount = 0;
    let pdfScale = DEFAULT_SCALE;
    let fitMode = "";
    let isRendering = false;
    let renderToken = 0;
    let previewToken = 0;
    let toastTimer = null;
    let resizeTimer = null;
    let progressTimer = null;

    function getElement(id) {
      return document.getElementById(id);
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function getPdfViewer() {
      return getElement("pdfViewer");
    }

    function getCanvas() {
      return getElement("pdfCanvas");
    }

    function getPreviewCanvas() {
      return getElement("pdfPreviewCanvas");
    }

    function setButtonDisabled(id, disabled) {
      const button = getElement(id);
      if (button) {
        button.disabled = disabled;
      }
    }

    function setButtonActive(id, isActive) {
      const button = getElement(id);
      if (button) {
        button.classList.toggle("is-active", isActive);
      }
    }

    function getAvailablePageSize() {
      const viewer = getPdfViewer();
      const previewPanel = getElement("pdfPreviewPanel");
      const isFullscreenViewer = Boolean(viewer && document.fullscreenElement === viewer);
      const viewerWidth = viewer ? viewer.clientWidth : window.innerWidth;
      const viewerHeight = viewer ? viewer.clientHeight : window.innerHeight;
      const panelWidth = previewPanel && window.getComputedStyle(previewPanel).display !== "none"
        ? previewPanel.offsetWidth + 24
        : 0;
      const horizontalPadding = isFullscreenViewer ? 84 : 72;
      const verticalPadding = isFullscreenViewer ? 132 : 64;

      return {
        width: Math.max(240, viewerWidth - panelWidth - horizontalPadding),
        height: Math.max(320, viewerHeight - verticalPadding)
      };
    }

    function getScaleForFitMode(baseViewport) {
      if (!fitMode || !baseViewport) {
        return pdfScale;
      }

      const available = getAvailablePageSize();
      const widthScale = available.width / baseViewport.width;
      const pageScale = Math.min(widthScale, available.height / baseViewport.height);
      const nextScale = fitMode === "page" ? pageScale : widthScale;

      return clamp(Number(nextScale.toFixed(2)), MIN_SCALE, MAX_SCALE);
    }

    function updateReaderProgress() {
      if (!window.BrainRootReader || typeof window.BrainRootReader.saveProgress !== "function" || !pageCount) {
        return;
      }

      window.clearTimeout(progressTimer);
      progressTimer = window.setTimeout(function () {
        window.BrainRootReader.saveProgress({
          pdfPage: currentPage,
          pdfPageCount: pageCount,
          progress: Math.round((currentPage / pageCount) * 100)
        });
      }, 160);
    }

    function updateControls() {
      const pageInput = getElement("pdfPageInput");
      const pageCountLabel = getElement("pdfPageCount");
      const zoomValue = getElement("pdfZoomValue");
      const fullscreenZoomValue = getElement("pdfFullscreenZoomValue");
      const previewPage = getElement("pdfPreviewPage");
      const previewButton = getElement("pdfPreviewButton");
      const hasPrevious = currentPage > 1;
      const hasNext = currentPage < pageCount;

      if (pageInput) {
        pageInput.max = pageCount || 1;
        pageInput.value = currentPage;
        pageInput.disabled = isRendering || !pageCount;
      }

      if (pageCountLabel) {
        pageCountLabel.textContent = "/ " + (pageCount || "--");
      }

      if (zoomValue) {
        zoomValue.textContent = Math.round(pdfScale * 100) + "%";
      }

      if (fullscreenZoomValue) {
        fullscreenZoomValue.textContent = Math.round(pdfScale * 100) + "%";
      }

      setButtonDisabled("pdfPrevBtn", isRendering || !hasPrevious);
      setButtonDisabled("pdfPrevOverlayBtn", isRendering || !hasPrevious);
      setButtonDisabled("pdfNextBtn", isRendering || !hasNext);
      setButtonDisabled("pdfNextOverlayBtn", isRendering || !hasNext);
      setButtonDisabled("pdfZoomInBtn", isRendering || pdfScale >= MAX_SCALE);
      setButtonDisabled("pdfZoomOutBtn", isRendering || pdfScale <= MIN_SCALE);
      setButtonDisabled("pdfFullscreenZoomInBtn", isRendering || pdfScale >= MAX_SCALE);
      setButtonDisabled("pdfFullscreenZoomOutBtn", isRendering || pdfScale <= MIN_SCALE);
      setButtonActive("pdfFitWidthBtn", fitMode === "width");
      setButtonActive("pdfFitPageBtn", fitMode === "page");
      setButtonActive("pdfFullscreenFitWidthBtn", fitMode === "width");
      setButtonActive("pdfFullscreenFitPageBtn", fitMode === "page");

      if (previewButton) {
        previewButton.disabled = isRendering || !hasNext;
      }

      if (previewPage) {
        previewPage.textContent = hasNext ? "Page " + (currentPage + 1) : "End";
      }

      updateReaderProgress();
    }

    function setRendering(value) {
      const stage = getElement("pdfStage");
      isRendering = value;

      if (stage) {
        stage.classList.toggle("is-rendering", value);
      }

      updateControls();
    }

    function showPageToast(text) {
      const toast = getElement("pdfPageToast");
      if (!toast) {
        return;
      }

      toast.textContent = text;
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(function () {
        toast.classList.remove("is-visible");
      }, 900);
    }

    function removePageGhost(ghost) {
      if (!ghost || !ghost.parentElement) {
        return;
      }

      ghost.parentElement.removeChild(ghost);
    }

    function createPageGhost(snapshot, direction) {
      const stage = getElement("pdfStage");
      if (!stage || !snapshot || direction === "zoom") {
        return null;
      }

      const viewer = getPdfViewer();
      const isFullscreenViewer = Boolean(viewer && document.fullscreenElement === viewer);
      const ghost = document.createElement("div");
      ghost.className = "pdf-page-ghost";
      ghost.setAttribute("aria-hidden", "true");
      ghost.style.backgroundImage = "url('" + snapshot.src + "')";
      ghost.style.width = snapshot.width + "px";
      ghost.style.height = snapshot.height + "px";
      ghost.classList.add(direction === "forward" ? "pdf-page-ghost-forward" : "pdf-page-ghost-back");

      if (isFullscreenViewer) {
        ghost.classList.add(direction === "forward" ? "pdf-page-ghost-turn-forward" : "pdf-page-ghost-turn-back");
      }

      stage.appendChild(ghost);

      window.setTimeout(function () {
        removePageGhost(ghost);
      }, isFullscreenViewer ? 760 : 520);

      return ghost;
    }

    function animateCanvas(direction, previousSnapshot) {
      const canvas = getCanvas();
      const viewer = getPdfViewer();
      if (!canvas) {
        return;
      }

      const isFullscreenViewer = Boolean(viewer && document.fullscreenElement === viewer);

      canvas.classList.remove(
        "pdf-page-forward",
        "pdf-page-back",
        "pdf-page-zoom",
        "pdf-page-turn-forward",
        "pdf-page-turn-back"
      );
      void canvas.offsetWidth;

      createPageGhost(previousSnapshot, direction);

      if (direction === "forward") {
        canvas.classList.add(isFullscreenViewer ? "pdf-page-turn-forward" : "pdf-page-forward");
      } else if (direction === "back") {
        canvas.classList.add(isFullscreenViewer ? "pdf-page-turn-back" : "pdf-page-back");
      } else {
        canvas.classList.add("pdf-page-zoom");
      }
    }

    async function renderPreview() {
      const canvas = getPreviewCanvas();
      const previewButton = getElement("pdfPreviewButton");

      if (!pdfDoc || !canvas) {
        return;
      }

      const nextPage = currentPage + 1;
      const token = ++previewToken;

      if (nextPage > pageCount) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 180;
        canvas.height = 240;
        if (previewButton) {
          previewButton.disabled = true;
        }
        updateControls();
        return;
      }

      try {
        const page = await pdfDoc.getPage(nextPage);
        if (token !== previewToken) {
          return;
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const panelWidth = Math.max(110, canvas.parentElement ? canvas.parentElement.clientWidth : 120);
        const scale = clamp((panelWidth - 2) / baseViewport.width, 0.14, 0.32);
        const viewport = page.getViewport({ scale: scale });
        const ctx = canvas.getContext("2d", { alpha: false });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({
          canvasContext: ctx,
          viewport: viewport
        }).promise;

        if (previewButton) {
          previewButton.disabled = isRendering;
        }
      } catch (error) {
        console.error("PDF preview render error:", error);
      }
    }

    async function renderPage(pageNum, reason) {
      if (!pdfDoc) {
        return false;
      }

      const targetPage = clamp(parseInt(pageNum, 10) || currentPage, 1, pageCount);
      const direction = reason === "zoom"
        ? "zoom"
        : targetPage > currentPage
          ? "forward"
          : targetPage < currentPage
            ? "back"
            : "zoom";
      const token = ++renderToken;

      setRendering(true);

      try {
        const previousCanvas = getCanvas();
        const previousSnapshot = previousCanvas && previousCanvas.width && previousCanvas.height && direction !== "zoom"
          ? {
              src: previousCanvas.toDataURL("image/png"),
              width: previousCanvas.offsetWidth || previousCanvas.width,
              height: previousCanvas.offsetHeight || previousCanvas.height
            }
          : null;
        const page = await pdfDoc.getPage(targetPage);
        if (token !== renderToken) {
          return false;
        }

        const canvas = getCanvas();
        if (!canvas) {
          return false;
        }

        const ctx = canvas.getContext("2d", { alpha: false });
        const baseViewport = page.getViewport({ scale: 1 });
        pdfScale = getScaleForFitMode(baseViewport);
        const viewport = page.getViewport({ scale: pdfScale });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        await page.render({
          canvasContext: ctx,
          viewport: viewport
        }).promise;

        if (token !== renderToken) {
          return false;
        }

        currentPage = targetPage;
        animateCanvas(direction, previousSnapshot);
        showPageToast("Page " + currentPage);
        updateControls();
        await renderPreview();
        return true;
      } catch (error) {
        console.error("Page render error:", error);
        return false;
      } finally {
        if (token === renderToken) {
          setRendering(false);
        }
      }
    }

    async function goToPage(pageNum) {
      const success = await renderPage(pageNum, "jump");

      if (!success) {
        updateControls();
      }
    }

    async function zoomBy(delta) {
      fitMode = "";
      pdfScale = clamp(Number((pdfScale + delta).toFixed(2)), MIN_SCALE, MAX_SCALE);
      await renderPage(currentPage, "zoom");
    }

    async function fitTo(mode) {
      fitMode = mode;
      await renderPage(currentPage, "zoom");
    }

    async function toggleFullscreen() {
      const viewer = getPdfViewer();
      if (!viewer) {
        return;
      }

      try {
        if (!document.fullscreenElement) {
          await viewer.requestFullscreen();
          showFullscreenNotice();
        } else {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.error("Fullscreen error:", error);
      }
    }

    function showFullscreenNotice() {
      const notice = getElement("readerNotice");
      if (!notice) {
        return;
      }
      notice.textContent = "To exit full screen press ESC";
      notice.classList.remove("is-hidden");
    }

    function refreshFullscreenButton() {
      const viewer = getPdfViewer();
      const button = getElement("pdfFullscreenBtn");

      if (!button || !viewer) {
        return;
      }

      button.textContent = document.fullscreenElement === viewer ? "Exit" : "Full";
    }

    function showPdfUi() {
      const pdfControls = getElement("pdfControls");
      const readerContent = getElement("readerContent");
      const viewer = getPdfViewer();

      if (pdfControls) {
        pdfControls.style.display = "flex";
      }

      if (readerContent) {
        readerContent.style.display = "none";
      }

      if (viewer) {
        viewer.style.display = "grid";
      }
    }

    window.PDFViewer = {
      async loadPDF(pdfUrl, options) {
        try {
          const config = options || {};
          const loadingTask = pdfjsLib.getDocument(pdfUrl);
          const pdf = await loadingTask.promise;

          pdfDoc = pdf;
          pageCount = pdf.numPages;
          currentPage = 1;
          pdfScale = DEFAULT_SCALE;
          fitMode = config.fitMode || "";
          showPdfUi();
          updateControls();

          return await renderPage(clamp(Number(config.initialPage || 1), 1, pageCount), "jump");
        } catch (error) {
          console.error("PDF loading error:", error);

          const viewer = getPdfViewer();
          if (viewer) {
            viewer.style.display = "none";
          }

          return false;
        }
      },

      renderPage: renderPage,

      async nextPage() {
        if (currentPage < pageCount) {
          await renderPage(currentPage + 1, "next");
        }
      },

      async prevPage() {
        if (currentPage > 1) {
          await renderPage(currentPage - 1, "prev");
        }
      },

      goToPage: goToPage,

      async zoomIn() {
        await zoomBy(SCALE_STEP);
      },

      async zoomOut() {
        await zoomBy(-SCALE_STEP);
      },

      async fitWidth() {
        await fitTo("width");
      },

      async fitPage() {
        await fitTo("page");
      },

      toggleFullscreen: toggleFullscreen,

      getCurrentPage() {
        return currentPage;
      },

      getPageCount() {
        return pageCount;
      }
    };

    function bindPdfControls() {
      const bindings = [
        ["pdfPrevBtn", "click", function () { window.PDFViewer.prevPage(); }],
        ["pdfPrevOverlayBtn", "click", function () { window.PDFViewer.prevPage(); }],
        ["pdfNextBtn", "click", function () { window.PDFViewer.nextPage(); }],
        ["pdfNextOverlayBtn", "click", function () { window.PDFViewer.nextPage(); }],
        ["pdfPreviewButton", "click", function () { window.PDFViewer.nextPage(); }],
        ["pdfZoomInBtn", "click", function () { window.PDFViewer.zoomIn(); }],
        ["pdfZoomOutBtn", "click", function () { window.PDFViewer.zoomOut(); }],
        ["pdfFitWidthBtn", "click", function () { window.PDFViewer.fitWidth(); }],
        ["pdfFitPageBtn", "click", function () { window.PDFViewer.fitPage(); }],
        ["pdfFullscreenZoomInBtn", "click", function () { window.PDFViewer.zoomIn(); }],
        ["pdfFullscreenZoomOutBtn", "click", function () { window.PDFViewer.zoomOut(); }],
        ["pdfFullscreenFitWidthBtn", "click", function () { window.PDFViewer.fitWidth(); }],
        ["pdfFullscreenFitPageBtn", "click", function () { window.PDFViewer.fitPage(); }],
        ["pdfFullscreenExitBtn", "click", function () { window.PDFViewer.toggleFullscreen(); }],
        ["pdfFullscreenBtn", "click", function () { window.PDFViewer.toggleFullscreen(); }]
      ];

      bindings.forEach(function (binding) {
        const element = getElement(binding[0]);
        if (!element || element.dataset.pdfBound === "true") {
          return;
        }

        element.addEventListener(binding[1], binding[2]);
        element.dataset.pdfBound = "true";
      });

      const pageInput = getElement("pdfPageInput");
      if (pageInput && pageInput.dataset.pdfBound !== "true") {
        pageInput.addEventListener("change", function () {
          goToPage(pageInput.value);
        });
        pageInput.addEventListener("keydown", function (event) {
          if (event.key === "Enter") {
            event.preventDefault();
            goToPage(pageInput.value);
          }
        });
        pageInput.dataset.pdfBound = "true";
      }
    }

    document.addEventListener("fullscreenchange", function () {
      refreshFullscreenButton();
      if (!document.fullscreenElement) {
        const notice = getElement("readerNotice");
        if (notice) {
          notice.classList.add("is-hidden");
        }
      }
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (fitMode && pdfDoc) {
          renderPage(currentPage, "zoom");
        }
        renderPreview();
      }, 120);
    });

    document.addEventListener("keydown", function (event) {
      const viewer = getPdfViewer();
      const activeTag = document.activeElement ? document.activeElement.tagName : "";

      if (!viewer || viewer.style.display === "none" || activeTag === "INPUT") {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        window.PDFViewer.nextPage();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        window.PDFViewer.prevPage();
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        window.PDFViewer.zoomIn();
      } else if (event.key === "-") {
        event.preventDefault();
        window.PDFViewer.zoomOut();
      }
    });

    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (fitMode && pdfDoc) {
          renderPage(currentPage, "zoom");
        }
        renderPreview();
      }, 120);
    });

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bindPdfControls, { once: true });
    } else {
      bindPdfControls();
    }

    refreshFullscreenButton();
    window.dispatchEvent(new CustomEvent("brainroot:pdfviewer-ready"));
    return true;
  }

  if (!initializePdfViewer()) {
    const pdfScript = document.querySelector("script[data-pdfjs]");

    if (pdfScript) {
      pdfScript.addEventListener("load", initializePdfViewer, { once: true });
      pdfScript.addEventListener("error", function () {
        console.warn("PDF.js not loaded; native browser PDF fallback will be used.");
      }, { once: true });
    }

    window.addEventListener("load", initializePdfViewer, { once: true });
  }
})();
