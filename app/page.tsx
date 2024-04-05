"use client";
import { useRef, useState, useEffect } from "react";
import { CookiesProvider } from "react-cookie";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { signInWithRedirect } from 'firebase/auth';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { auth, provider } from "./libs/firebase/config";
import { commonStyle } from "./constants/commonStyle";
import { pageStyle } from "./constants/pageStyle";
import Footer from "./components/footer";
import Header from "./components/header";
import LocalImage from "./components/image";
import Top from "./components/top";

export default function Home() {
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
          setMessage("Welcome");
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
          <CircleSpinnerOverlay overlayColor="rgba(0,0,0,0.2)" />
        }
        <Header title={headerTitle} isLoading={isLoading} />
        {auth.currentUser !== null ?
          <Top />
          :
          <div className="container">
            <div style={pageStyle.div_title}>
              <h3 className="mb-0" style={pageStyle.h3}>{title}</h3>
            </div>
            <div className="bg-dark" style={pageStyle.div_contents}>
              <h5 className="mb-2 text-light" style={pageStyle.h5}>{message}</h5>
              {isLoading ?
                <div>
                  <LocalImage url="onepiece20_santaisyou1_kizaru_borsalino.png" alt="海軍三大将のイラスト（黄猿）" width={280} height={354} />
                </div>
                :
                <div>
                  <LocalImage url="kids_chuunibyou_girl.png" alt="中二病のイラスト（女性）" width={280} height={300} />
                  <div style={commonStyle.mt_16}>
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
