import { useEffect, useRef, useState } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";

export default function DrishyamAR() {
  const containerRef = useRef(null);
  const mindarRef = useRef(null);
  const scanCompletedRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState("");
  const [showResult, setShowResult] = useState(false);

  const WEBSITE_URL = "https://www.rjatlasdigitalai.com/";

  const hideMindARScannerUI = () => {
    const selectors = [
      ".mindar-ui-scanning",
      ".mindar-ui-loading",
      ".mindar-ui-compatibility",
      ".mindar-ui-error",
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.style.display = "none";
        element.style.opacity = "0";
        element.style.visibility = "hidden";
        element.style.pointerEvents = "none";
      });
    });
  };

  const showMindARScannerUI = () => {
    const selectors = [
      ".mindar-ui-scanning",
      ".mindar-ui-loading",
      ".mindar-ui-compatibility",
      ".mindar-ui-error",
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.style.display = "";
        element.style.opacity = "";
        element.style.visibility = "";
        element.style.pointerEvents = "";
      });
    });
  };

  const cleanAR = async () => {
    try {
      scanCompletedRef.current = false;
      setShowResult(false);
      setStatus("");
      setStarted(false);
      showMindARScannerUI();

      if (mindarRef.current) {
        await mindarRef.current.stop();
        mindarRef.current = null;
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    } catch (error) {
      console.log("Clean AR error:", error);
    }
  };

  const startAR = async () => {
    if (started) return;

    try {
      await cleanAR();

      scanCompletedRef.current = false;
      setShowResult(false);
      setStatus("Starting camera...");

      const mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: "/targets/drishyam3.mind",
        filterMinCF: 0.001,
        filterBeta: 0.01,
      });

      mindarRef.current = mindarThree;

      const anchor = mindarThree.addAnchor(0);

      anchor.onTargetFound = () => {
        if (scanCompletedRef.current) return;

        scanCompletedRef.current = true;

        setShowResult(true);
        setStatus("");

        setTimeout(() => {
          hideMindARScannerUI();
        }, 100);
      };

      anchor.onTargetLost = () => {
        if (scanCompletedRef.current) {
          hideMindARScannerUI();
        }
      };

      await mindarThree.start();

      setStarted(true);
      setStatus("Scan the target image");
    } catch (error) {
      console.log(error);
      setStatus("Camera permission or AR start failed");
      setStarted(false);
      await cleanAR();
    }
  };

  const stopAR = async () => {
    await cleanAR();
  };

  const scanAgain = async () => {
    await cleanAR();

    setTimeout(() => {
      startAR();
    }, 100);
  };

  useEffect(() => {
    return () => {
      cleanAR();
    };
  }, []);

  return (
    <div className="ar-page">
      <div ref={containerRef} className="ar-container" />

      {showResult && (
        <div className="screen-result">
          <div className="result-card hero-card">
            <p className="eyebrow">PREMIUM SURFACE SOLUTIONS</p>

            <h1>StoneLux Marble</h1>

            <p className="subtitle">
              Marble • Granite • Tiles • Wall Cladding
            </p>

            <button
              className="visit-button"
              onClick={() => {
                window.location.href = WEBSITE_URL;
              }}
            >
              BOOK SITE VISIT
            </button>
          </div>

          <div className="product-grid">
            <div className="product-card">
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80"
                alt="Marble"
              />
              <h3>Marble</h3>
              <p>Luxury natural stone</p>
            </div>

            <div className="product-card">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80"
                alt="Granite"
              />
              <h3>Granite</h3>
              <p>Strong premium finish</p>
            </div>

            <div className="product-card">
              <img
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80"
                alt="Tiles"
              />
              <h3>Tiles</h3>
              <p>Modern wall & floor</p>
            </div>
          </div>

          <div className="pill-row">
            <div className="feature-pill">Wall Cladding</div>
            <div className="feature-pill">Kitchen Tops</div>
          </div>

          <div className="contact-card">
            <p>FREE CONSULTATION</p>
            <h2>+91 98765 43210</h2>
            <span>Thalassery, Kerala | www.rjatlasdigitalai.com</span>
          </div>

          <div className="result-actions">
            <button className="scan-again-button" onClick={scanAgain}>
              Scan Again
            </button>

            <button className="close-button" onClick={stopAR}>
              Stop AR
            </button>
          </div>
        </div>
      )}

      {!showResult && (
        <div className="ar-ui">
          {status && <div className="ar-status">{status}</div>}

          {!started ? (
            <button className="ar-button" onClick={startAR}>
              Start AR
            </button>
          ) : (
            <button className="ar-button stop" onClick={stopAR}>
              Stop AR
            </button>
          )}
        </div>
      )}
    </div>
  );
}