import Image from "next/image";
import { ImageProps } from "../types/props";

export default function LocalImage(props: ImageProps) {
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
