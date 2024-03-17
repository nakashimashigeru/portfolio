interface Props {
  header: string;
}

export default function Header(props: Props) {
  const h1 = {
    fontSize: "24pt",
    padding: "8px 16px",
    textAlign: "left"
  } as const;

  return (
    <div>
      <h1 className="bg-dark text-white display-4" style={h1}>
        {props.header}
      </h1>
    </div>
  );
}
