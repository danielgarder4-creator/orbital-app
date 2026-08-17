import { Hero } from "@/components/marketing/hero";
import { HowItWorks, Features } from "@/components/marketing/sections";
import { StoreBuilderShowcase, MarketingShowcase, AnalyticsShowcase } from "@/components/marketing/showcases";
import { Pricing, Testimonials, FAQ, FinalCTA } from "@/components/marketing/pricing-faq-cta";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <StoreBuilderShowcase />
      <MarketingShowcase />
      <AnalyticsShowcase />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}
