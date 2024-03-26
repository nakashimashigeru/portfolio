"use client";
import { useRef, useState, useEffect } from "react";
import { CookiesProvider } from "react-cookie";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signInWithRedirect } from 'firebase/auth';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { auth, provider } from "./components/firebase";
import Footer from "./components/footer";
import Header from "./components/header";
import LocalImage from "./components/image";
import Top from "./components/pages/top";

export default function Home() {
  const h3 = {
    color: "#669",
    fontSize: "26pt",
  } as const;

  const h5 = {
    fontSize: "18pt",
    textAlign: "center",
  } as const;

  const div = {
    height: "40px",
    marginBottom: "8px",
  } as const;

  const ignore = useRef(false);
  const [hasDocument, setHasDocument] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [headerTitle, setHeaderTitle] = useState("wait...");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("Now Loading...");

  useEffect(() => {
    if (!ignore.current) {
      if (typeof document !== "undefined") {
        setHasDocument(true);
      }
      const unsubscribed = auth.onAuthStateChanged((currentUser) => {
        try {
          setIsLoading(false);
          setHeaderTitle("RSTC");
          setTitle("Login page.");
          setMessage("Welcome to next.js!");
        } catch (error) {
          alert(error);
        }
      });
    }
    return () => {
      ignore.current = true;
    };
  }, []);

  const doLogin = (async (e: React.MouseEvent<HTMLButtonElement>) => {
    await signInWithRedirect(auth, provider).catch(error => {
      console.error(error);
    });
  });

  return (
    <CookiesProvider>
      <div>
        {hasDocument && isLoading &&
          <CircleSpinnerOverlay overlayColor="rgba(0, 0, 0, 0.2)" />
        }
        <Header title={headerTitle} isLoading={isLoading} />
        {auth.currentUser !== null ?
          <Top />
          :
          <div className="container">
            <div className="text-center" style={div}>
              <h3 style={h3}>{title}</h3>
            </div>
            <div className="bg-dark card p-3 text-center">
              <h5 className="mb-3 text-white" style={h5}>{message}</h5>
              {isLoading ?
                <div>
                  <LocalImage url="loading.jpg" alt="小林 由依" width={300} height={300} />
                </div>
                :
                <div>
                  <LocalImage url="login.jpg" alt="藤吉 夏鈴" width={300} height={300} />
                  <button className="btn btn-danger" onClick={doLogin} disabled={auth.currentUser !== null ? true : false}>
                    <FontAwesomeIcon icon={faGoogle} />
                    oogle アカウントでログイン
                  </button>
                </div>
              }
            </div>
            <Footer isLoading={isLoading} />
          </div>
        }
      </div>
    </CookiesProvider>
  );
}
