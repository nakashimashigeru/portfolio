"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/header";
import useSWR from "swr";

interface Profile {
  name: string;
  mail: string;
  age: string;
}

const fetcher = (url: string): Promise<any> => fetch(url).then(res => res.json());

export default function Home() {
  const subtitle = {
    color: "#99d",
    fontSize: "24pt",
    fontWeight: "bold",
    margin: "0px 5px",
    textAlign: "center",
  } as const;

  const p = {
    color: "#669",
    fontSize: "18pt",
    margin: "0px 5px",
    textAlign: "left",
  } as const;

  const table = {
    margin: "8px auto 0px",
    textAlign: "center",
  } as const;

  const title = "Other page.";
  const message = "This is Other page...";

  const url = "./data.json";
  const [jsonData, setData] = useState({
    message: "",
    data: [
      {
        name: "",
        mail: "",
        age: ""
      }
    ]
  });

  const { data, error, isLoading } = useSWR("/data.json", fetcher);
  // const [rootURL, setRootURL] = useState("/api/develop");
  // const { data, error, isLoading } = useSWR(rootURL, fetcher);

  const doChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setRootURL("/api/develop?id=" + e.target.value);
  }

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(res => setData(res));
  }, []);

  return (
    <div>
      <Header header="React" />
      <div className="container">
        <h3 className="my-3 text-primary text-center" style={subtitle}>{title}</h3>
        <div className="bg-dark card p-3 text-center">
          {/* <p className="h5" style={p}>{jsonData.message}</p> */}
          {/* <table className="table bg-white" style={table}>
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Mail</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody className="table-dark">
              {jsonData.data.map((value, key) => {
                return (
                  <tr key={key}>
                    <td>{value.name}</td>
                    <td>{value.mail}</td>
                    <td>{value.age}</td>
                  </tr>
                );
              })}
            </tbody>
          </table> */}
          <p className="h5" style={p}>
            {data !== undefined ? data.message : "error..."}
          </p>
          <table className="table bg-white" style={table}>
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Mail</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody className="table-dark">
              {data !== undefined ? data.data.map(
                (value: Profile, key: string) => {
                  return (
                    <tr key={key}>
                      <td>{value.name}</td>
                      <td>{value.mail}</td>
                      <td>{value.age}</td>
                    </tr>
                  );
                })
              :
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              }
            </tbody>
          </table>
          {/* <div className="alert alert-primary text-center">
            <h5 className="mb-4">{JSON.stringify(data)}</h5>
            <input type="number" className="form-control" onChange={doChange} />
          </div> */}
          <Link href="/" legacyBehavior>
            <a>&lt;&lt; Back to Top</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
