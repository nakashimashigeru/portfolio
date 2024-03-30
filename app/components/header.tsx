"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from "@fortawesome/free-brands-svg-icons";
import { HeaderProps } from "../types/props";
import { faReactStyle } from "../constants/iconStyle";

export default function Header(props: HeaderProps) {
  const h1 = {
    cursor: "pointer",
    fontSize: "18pt",
    height: "45px",
    padding: "8px",
    textAlign: "left",
  } as const;

  const doAction = ((e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    location.reload();
  });

  return (
    <div>
      {props.isLoading ?
        <h1 className="bg-dark text-light display-4" style={h1}>
          {props.title}
        </h1>
        :
        <h1 className="bg-dark text-light display-4" onClick={doAction} style={h1}>
          <FontAwesomeIcon style={faReactStyle} icon={faReact} />
          {props.title}
        </h1>
      }
    </div>
  );
}
