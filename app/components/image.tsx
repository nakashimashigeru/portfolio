import Image from "next/image";

type Props = {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export default function LocalImage(props: Props) {
  const img = {
    display: "block",
    margin: "0px auto 16px",
  } as const;

  const url = "/" + props.url;

  return (
    <Image
      src={url}
      alt={props.alt}
      width={props.width}
      height={props.height}
      style={img}
      priority
    />
  );
}
