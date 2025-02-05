import { DemoPages } from "@/components/DemoPages";
import { Navigation } from "@/components/Navigation";

const DemoOverview = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <DemoPages />
    </div>
  );
};

export default DemoOverview;