"use client";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWikipediaW } from "@fortawesome/free-brands-svg-icons";
import { mediaWiki } from "../constants/mediaWiki";

export default function WikipediaModal(props: any) {
  const h3 = {
    margin: "0px",
  } as const;

  const header = {
    padding: "8px 16px",
  } as const;

  const title = "ikipedia";
  const initialData: any[] = [];
  const [hasDocument, setHasDocument] = useState(false);
  const [extract, setExtract] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.name !== "") {
      if (typeof document !== "undefined") {
        setHasDocument(true);
      }
      mediaWikiFetch(props.name);
    }
  }, [props.name]);

  const mediaWikiFetch = async (inputValue: string) => {
    setIsLoading(true);
    if (inputValue.match(/[\u4E00-\u9FFF]/)) {
      inputValue = inputValue.replace(/\s+/g, "");
    }
    const url = mediaWiki.url + inputValue;
    const encodedURL = encodeURI(url);
    try {
      const response = await fetch(encodedURL, { method: "GET" });
      const json = await response.json();
      for (const id in json.query.pages) {
        setExtract(json.query.pages[id].extract);
      }
    } catch (error) {
      alert("Could Not Access Wikipedia.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {hasDocument && isLoading &&
        <CircleSpinnerOverlay overlayColor="rgba(0,0,0,0.2)" />
      }
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        keyboard={false}
        scrollable
        size="lg"
      >
        <Modal.Header closeButton style={header}>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3 className="text-primary" style={h3}>
              <FontAwesomeIcon icon={faWikipediaW} />
              {title}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            {extract ?
              <div dangerouslySetInnerHTML={{ __html: extract }} />
              :
              <div>Does not exist in Wikipedia.</div>
            }
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
