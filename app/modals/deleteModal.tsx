"use client";
import { Limelight } from "next/font/google";
import { useState, useEffect } from "react";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { Button, Modal } from "react-bootstrap";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "../libs/firebase/config";
import { commonStyle } from "../constants/commonStyle";
import { modalStyle } from "../constants/modalStyle";
import { Profile } from "../types/profile";

const db = firebase.firestore();
const limelight = Limelight({ weight: "400", subsets: ["latin"] });

export default function DeleteModal(props: any) {
  const title = "Delete";
  const {handleDelete, ...others} = props;
  const [hasDocument, setHasDocument] = useState(false);
  const [data, setData] = useState({} as Profile);
  const [isLoading, setIsLoading] = useState(true);
  type Response = "success" | "failure";

  useEffect(() => {
    if (props.show) {
      if (typeof document !== "undefined") {
        setHasDocument(true);
      }
      profileFetch(props.id);
    }
  }, [props.id, props.show]);

  const profileFetch = async (id: string) => {
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
    let res: Response = "success";
    await db.collection("data").doc(props.id).delete()
      .then(() => {
        handleDelete(res);
      })
      .catch(() => {
        res = "failure";
        handleDelete(res);
      });
  });

  return (
    <div>
      {hasDocument && isLoading &&
        <CircleSpinnerOverlay overlayColor="rgba(0,0,0,0.2)" />
      }
      <Modal
        {...others}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        keyboard={false}
        scrollable
        size="lg"
      >
        <Modal.Header closeButton style={modalStyle.header}>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3 className="text-danger" style={commonStyle.mb_0}>
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
                <p style={commonStyle.mb_0}>
                  年齢: <span className={limelight.className}>{data ? data.age : "..."}</span>
                </p>
              </pre>
            </div>
            <div className="d-flex justify-content-center" style={commonStyle.mt_16}>
              <button className="btn btn-danger" onClick={doDelete} style={modalStyle.button_right} disabled={isLoading}>
                Delete
              </button>
              <Button className="btn btn-light btn-outline-danger" onClick={props.onHide} style={modalStyle.button_left} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
