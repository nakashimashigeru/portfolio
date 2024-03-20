"use client";
import React, { useRef, useState, useEffect } from "react";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import Link from "next/link";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "../firebase";
import AddModal from "../modal/addModal";

const db = firebase.firestore();

export default function Top() {
  const h3 = {
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

  const div_mb8 = {
    marginBottom: "8px",
  } as const;

  const div_mb16 = {
    marginBottom: "16px",
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
    width: "20%",
  } as const;

  const ignore = useRef(false);
  const title = "Top page.";
  const initialData: any[] = [];
  const [hasDocument, setHasDocument] = useState(false);
  const [tableData, setTableData] = useState(initialData);
  const [selectData, setSelectData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    if (!ignore.current) {
      if (typeof document !== "undefined") {
        setHasDocument(true);
      }
      const _array: string[] = [];
      const _tableData: any[] = [];
      const _selectData: any[] = [<option key="">選択してください</option>];
      db.collection("data").get().then((snapshot) => {
        snapshot.forEach((document) => {
          const doc = document.data();
          _array.push(doc.name);
          _tableData.push(
            <tr key={document.id}>
              <td>
                <Link href={"/components/delete?id=" + document.id} legacyBehavior>
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
      });
    }
    return () => {
      ignore.current = true;
    };
  }, []);

  const doChangeSearch = ((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearch(e.target.value);
  });

  const doAction = ((e: React.MouseEvent<HTMLButtonElement>) => {
    const _tableData: any[] = [];

    db.collection("data").where("name", "==", search)
      .get().then((snapshot) => {
        snapshot.forEach((document) => {
          const doc = document.data();
          _tableData.push(
            <tr key={document.id}>
              <td>
                <Link href={"/components/delete?id=" + document.id} legacyBehavior>
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
    });
  });

  return (
    <div>
      {hasDocument && isLoading &&
        <CircleSpinnerOverlay overlayColor="rgba(0, 0, 0, 0.2)" />
      }
      <div className="container">
        <div className="d-flex align-items-center justify-content-between" style={div_mb8}>
          <h3 className="text-primary text-center" style={h3}>{title}</h3>
          <button className="btn btn-danger" onClick={() => setModalShow(true)}>
            新規追加
          </button>
        </div>
        <div className="bg-dark card p-3 text-center">
          <div className="text-left">
            <div className="form-group d-flex align-items-center justify-content-between" style={div_mb16}>
              <select className="form-select bg-light" onChange={doChangeSearch}>
                {selectData}
              </select>
              <button className="btn btn-primary" onClick={doAction} style={button}>
                検索
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
        </div>
      </div>
      <AddModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
}
