import { PravnaStrankaObsah, pravnaMetadata } from "@/components/pravna-stranka";

export function generateMetadata() {
  return pravnaMetadata("reklamacny-poriadok");
}

export default function Page() {
  return <PravnaStrankaObsah slug="reklamacny-poriadok" />;
}
