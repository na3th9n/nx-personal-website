import { Credits } from "@/components/os/Credits";
import { Desktop } from "@/components/os/Desktop";
import { MenuBar } from "@/components/os/MenuBar";

export default function Home() {
  return <Desktop menuBar={<MenuBar />} credits={<Credits />} />;
}
