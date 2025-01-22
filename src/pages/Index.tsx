import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { DemoPages } from "@/components/DemoPages";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <DemoPages />
      <WhyChooseUs />
      <Contact />
    </div>
  );
};

export default Index;