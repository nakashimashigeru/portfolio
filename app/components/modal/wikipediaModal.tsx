"use client";
import { useState, useEffect } from "react";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { Modal } from 'react-bootstrap';

export default function WikipediaModal(props: any) {
  const h3 = {
    margin: "0px",
  } as const;

  const header = {
    padding: "8px 16px",
  } as const;

  const title = "Wikipedia page.";
  const initialData: any[] = [];
  const [hasDocument, setHasDocument] = useState(false);
  const [extract, setExtract] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.name !== "") {
      setIsLoading(true);
      if (typeof document !== "undefined") {
        setHasDocument(true);
      }
      wikiFetch(props.name);
    }
  }, [props.name]);

  const wikiFetch = async (inputValue: string) => {
    if (inputValue.match(/[\u4E00-\u9FFF]/)) {
      inputValue = inputValue.replace(/\s+/g, "");
    }
    const uri = `https://ja.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles=${inputValue}`;
    const encoded = encodeURI(uri);
    const fetchValue = fetch(encoded, {
      method: "GET"
    })
      .then((value) => {
        return value.json();
      })
      .catch(() => {
        alert("Could Not Access Wikipedia.");
      });

    const valueJson = await fetchValue;
    for (const id in valueJson.query.pages) {
      setExtract(valueJson.query.pages[id].extract);
    }
    setIsLoading(false);
  };

  return (
    <div>
      {hasDocument && isLoading &&
        <CircleSpinnerOverlay overlayColor="rgba(0, 0, 0, 0.2)" />
      }
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton style={header}>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3 className="text-success" style={h3}>
              {title}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div dangerouslySetInnerHTML={{ __html: extract }} />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
