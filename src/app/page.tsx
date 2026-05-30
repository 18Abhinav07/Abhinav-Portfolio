import { Hero } from "@/components/Hero";
import { Identity } from "@/components/Identity";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Updates } from "@/components/Updates";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Identity />
      <FeaturedWork />
      <Updates />
    </>
  );
}

