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
    color: "#99d",
    fontSize: "24pt",
    fontWeight: "bold",
    height: "38px",
    textAlign: "center",
  } as const;

  const h5 = {
    color: "#669",
    fontSize: "18pt",
    textAlign: "center",
  } as const;

  const button = {
    width: "280px",
  } as const;

  const footer = {
    position: "sticky",
    top: "100vh",
    width: "100%",
  } as const;

  const iconStyle: React.CSSProperties = { marginRight: 8, fontSize: 18 };

  const ignore = useRef(false);
  const [hasDocument, setHasDocument] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [headerTitle, setHeaderTitle] = useState("React");
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
          setTitle("Login page.");
          setMessage("Welcome to next.js!");
          if (currentUser) {
            setHeaderTitle("user: " + currentUser.displayName);
          }
        } catch (error) {
          console.log(error);
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
        <Header title={headerTitle} />
        {auth.currentUser !== null ?
          <div>
            <Top />
            <div style={footer}>
              <Footer />
            </div>
          </div>
          :
          <div className="container">
            <h3 className="my-3 text-primary text-center" style={h3}>{title}</h3>
            <div className="bg-dark card p-3 text-center">
              <h5 className="mb-4" style={h5}>{message}</h5>
              {isLoading ?
                <div>
                  <LocalImage url="Loading.jpg" alt="小林 由依" width={300} height={300} />
                </div>
                :
                <div>
                  <LocalImage url="Login.jpg" alt="藤吉 夏鈴" width={300} height={300} />
                  <button className="btn btn-danger" onClick={doLogin} style={button} disabled={auth.currentUser !== null ? true : false}>
                    <FontAwesomeIcon style={iconStyle} icon={faGoogle} />
                    Google アカウントでログイン
                  </button>
                </div>
              }
            </div>
            <div style={footer}>
              <Footer />
            </div>
          </div>
        }
      </div>
    </CookiesProvider>
  );
}
