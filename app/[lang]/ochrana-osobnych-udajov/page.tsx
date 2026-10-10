import { PravnaStrankaObsah, pravnaMetadata } from "@/components/pravna-stranka";

export function generateMetadata() {
  return pravnaMetadata("ochrana-osobnych-udajov");
}

export default function Page() {
  return <PravnaStrankaObsah slug="ochrana-osobnych-udajov" />;
}
