import { Nav } from "@/components/hero/nav";
import { Hero } from "@/components/hero/hero";
import { StackStrip } from "@/components/hero/stack-strip";
import { Pipeline } from "@/components/hero/pipeline";
import { Features } from "@/components/hero/features";
import { FrameworkDetect } from "@/components/hero/framework-detect";
import { Cta } from "@/components/hero/cta";
import { Footer } from "@/components/hero/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StackStrip />
        <Pipeline />
        <Features />
        <FrameworkDetect />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
