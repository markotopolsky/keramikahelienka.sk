import { PravnaStrankaObsah, pravnaMetadata } from "@/components/pravna-stranka";

export function generateMetadata() {
  return pravnaMetadata("cookies");
}

export default function Page() {
  return <PravnaStrankaObsah slug="cookies" />;
}
