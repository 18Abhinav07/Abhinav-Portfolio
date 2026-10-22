import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";

// The Studio view: every original route keeps its chrome here, so the Index
// view at /plain can render without any of it.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-[64px] md:pb-0">
      <Preloader />
      <SmoothScroll />
      <TopNav />
      <main>{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
