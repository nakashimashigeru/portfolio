"use client";
import { useState, useEffect } from "react";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { Button, Modal } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import "../../lib/firebase/config";

type Profile = {
  name: string;
  age: string;
};

const db = firebase.firestore();

export default function EditModal(props: any) {
  const h3 = {
    margin: "0px",
  } as const;

  const header = {
    padding: "8px 16px",
  } as const;

  const div_mt16 = {
    marginTop: "16px",
  } as const;

  const div_mb16 = {
    marginBottom: "16px",
  } as const;

  const label = {
    color: "white",
    display: "block",
    textAlign: "left",
    width: "20%",
  } as const;

  const button_left = {
    marginLeft: "8px",
    width: "160px",
  } as const;

  const button_right = {
    marginRight: "8px",
    width: "160px",
  } as const;

  const title = "Edit";
  const [hasDocument, setHasDocument] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm({defaultValues: {name: "", age: ""}});

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
        setName(profile.name);
        setAge(profile.age);
        setIsLoading(false);
      })
      .catch(error => {
        alert(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return result;
  };

  const doSubmit = (async () => {
    const ob = {
      name: name,
      age: age,
    };

    const result = await db.collection("data").doc(props.id).update(ob)
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
            <h3 className="text-success" style={h3}>
              {title}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(doSubmit)}>
            <div className="container">
              <div className="bg-dark card p-3 text-center">
                <div className="form-group d-flex flex-column flex-md-row align-items-md-center" style={div_mb16}>
                  <label style={label}>人名</label>
                  <input className="form-control" type="text" placeholder="Input Name" autoFocus required value={name} {...register("name", { required: true })} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group d-flex flex-column flex-md-row align-items-md-center">
                  <label style={label}>年齢</label>
                  <input className="form-control" type="text" inputMode="numeric" pattern="^[0-9]+$" placeholder="0" required value={age} {...register("age", { required: true })} onChange={e => setAge(e.target.value)} />
                </div>
              </div>
              <div className="d-flex justify-content-center" style={div_mt16}>
                <button className="btn btn-success" style={button_right}>
                  Edit
                </button>
                <Button className="btn btn-light btn-outline-danger" onClick={props.onHide} style={button_left}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
