"use client";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";

type Props = {
  isLoading: boolean;
};

export default function Footer(props: Props) {
  const div = {
    position: "sticky",
    textAlign: "center",
    top: "100vh",
    width: "100%",
  } as const;

  const iconStyle: React.CSSProperties = { fontSize: 18, marginRight: 8 };
  const ignore = useRef(false);
  const [footer, setFooter] = useState("copyright wait...");

  useEffect(() => {
    if (!ignore.current) {
      setInterval(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const dayOfWeek = d.getDay();
        const hour = d.getHours().toString().padStart(2, "0");
        const minute = d.getMinutes().toString().padStart(2, "0");
        const array = ["日", "月", "火", "水", "木", "金", "土"];
        setFooter("copyright" + " " + year + "-" + month + "-" + day + " " + "(" + array[dayOfWeek] + ")" + " " + hour + ":" + minute);
      });
    }
    return () => {
      ignore.current = true;
    };
  }, []);

  return (
    <div className="h6 my-4" style={div}>
      {props.isLoading ?
        <div>
          {footer}
        </div>
        :
        <div className="d-flex align-items-center justify-content-center">
          <FontAwesomeIcon style={iconStyle} icon={faCopyright} />
          {footer}
        </div>
      }
    </div>
  );
}
