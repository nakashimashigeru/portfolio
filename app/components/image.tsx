import Image from "next/image";

type Props = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export default function LocalImage(props: Props) {
  const url = "/" + props.url;

  return (
    <Image
      src={url}
      alt={props.alt}
      width={props.width}
      height={props.height}
      priority
    />
  );
}
