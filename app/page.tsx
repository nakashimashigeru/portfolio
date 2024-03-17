"use client";
import { useRef, useState, useEffect } from "react";
import { CookiesProvider } from "react-cookie";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { signInWithRedirect, User } from 'firebase/auth';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { auth, provider } from "./components/firebase";
import Header from "./components/header";
import LocalImage from "./components/image";
import Top from "./components/top";

export default function Home() {
  const h3 = {
    color: "#99d",
    fontSize: "24pt",
    fontWeight: "bold",
    height: "38px",
    textAlign: "center",
  } as const;

  const p = {
    color: "#669",
    fontSize: "18pt",
    margin: "0px 8px 16px 0px",
    textAlign: "center",
  } as const;

  const button = {
    width: "280px",
  } as const;

  const ignore = useRef(false);
  const [hasDocument, setHasDocument] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("Now Loading...");
  const [_subtitle, set_Subtitle] = useState("");

  useEffect(() => {
    if (!ignore.current) {
      if (typeof document !== "undefined") {
        setHasDocument(true);
      }
      const unsubscribed = auth.onAuthStateChanged((currentUser) => {
        try {
          setCurrentUser(currentUser);
          setIsLoading(false);
          setTitle("Login page.");
          setMessage("Welcome to next.js!");
          if (currentUser) {
            set_Subtitle("Login User: " + currentUser.displayName);
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
        <Header header="React" />
        {currentUser !== null ?
          <Top subtitle={_subtitle} />
          :
          <div className="container">
            <h3 className="my-3 text-primary text-center" style={h3}>{title}</h3>
            <div className="bg-dark card p-3 text-center">
              <p className="h5" style={p}>{message}</p>
              {isLoading ?
                <div>
                  <LocalImage url="Loading.jpg" alt="小林 由依" width={300} height={300} />
                </div>
                :
                <div>
                  <LocalImage url="Login.jpg" alt="藤吉 夏鈴" width={300} height={300} />
                  <button className="btn btn-primary" onClick={doLogin} style={button}>
                    Google アカウントでログイン
                  </button>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </CookiesProvider>
  );
}
