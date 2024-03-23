"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from "@fortawesome/free-brands-svg-icons";

export default function Header() {
  const h1 = {
    cursor: "pointer",
    fontSize: "18pt",
    height: "45px",
    padding: "8px",
    textAlign: "left",
  } as const;

  const title = "RSTC";
  const iconStyle: React.CSSProperties = { fontSize: 18, marginRight: 8 };

  const doAction = ((e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    location.reload();
  });

  return (
    <div>
      <h1 className="bg-dark text-white display-4" onClick={doAction} style={h1}>
        <FontAwesomeIcon style={iconStyle} icon={faReact} />
        {title}
      </h1>
    </div>
  );
}
