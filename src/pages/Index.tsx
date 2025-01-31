import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";
import DemoOverview from "./demos/DemoOverview";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <DemoOverview />
      <WhyChooseUs />
      <Contact />
    </div>
  );
};

export default Index;