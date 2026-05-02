import { Nav } from "@/components/sections/Nav";
import { DemoExperience } from "@/components/demo/DemoExperience";

export default function DemoPage() {
  return (
    <>
      <Nav />
      <main id="main" className="min-h-screen bg-bg">
        <DemoExperience />
      </main>
    </>
  );
}
