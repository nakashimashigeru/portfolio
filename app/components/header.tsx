"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from "@fortawesome/free-brands-svg-icons";

type Props = {
  title: string;
  isLoading: boolean;
};

export default function Header(props: Props) {
  const h1 = {
    fontSize: "18pt",
    height: "45px",
    padding: "8px",
    textAlign: "left"
  } as const;

  const iconStyle: React.CSSProperties = { marginRight: 8, fontSize: 18 };

  return (
    <div>
      {props.isLoading ?
        <h1 className="bg-dark text-white display-4" style={h1}>
          {props.title}
        </h1>
        :
        <h1 className="bg-dark text-white display-4" style={h1}>
          <FontAwesomeIcon style={iconStyle} icon={faReact} />
          {props.title}
        </h1>
      }
    </div>
  );
}
