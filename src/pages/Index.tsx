import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Demo } from "@/components/Demo";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <Demo />
      <WhyChooseUs />
      <Contact />
    </div>
  );
};

export default Index;