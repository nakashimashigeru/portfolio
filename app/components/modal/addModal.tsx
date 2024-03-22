"use client";
import { Button, Modal } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import "../firebase";

type Profile = {
  name: string;
  mail: string;
  age: number;
};

const db = firebase.firestore();

export default function AddModal(props: any) {
  const header = {
    padding: "0px 16px",
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

  const title = "Add page.";

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm({defaultValues: {name: "", mail: "", age: 0}});

  const doSubmit = ((_ob: Profile) => {
    try {
      const ob = {
        name: _ob.name,
        mail: _ob.mail,
        age: _ob.age,
      };
      db.collection("data").add(ob).then(ref => {
        location.reload();
      });
    } catch (error) {
      console.log(error);
    }
  });

  return (
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
          <h3 className="my-2 text-primary text-center">
            {title}
          </h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="bg-dark card p-3 text-center">
            <div className="text-left">
              <form onSubmit={handleSubmit(doSubmit)}>
                <div className="form-group d-flex flex-column flex-md-row align-items-md-center" style={div_mb16}>
                  <label style={label}>名前</label>
                  <input className="form-control" type="text" placeholder="Input Name" required {...register("name", { required: true })} />
                </div>
                <div className="form-group d-flex flex-column flex-md-row align-items-md-center" style={div_mb16}>
                  <label style={label}>メール</label>
                  <input className="form-control" type="email" placeholder="Input Mail" required {...register("mail", { required: true })} />
                </div>
                <div className="form-group d-flex flex-column flex-md-row align-items-md-center" style={div_mb16}>
                  <label style={label}>年齢</label>
                  <input className="form-control" type="number" required {...register("age", { required: true })} />
                </div>
                <div className="d-flex justify-content-center" style={div_mt16}>
                  <button className="btn btn-success" style={button_right}>
                    Add
                  </button>
                  <Button className="btn btn-danger" onClick={props.onHide} style={button_left}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
