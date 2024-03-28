"use client";
import { Limelight } from "next/font/google";
import { useState, useEffect } from "react";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { Button, Modal } from 'react-bootstrap';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "../firebase";

const limelight = Limelight({ weight: "400", subsets: ["latin"] });

type Profile = {
  name: string;
  age: number;
};

const db = firebase.firestore();

export default function DeleteModal(props: any) {
  const h3 = {
    margin: "0px",
  } as const;

  const header = {
    padding: "8px 16px",
  } as const;

  const div_mt16 = {
    marginTop: "16px",
  } as const;

  const p_mb0 = {
    marginBottom: "0px",
  } as const;

  const button_left = {
    marginLeft: "8px",
    width: "160px",
  } as const;

  const button_right = {
    marginRight: "8px",
    width: "160px",
  } as const;

  const title = "Delete";
  const [hasDocument, setHasDocument] = useState(false);
  const [data, setData] = useState({} as Profile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.show) {
      if (typeof document !== "undefined") {
        setHasDocument(true);
      }
      fetchProfile(props.id);
    }
  }, [props.id, props.show]);

  const fetchProfile = async (id: string) => {
    setIsLoading(true);
    const result = await db.collection("data").doc(id).get()
      .then(ob => {
        const profile = ob.data() as Profile;
        setData(profile);
      })
      .catch(error => {
        alert(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return result;
  };

  const doDelete = (async (e: React.MouseEvent<HTMLButtonElement>) => {
    const result = await db.collection("data").doc(props.id).delete()
      .then(ref => {
        location.reload();
      })
      .catch(error => {
        alert(error);
      });

    return result;
  });

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
        scrollable
        size="lg"
      >
        <Modal.Header closeButton style={header}>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3 className="text-danger" style={h3}>
              {title}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="bg-dark card text-center text-light">
              <pre className="bg-dark h5 m-2 p-2">
                <p>
                  人名: <span className={limelight.className}>{data ? data.name : "..."}</span>
                </p>
                <p style={p_mb0}>
                  年齢: <span className={limelight.className}>{data ? data.age : "..."}</span>
                </p>
              </pre>
            </div>
            <div className="d-flex justify-content-center" style={div_mt16}>
              <button className="btn btn-danger" onClick={doDelete} style={button_right} disabled={isLoading}>
                Delete
              </button>
              <Button className="btn btn-light btn-outline-danger" onClick={props.onHide} style={button_left} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
