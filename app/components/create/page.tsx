"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import "../firebase";
import Header from "../header";

type Profile = {
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

  const h5 = {
    color: "#669",
    fontSize: "18pt",
    textAlign: "left",
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
    width: "20%",
  } as const;

  const button = {
    width: "160px",
  } as const;

  const router = useRouter();
  const title = "Create page.";
  const message = "新規登録";

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
      db.collection("data").add(ob).then(ref => {
        router.push("/");
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
          <h5 className="mb-4" style={h5}>{message}</h5>
          <div className="text-left">
            <form onSubmit={handleSubmit(doSubmit)}>
              <div className="form-group d-flex align-items-center justify-content-between" style={div_mb16}>
                <label style={label}>名前</label>
                <input className="form-control" type="text" placeholder="Input Name" required {...register("name", { required: true })} />
              </div>
              <div className="form-group d-flex align-items-center justify-content-between" style={div_mb16}>
                <label style={label}>メール</label>
                <input className="form-control" type="email" placeholder="Input Mail" required {...register("mail", { required: true })} />
              </div>
              <div className="form-group d-flex align-items-center justify-content-between" style={div_mb16}>
                <label style={label}>年齢</label>
                <input className="form-control" type="number" required {...register("age", { required: true })} />
              </div>
              <button className="btn btn-primary" style={button}>
                Create
              </button>
            </form>
          </div>
          <div className="d-flex justify-content-between" style={div_mt16}>
            <Link href="/" legacyBehavior>
              <a>&lt;&lt; Back to Top page</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
