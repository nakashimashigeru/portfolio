"use client";
import { useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { db } from "../libs/firebase/config";
import AddModal from "../modals/addModal";
import DeleteModal from "../modals/deleteModal";
import EditModal from "../modals/editModal";
import WikipediaModal from "../modals/wikipediaModal";
import { commonStyle } from "../constants/commonStyle";
import { faPenToSquareStyle, faTrashCanStyle, faUserPlusStyle } from "../constants/iconStyle";

type Response = "success" | "failure";

export default function Top() {
  const h3 = {
    color: "#669",
    fontSize: "26pt",
    marginBottom: "0px",
  } as const;

  const div_title = {
    height: "40px",
    marginBottom: "8px",
  } as const;

  const button_left = {
    marginLeft: "8px",
    width: "160px",
  } as const;

  const table = {
    display: "block",
    height: "calc(100vh - 215px)",
    marginBottom: "0px",
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

  const title = "Top";
  const initialData: any[] = [];
  const ignore = useRef(false);
  const [hasDocument, setHasDocument] = useState(false);
  const [tableData, setTableData] = useState(initialData);
  const [selectData, setSelectData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [find, setFind] = useState("");
  const [currentSelected, setCurrentSelected] = useState("");
  const [documentID, setDocumentID] = useState("");
  const [name, setName] = useState("");
  const [addModalShow, setAddModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [wikipediaModalShow, setWikipediaModalShow] = useState(false);

  useEffect(() => {
    if (!ignore.current) {
      initialize();
    }
    return () => {
      ignore.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setCurrentSelected(e.target.value);
  });

  const handleAdd = (res: Response, name: string) => {
    setAddModalShow(false);
    initialize();
    setCurrentSelected("");
    generateToast(res, `${name}を追加しました`, `${name}の追加に失敗しました`);
  };

  const handleDelete = (res: Response, name: string) => {
    setDeleteModalShow(false);
    initialize();
    setCurrentSelected("");
    generateToast(res, `${name}を削除しました`, `${name}の削除に失敗しました`);
  };

  const handleEdit = (res: Response, name: string) => {
    setEditModalShow(false);
    initialize();
    setCurrentSelected("");
    generateToast(res, `${name}を編集しました`, `${name}の編集に失敗しました`);
  };

  const initialize = () => {
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
          <option key={array[i]}>
            {array[i]}
          </option>
        );
      }
      setTableData(_tableData);
      setSelectData(_selectData);
      setIsLoading(false);
    });
  };

  const generateTableData = ((documentID: string, data: firebase.firestore.DocumentData) => {
    return (
      <tr key={documentID}>
        <td style={td}>
          <button type="button" className="btn btn-link" onClick={() => {setName(data.name); setWikipediaModalShow(true);}}>
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

  const generateToast = (res: Response, successMessage: string, failureMessage: string) => {
    if (res === "success") {
      toast.success(successMessage,
        {
          duration: 4000,
          style: {
            background: "rgb(33,37,41,0.8)",
            color: "#f8f9fa",
          },
        }
      );
    } else {
      toast.error(failureMessage,
        {
          duration: 4000,
          style: {
            background: "rgb(33,37,41,0.8)",
            color: "#f8f9fa",
          },
        }
      );
    }
  };

  return (
    <div>
      {hasDocument && isLoading &&
        <CircleSpinnerOverlay overlayColor="rgba(0,0,0,0.2)" />
      }
      <AddModal show={addModalShow} onHide={() => setAddModalShow(false)} handleAdd={handleAdd} />
      {documentID !== "" &&
        <DeleteModal id={documentID} show={deleteModalShow} onHide={() => setDeleteModalShow(false)} handleDelete={handleDelete} />
      }
      {documentID !== "" &&
        <EditModal id={documentID} show={editModalShow} onHide={() => setEditModalShow(false)} handleEdit={handleEdit} />
      }
      <WikipediaModal name={name} show={wikipediaModalShow} onHide={() => setWikipediaModalShow(false)} />
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="container">
        <div className="d-flex align-items-center justify-content-between" style={div_title}>
          <h3 style={h3}>{title}</h3>
          <FontAwesomeIcon style={faUserPlusStyle} icon={faUserPlus} onClick={() => setAddModalShow(true)} />
        </div>
        <div>
          <div className="text-left">
            <div className="form-group d-flex align-items-center justify-content-between" style={commonStyle.mb_16}>
              <select className="form-select bg-light" onChange={changeFind} value={currentSelected}>
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
