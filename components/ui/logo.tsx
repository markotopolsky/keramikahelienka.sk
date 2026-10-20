import Image from "next/image";

const SRC = "/images/logo/helen-studio.png";
// The mask is plain CSS, so it cannot go through the next/image loader; this is the URL lib/cloudinary-loader.ts builds
const MASK = "https://res.cloudinary.com/dl6xldrhk/image/upload/f_auto,c_limit,w_1600,q_auto/keramikahelienka/logo/helen-studio";
const NAZOV = "Helen Studio";

/**
 * The Helen Studio logo. `farba="znacka"` shows its own teal and pink, for light backgrounds.
 * `farba="text"` paints the logo's shape in the current text color, so it stays readable
 * on dark photos and on the deep footer, where teal would disappear.
 */
export function Logo({ farba, className = "" }: { farba: "znacka" | "text"; className?: string }) {
  if (farba === "znacka") {
    return <Image src={SRC} alt={NAZOV} width={816} height={248} className={`h-auto ${className}`} />;
  }
  return (
    <span
      role="img"
      aria-label={NAZOV}
      className={`block aspect-[816/248] bg-current ${className}`}
      style={{ maskImage: `url(${MASK})`, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center" }}
    />
  );
}
