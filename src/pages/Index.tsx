import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";
import DemoOverview from "@/pages/demos/DemoOverview";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <div className="bg-gray-50">
        <div className="container mx-auto px-6">
          <DemoOverview />
        </div>
      </div>
      <WhyChooseUs />
      <Contact />
    </div>
  );
};

export default Index;