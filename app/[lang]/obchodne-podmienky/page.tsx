import { PravnaStrankaObsah, pravnaMetadata } from "@/components/pravna-stranka";

export function generateMetadata() {
  return pravnaMetadata("obchodne-podmienky");
}

export default function Page() {
  return <PravnaStrankaObsah slug="obchodne-podmienky" />;
}
