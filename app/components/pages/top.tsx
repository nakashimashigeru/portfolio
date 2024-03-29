"use client";
import { useRef, useState, useEffect } from "react";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "../firebase";
import AddModal from "../modals/addModal";
import DeleteModal from "../modals/deleteModal";
import EditModal from "../modals/editModal";
import WikipediaModal from "../modals/wikipediaModal";

const db = firebase.firestore();

export default function Top() {
  const h3 = {
    color: "#669",
    fontSize: "26pt",
  } as const;

  const div_title = {
    height: "40px",
    marginBottom: "8px",
  } as const;

  const div_mb16 = {
    marginBottom: "16px",
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
    textAlign: "center",
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

  const td = {
    padding: 0,
  } as const;

  const title = "Top page.";
  const initialData: any[] = [];
  const ignore = useRef(false);
  const faPenToSquareStyle: React.CSSProperties = { color: "#6c757d", cursor: "pointer", fontSize: 22, width: 65 };
  const faTrashCanStyle: React.CSSProperties = { color: "#dc3545", cursor: "pointer", fontSize: 22, width: 65 };
  const faUserPlusStyle: React.CSSProperties = { color: "#212529", cursor: "pointer", fontSize: 24 };
  const [hasDocument, setHasDocument] = useState(false);
  const [tableData, setTableData] = useState(initialData);
  const [selectData, setSelectData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [find, setFind] = useState("");
  const [documentID, setDocumentID] = useState("");
  const [name, setName] = useState("");
  const [addModalShow, setAddModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [wikipediaModalShow, setWikipediaModalShow] = useState(false);

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
          const data = document.data();
          const tableData = generateTableData(document.id, data);
          _tableData.push(tableData);
          _array.push(data.name);
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
    db.collection("data").where("name", "==", find)
      .get().then((snapshot) => {
        snapshot.forEach((document) => {
          const data = document.data();
          const tableData = generateTableData(document.id, data);
          _tableData.push(tableData);
        });
        setTableData(_tableData);
        setIsLoading(false);
    });
  });

  const changeFind = ((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFind(e.target.value);
  });

  const generateTableData = ((documentID: string, data: firebase.firestore.DocumentData) => {
    return (
      <tr key={documentID}>
        <td style={td}>
          <button type="button" className="btn btn-link link-success" onClick={() => {setName(data.name); setWikipediaModalShow(true);}}>
            {data.name}
          </button>
        </td>
        <td>{data.age}</td>
        <td>
          <FontAwesomeIcon style={faPenToSquareStyle} icon={faPenToSquare} onClick={() => {setDocumentID(documentID); setEditModalShow(true);}} />
          <FontAwesomeIcon style={faTrashCanStyle} icon={faTrashCan} onClick={() => {setDocumentID(documentID); setDeleteModalShow(true);}} />
        </td>
      </tr>
    );
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
      {documentID !== "" &&
        <EditModal id={documentID} show={editModalShow} onHide={() => setEditModalShow(false)} />
      }
      <WikipediaModal name={name} show={wikipediaModalShow} onHide={() => setWikipediaModalShow(false)} />
      <div className="container">
        <div className="d-flex align-items-center justify-content-between" style={div_title}>
          <h3 style={h3}>{title}</h3>
          <FontAwesomeIcon style={faUserPlusStyle} icon={faUserPlus} onClick={() => setAddModalShow(true)} />
        </div>
        <div>
          <div className="text-left">
            <div className="form-group d-flex align-items-center justify-content-between" style={div_mb16}>
              <select className="form-select bg-light" onChange={changeFind}>
                {selectData}
              </select>
              <button className="btn btn-primary" onClick={doAction} style={button_left}>
                Find
              </button>
            </div>
          </div>
          <div className="table-responsive-sm table-responsive-md">
            <table className="table table-hover table-striped" style={table}>
              <thead style={thead}>
                <tr>
                  <th className="bg-dark text-light" style={th}>人名</th>
                  <th className="bg-dark text-light">年齢</th>
                  <th className="bg-dark text-light"></th>
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
