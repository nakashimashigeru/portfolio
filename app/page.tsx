"use client";
import { useRef, useState, useEffect } from "react";
import { CookiesProvider } from "react-cookie";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { signInWithRedirect } from 'firebase/auth';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { auth, provider } from "./libs/firebase/config";
import Footer from "./components/footer";
import Header from "./components/header";
import LocalImage from "./components/image";
import Top from "./components/top";

export default function Home() {
  const h3 = {
    color: "#669",
    fontSize: "26pt",
  } as const;

  const h5 = {
    fontSize: "18pt",
  } as const;

  const div_title = {
    height: "40px",
    marginBottom: "8px",
    textAlign: "center",
  } as const;

  const div_contents = {
    padding: "16px 0px",
    textAlign: "center",
  } as const;

  const div_mt16 = {
    marginTop: "16px",
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
          setTitle("Login");
          setMessage("Welcome!");
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
            <div style={div_title}>
              <h3 style={h3}>{title}</h3>
            </div>
            <div className="bg-dark" style={div_contents}>
              <h5 className="mb-3 text-light" style={h5}>{message}</h5>
              {isLoading ?
                <div>
                  <LocalImage url="loading.jpg" alt="小林 由依" width={280} height={280} />
                </div>
                :
                <div>
                  <LocalImage url="login.jpg" alt="藤吉 夏鈴" width={280} height={280} />
                  <div style={div_mt16}>
                    <button className="btn btn-danger" onClick={doLogin} disabled={auth.currentUser !== null ? true : false}>
                      Googleアカウントでログイン
                    </button>
                  </div>
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
