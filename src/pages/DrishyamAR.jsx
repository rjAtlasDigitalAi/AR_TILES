import { useEffect, useRef, useState } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { FaGlobe, FaArrowRight } from "react-icons/fa";

export default function DrishyamAR() {
  const containerRef = useRef(null);
  const mindarRef = useRef(null);
  const scanCompletedRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState("");
  const [showResult, setShowResult] = useState(false);

  const WEBSITE_URL = "https://www.rjatlasdigitalai.com/";
  const WORKWEB="https://works-rj.vercel.app/"

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
    <div className={`ar-page ${showResult ? "result-active" : ""}`}>
  <div ref={containerRef} className="ar-container" />

  {showResult && (
    <div className="screen-result">
      <div className="result-content">
        <div className="hero-card">
          <h1>RJ ATLAS DIGITAL AI</h1>

          <p className="subtitle">Digital Marketing Agency</p>

          <button
            className="visit-button"
            onClick={() => {
              window.location.href = WEBSITE_URL;
            }}
          >
            <FaGlobe />
            <span>WEBSITE</span>
          </button>
        </div>

        <div className="services-list">
          <div className="service-item">
            <img src="/dm2.png" alt="Digital Marketing" />
            <div>
              <h3>Digital Marketing</h3>
              <p>Social media ads, branding & growth</p>
            </div>
          </div>

          <div className="service-item">
            <img src="/wd.png" alt="Website Development" />
            <div>
              <h3>Website Development</h3>
              <p>Modern websites for businesses</p>
            </div>
          </div>

          <div className="service-item">
            <img src="/av.png" alt="AI Video Production" />
            <div>
              <h3>AI Video Production</h3>
              <p>Cinematic AI videos, reels & brand films</p>
            </div>
          </div>
        </div>

        <div className="mini-features">
          <span>Automation Software</span>
          <span>Basic SEO</span>
          <span>Google Business</span>
        </div>

        <div className="works-button-wrap">
          <button
            className="works-button"
            onClick={() => {
              window.location.href = WORKWEB;
            }}
          >
            <span>VIEW OUR WORKS</span>
            <FaArrowRight />
          </button>
        </div>

        <div className="contact-card">
         
          <h2>+91 99955 28426</h2>
          <span>Thalassery, Kerala</span>
        </div>
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