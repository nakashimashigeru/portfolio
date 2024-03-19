"use client";
import { useState, useEffect } from "react";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "../firebase";
import Header from "../header";

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

  const h5 = {
    color: "#669",
    fontSize: "18pt",
    textAlign: "left",
  } as const;

  const div_mt16 = {
    marginTop: "16px",
  } as const;

  const button = {
    margin: "auto",
    width: "160px",
  } as const;

  const router = useRouter();
  const searchParams = useSearchParams();
  const documentID = searchParams.get("id");
  const title = "Delete page.";
  const [hasDocument, setHasDocument] = useState(false);
  const [data, setData] = useState({} as Profile);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Now Loading...");

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

  useEffect(() => {
    if (documentID !== null) {
      if (typeof document !== "undefined") {
        setHasDocument(true);
      }
      db.collection("data").doc(documentID).get().then(ob => {
        const profile = ob.data() as Profile;
        setData(profile);
        setIsLoading(false);
        setMessage("削除");
      });
    } else {
      setMessage(message + ".");
    }
  }, [message, documentID]);

  const doAction = (async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (documentID !== null) {
      await db.collection("data").doc(documentID).delete().then(ref => {
        router.push("/");
      });
    }
  });

  return (
    <div>
      {hasDocument && isLoading &&
        <CircleSpinnerOverlay overlayColor="rgba(0, 0, 0, 0.2)" />
      }
      <Header header="React" />
      <div className="container">
        <h3 className="my-3 text-primary text-center" style={subtitle}>{title}</h3>
        <div className="bg-dark card p-3 text-center">
          <h5 className="mb-4" style={h5}>{message}</h5>
          <pre className="card h5 m-3 p-3 text-left">
            Name: {data.name ? data.name : "..."}<br/>
            Mail: {data.mail ? data.mail : "..."}<br/>
            Age: {data.age ? data.age : "..."}
          </pre>
          <button className="btn btn-primary" onClick={doAction} style={button} disabled={isLoading}>
            Delete
          </button>
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