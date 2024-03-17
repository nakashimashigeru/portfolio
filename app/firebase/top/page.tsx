"use client";
import { useRef, useState, useEffect } from "react";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import Link from "next/link";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "../../components/firebase";

const db = firebase.firestore();

export default function Home() {
  const h3 = {
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

  const label = {
    color: "white",
    display: "block",
    width: "320px",
  } as const;

  const button = {
    width: "160px",
  } as const;

  const table = {
    display: "block",
    height: "calc(100vh / 2)",
    margin: "8px auto 16px",
    overflowY: "auto",
  } as const;

  const thead = {
    position: "sticky",
    top: 0,
    zIndex: 999,
  } as const;

  const th = {
    width: "50%",
  } as const;

  const th_ID = {
    width: "30%",
  } as const;

  const title = "Top page.";
  const initialData: any[] = [];
  const [hasDocument, setHasDocument] = useState(false);
  const [tableData, setTableData] = useState(initialData);
  const [selectData, setSelectData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Now Loading...");
  const [find, setFind] = useState("");
  const ignore = useRef(false);

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
    if (!ignore.current) {
      if (typeof document !== "undefined") {
        setHasDocument(true);
      }
      const _array: string[] = [];
      const _tableData: any[] = [];
      const _selectData: any[] = [<option key="">選択してください</option>];
      db.collection("mydata").get().then((snapshot) => {
        snapshot.forEach((document) => {
          const doc = document.data();
          _array.push(doc.name);
          _tableData.push(
            <tr key={document.id}>
              <td>
                <Link href={"/firebase/delete?id=" + document.id} legacyBehavior>
                  <a>{document.id}</a>
                </Link>
              </td>
              <td>{doc.name}</td>
              <td>{doc.mail}</td>
              <td>{doc.age}</td>
            </tr>
          );
        });
        const array = [...new Set(_array)];
        for (let i = 0; i < array.length; i++) {
          _selectData.push(
            <option key={i}>
              {array[i]}
            </option>
          );
        }
        setTableData(_tableData);
        setSelectData(_selectData);
        setIsLoading(false);
        const _displayName = localStorage.getItem("displayName");
        if (_displayName) {
          setMessage(_displayName);
        }
      });
    }
    return () => {
      ignore.current = true;
    };
  }, []);

  const doChangeFind = ((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFind(e.target.value);
  });

  const doAction = ((e: React.MouseEvent<HTMLButtonElement>) => {
    const _tableData: any[] = [];

    db.collection("mydata").where("name", "==", find)
      .get().then((snapshot) => {
        snapshot.forEach((document) => {
          const doc = document.data();
          _tableData.push(
            <tr key={document.id}>
              <td>
                <Link href={"/firebase/delete?id=" + document.id} legacyBehavior>
                  <a>{document.id}</a>
                </Link>
              </td>
              <td>{doc.name}</td>
              <td>{doc.mail}</td>
              <td>{doc.age}</td>
            </tr>
          );
        });
        setTableData(_tableData);
        setMessage("Name: " + find);
    });
  });

  return (
    <div>
      {hasDocument && isLoading &&
        <CircleSpinnerOverlay overlayColor="rgba(0, 0, 0, 0.2)" />
      }
      <div className="container">
        <h3 className="my-3 text-primary text-center" style={h3}>{title}</h3>
        <div className="bg-dark card p-3 text-center">
          <h5 className="mb-4" style={p}>{message}</h5>
          <div className="text-left">
            <div className="form-group d-flex align-items-center justify-content-between" style={div}>
              <label style={label}>Name</label>
              <select className="form-select bg-light" onChange={doChangeFind}>
                {selectData}
              </select>
              <button className="btn btn-primary" onClick={doAction} style={button}>
                Find
              </button>
            </div>
          </div>
          <div className="table-responsive-sm table-responsive-md">
            <table className="table table-dark table-hover table-striped" style={table}>
              <thead style={thead}>
                <tr>
                  <th style={th_ID}>ID</th>
                  <th style={th}>Name</th>
                  <th style={th}>Mail</th>
                  <th style={th}>Age</th>
                </tr>
              </thead>
              <tbody>
                {tableData}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end">
            <Link href="/firebase/create" legacyBehavior>
              <a>Go to Create page &gt;&gt;</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
