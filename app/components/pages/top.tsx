"use client";
import { useRef, useState, useEffect } from "react";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "../firebase";
import AddModal from "../modal/addModal";
import DeleteModal from "../modal/deleteModal";

const db = firebase.firestore();

export default function Top() {
  const div_mb8 = {
    marginBottom: "8px",
  } as const;

  const div_mb16 = {
    marginBottom: "16px",
  } as const;

  const button = {
    width: "90px",
  } as const;

  const button_left = {
    marginLeft: "8px",
    width: "160px",
  } as const;

  const table = {
    display: "block",
    height: "calc(100vh - 235px)",
    margin: "8px auto 16px",
    overflowY: "auto",
    whiteSpace: "nowrap",
  } as const;

  const thead = {
    position: "sticky",
    top: 0,
    zIndex: 999,
  } as const;

  const th = {
    width: "100%",
  } as const;

  const title = "Top page.";
  const initialData: any[] = [];
  const ignore = useRef(false);
  const iconStyle: React.CSSProperties = { color: "#212529", cursor: "pointer", fontSize: 24 };
  const [hasDocument, setHasDocument] = useState(false);
  const [tableData, setTableData] = useState(initialData);
  const [selectData, setSelectData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [documentID, setDocumentID] = useState("");
  const [addModalShow, setAddModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  useEffect(() => {
    if (!ignore.current) {
      if (typeof document !== "undefined") {
        setHasDocument(true);
      }
      const _array: string[] = [];
      const _tableData: any[] = [];
      const _selectData: any[] = [<option key="">選択してください</option>];
      const iconStyle: React.CSSProperties = { color: "#dc3545", cursor: "pointer", fontSize: 22, width: 90 };
      db.collection("data").get().then((snapshot) => {
        snapshot.forEach((document) => {
          const doc = document.data();
          _array.push(doc.name);
          _tableData.push(
            <tr key={document.id}>
              <td>{doc.name}</td>
              <td>{doc.age}</td>
              <td>
                <FontAwesomeIcon style={iconStyle} icon={faTrashCan} onClick={() => {setDocumentID(document.id); setDeleteModalShow(true);}} />
              </td>
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

  const doAction = ((e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    const _tableData: any[] = [];
    const iconStyle: React.CSSProperties = { color: "#dc3545", cursor: "pointer", fontSize: 22, width: 90 };
    db.collection("data").where("name", "==", search)
      .get().then((snapshot) => {
        snapshot.forEach((document) => {
          const doc = document.data();
          _tableData.push(
            <tr key={document.id}>
              <td>{doc.name}</td>
              <td>{doc.age}</td>
              <td>
                <FontAwesomeIcon style={iconStyle} icon={faTrashCan} onClick={() => {setDocumentID(document.id); setDeleteModalShow(true);}} />
              </td>
            </tr>
          );
        });
        setTableData(_tableData);
        setIsLoading(false);
    });
  });

  const doSearch = ((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearch(e.target.value);
  });

  return (
    <div>
      {hasDocument && isLoading &&
        <CircleSpinnerOverlay overlayColor="rgba(0, 0, 0, 0.2)" />
      }
      <AddModal show={addModalShow} onHide={() => setAddModalShow(false)} />
      {documentID !== "" &&
        <DeleteModal id={documentID} show={deleteModalShow} onHide={() => setDeleteModalShow(false)} />
      }
      <div className="container">
        <div className="d-flex align-items-center justify-content-between" style={div_mb8}>
          <h3 className="text-primary text-center">{title}</h3>
          <FontAwesomeIcon style={iconStyle} icon={faUserPlus} onClick={() => setAddModalShow(true)} />
        </div>
        <div>
          <div className="text-left">
            <div className="form-group d-flex align-items-center justify-content-between" style={div_mb16}>
              <select className="form-select bg-light" onChange={doSearch}>
                {selectData}
              </select>
              <button className="btn btn-primary" onClick={doAction} style={button_left}>
                検索
              </button>
            </div>
          </div>
          <div className="table-responsive-sm table-responsive-md">
            <table className="table table-hover table-striped text-center" style={table}>
              <thead style={thead}>
                <tr>
                  <th className="bg-dark text-white" style={th}>人名</th>
                  <th className="bg-dark text-white">年齢</th>
                  <th className="bg-dark text-white"></th>
                </tr>
              </thead>
              <tbody>
                {tableData}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
