import Image from "next/image";
import { IconName, ICONS } from "@/lib/constants/icons";

interface IconProps {
  name: IconName;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  unoptimized?: boolean;
}

export function Icon({
  name,
  alt,
  className = "",
  width = 24,
  height = 24,
  fill = false,
  unoptimized = false,
}: IconProps) {
  const src = ICONS[name];

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        unoptimized={unoptimized}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={unoptimized}
    />
  );
}

export { ICONS };
export type { IconName };
