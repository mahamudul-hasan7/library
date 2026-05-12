// PDF Viewer - Handles PDF.js rendering and controls
(function () {
  const MIN_SCALE = 0.65;
  const MAX_SCALE = 3;
  const SCALE_STEP = 0.2;
  const DEFAULT_SCALE = 1.35;

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
    let isRendering = false;
    let renderToken = 0;
    let previewToken = 0;
    let toastTimer = null;
    let resizeTimer = null;

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

    function updateReaderProgress() {
      if (!pageCount) {
        return;
      }

      const progress = clamp(Math.round((currentPage / pageCount) * 100), 0, 100);
      const valueEl = getElement("readerProgressValue");
      const barEl = getElement("readerProgressBar");

      if (valueEl) {
        valueEl.textContent = progress + "%";
      }

      if (barEl) {
        barEl.style.width = progress + "%";
      }
    }

    function updateControls() {
      const pageInput = getElement("pdfPageInput");
      const pageCountLabel = getElement("pdfPageCount");
      const zoomValue = getElement("pdfZoomValue");
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

      setButtonDisabled("pdfPrevBtn", isRendering || !hasPrevious);
      setButtonDisabled("pdfPrevOverlayBtn", isRendering || !hasPrevious);
      setButtonDisabled("pdfNextBtn", isRendering || !hasNext);
      setButtonDisabled("pdfNextOverlayBtn", isRendering || !hasNext);
      setButtonDisabled("pdfZoomInBtn", isRendering || pdfScale >= MAX_SCALE);
      setButtonDisabled("pdfZoomOutBtn", isRendering || pdfScale <= MIN_SCALE);

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

    function animateCanvas(direction) {
      const canvas = getCanvas();
      if (!canvas) {
        return;
      }

      canvas.classList.remove("pdf-page-forward", "pdf-page-back", "pdf-page-zoom");
      void canvas.offsetWidth;

      if (direction === "forward") {
        canvas.classList.add("pdf-page-forward");
      } else if (direction === "back") {
        canvas.classList.add("pdf-page-back");
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
        const page = await pdfDoc.getPage(targetPage);
        if (token !== renderToken) {
          return false;
        }

        const canvas = getCanvas();
        if (!canvas) {
          return false;
        }

        const ctx = canvas.getContext("2d", { alpha: false });
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
        animateCanvas(direction);
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
      pdfScale = clamp(Number((pdfScale + delta).toFixed(2)), MIN_SCALE, MAX_SCALE);
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
      async loadPDF(pdfUrl) {
        try {
          const loadingTask = pdfjsLib.getDocument(pdfUrl);
          const pdf = await loadingTask.promise;

          pdfDoc = pdf;
          pageCount = pdf.numPages;
          currentPage = 1;
          pdfScale = DEFAULT_SCALE;
          showPdfUi();
          updateControls();

          return await renderPage(1, "jump");
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
