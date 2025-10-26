import HeroSection from "./hero-section";
import HowItWorks from "./how-it-works";
//import PricingSection from "./pricing-section";
import WaitlistSignup from "./waitlist-signup";
import FaqSection from "./faq-section";

const HomeCloud = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-linear-to-b from-background via-background to-muted/50">
      <HeroSection />
      <HowItWorks />
      {/*<PricingSection />*/}
      <WaitlistSignup />
      <FaqSection />
    </div>
  );
};

export default HomeCloud;
