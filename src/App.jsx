import { useState } from "react";
import "./App.css";
import { _GSPS2PDF } from "./lib/worker-init.js";

function loadPDFData(response) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", response);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
      window.URL.revokeObjectURL(response);
      const blob = new Blob([xhr.response], { type: "application/pdf" });
      const pdfURL = window.URL.createObjectURL(blob);
      const size = xhr.response.byteLength;
      resolve({ pdfURL, size });
    };
    xhr.send();
  });
}

function App() {
  const [state, setState] = useState("init");
  const [file, setFile] = useState(undefined);
  const [downloadLink, setDownloadLink] = useState(undefined);

  async function compressPDF(pdf, filename) {
    const dataObject = { psDataURL: pdf };
    const element = await _GSPS2PDF(dataObject);
    const { pdfURL } = await loadPDFData(element, filename);

    setDownloadLink(pdfURL);
    setState("toBeDownloaded");
  }

  const changeHandler = (event) => {
    const selected = event.target.files[0];
    const url = window.URL.createObjectURL(selected);
    setFile({ filename: selected.name, url, size: selected.size });
    setState("selected");
  };

  const onSubmit = (event) => {
    event.preventDefault();

    // Limit of 50MB
    if (file.size > 50 * 1024 * 1024) {
      alert("This file is larger than 50 MB. Please choose a smaller PDF.");
      return;
    }

    compressPDF(file.url, file.filename);
    setState("loading");
    return false;
  };

  let minFileName =
    file && file.filename && file.filename.replace(".pdf", "-optimized.pdf");

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: "#f0f2f5",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          width: "95%",
          maxWidth: "450px",
          padding: "40px",
          borderRadius: "14px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        {/* LOGO GCS */}
        <div style={{ marginBottom: "20px" }}>
          <a
            href="https://www.globalcitizensolutions.com"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/globalcitizensolutions_logo.jpeg"
              alt="GCS Logo"
              style={{ width: "150px" }}
            />
          </a>
        </div>

        <h2 style={{ fontWeight: 600, marginBottom: "8px" }}>
          GCS PDF Compressor
        </h2>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "4px" }}>
          Upload a PDF and receive an optimized version automatically.
        </p>

        <div style={{ fontSize: "12px", color: "#3a7afe", margin: "12px 0" }}>
          ✔ Secure environment: files never leave your browser.
        </div>

        <div style={{ fontSize: "12px", color: "#777", marginBottom: "20px" }}>
          Maximum file size: 50 MB per upload.
        </div>

        {/* FORM */}
        {state !== "loading" && state !== "toBeDownloaded" && (
          <form onSubmit={onSubmit}>
            <input
              type="file"
              accept="application/pdf"
              onChange={changeHandler}
              style={{
                width: "100%",
                padding: "15px",
                background: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer",
                marginBottom: "16px",
              }}
            />

            {state === "selected" && (
              <button
                type="submit"
                style={{
                  background: "#3a7afe",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  width: "100%",
                  fontSize: "15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Compress PDF
              </button>
            )}
          </form>
        )}

        {state === "loading" && (
          <p style={{ marginTop: "10px", color: "#666" }}>
            Processing... please wait.
          </p>
        )}

        {state === "toBeDownloaded" && (
          <>
            <a
              href={downloadLink}
              download={minFileName}
              style={{
                display: "block",
                padding: "14px",
                background: "#3a7afe",
                color: "white",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none",
                marginBottom: "12px",
              }}
            >
              Download {minFileName}
            </a>

            <a
              href="./"
              style={{
                display: "block",
                padding: "12px",
                background: "#ddd",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#333",
                fontWeight: "500",
              }}
            >
              Compress another PDF
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default App;