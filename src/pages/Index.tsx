import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { DemoPages } from "@/components/DemoPages";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <DemoPages />
      <WhyChooseUs />
      <Contact />
    </div>
  );
};

export default Index;