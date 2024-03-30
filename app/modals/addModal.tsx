"use client";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import "../libs/firebase/config";
import { commonStyle } from "../constants/commonStyle";
import { modalStyle } from "../constants/modalStyle";
import { Profile } from "../types/profile";

const db = firebase.firestore();

export default function AddModal(props: any) {
  const title = "Add";
  const {handleAdd, ...others} = props;
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm({defaultValues: {name: "", age: ""}});

  const doSubmit = (async (_ob: Profile) => {
    const ob = {
      name: _ob.name,
      age: _ob.age,
    };

    const result = await db.collection("data").add(ob)
      .then(ref => {
        handleAdd();
      })
      .catch(error => {
        alert(error);
      });

    return result;
  });

  return (
    <div>
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
            <h3 className="text-dark" style={commonStyle.mb_0}>
              {title}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(doSubmit)}>
            <div className="container">
              <div className="bg-dark card p-3 text-center">
                <div className="form-group d-flex flex-column flex-md-row align-items-md-center" style={commonStyle.mb_16}>
                  <label style={modalStyle.label}>人名</label>
                  <input className="form-control" type="text" placeholder="Input Name" autoFocus required {...register("name", { required: true })} />
                </div>
                <div className="form-group d-flex flex-column flex-md-row align-items-md-center">
                  <label style={modalStyle.label}>年齢</label>
                  <input className="form-control" type="text" inputMode="numeric" pattern="^[0-9]+$" placeholder="0" required {...register("age", { required: true })} />
                </div>
              </div>
              <div className="d-flex justify-content-center" style={commonStyle.mt_16}>
                <button className="btn btn-primary" style={modalStyle.button_right}>
                  Add
                </button>
                <Button className="btn btn-light btn-outline-danger" onClick={props.onHide} style={modalStyle.button_left}>
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
