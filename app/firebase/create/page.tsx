"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import "../../components/firebase";
import Header from "../../components/header";

interface Profile {
  name: string;
  mail: string;
  age: number;
}

const db = firebase.firestore();

export default function Home() {
  const subtitle = {
    color: "#99d",
    fontSize: "24pt",
    fontWeight: "bold",
    margin: "0px 5px",
    textAlign: "center",
  } as const;

  const div = {
    marginBottom: "16px",
  } as const;

  const p = {
    color: "#669",
    fontSize: "18pt",
    margin: "0px 5px",
    textAlign: "left",
  } as const;

  const span = {
    display: "inline-block",
    width: "180px",
  } as const;

  const label = {
    color: "white",
    display: "block",
    width: "320px",
  } as const;

  const button = {
    width: "160px",
  } as const;

  const router = useRouter();
  const title = "Create page.";
  const [message, setMessage] = useState("Create data");

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm({defaultValues: {name: "", mail: "", age: 0}});

  const onUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
  }

  useEffect(() => {
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
    }
  });

  const doSubmit = ((_ob: Profile) => {
    try {
      const ob = {
        name: _ob.name,
        mail: _ob.mail,
        age: _ob.age,
      };
      db.collection("mydata").add(ob).then(ref => {
        router.push("/firebase/top");
      });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div>
      <Header header="React" />
      <div className="container">
        <h3 className="my-3 text-primary text-center" style={subtitle}>{title}</h3>
        <div className="bg-dark card p-3 text-center">
          <h5 className="mb-4" style={p}>{message}</h5>
          <div className="text-left">
            <form onSubmit={handleSubmit(doSubmit)}>
              <div className="form-group d-flex align-items-center justify-content-between" style={div}>
                <label style={label}>Name</label>
                <input className="form-control" type="text" placeholder="Input Name" required {...register("name", { required: true })} />
              </div>
              <div className="form-group d-flex align-items-center justify-content-between" style={div}>
                <label style={label}>Mail</label>
                <input className="form-control" type="email" placeholder="Input Mail" required {...register("mail", { required: true })} />
              </div>
              <div className="form-group d-flex align-items-center justify-content-between" style={div}>
                <label style={label}>Age</label>
                <input className="form-control" type="number" required {...register("age", { required: true })} />
              </div>
              <button className="btn btn-primary" style={button}>
                Create
              </button>
            </form>
          </div>
          <div className="d-flex justify-content-between">
            <Link href="/" legacyBehavior>
              <a>&lt;&lt; Back to Top page</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
