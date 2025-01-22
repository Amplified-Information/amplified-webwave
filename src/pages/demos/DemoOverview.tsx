import { Navigation } from "@/components/Navigation";

const DemoOverview = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-8">Platform Overview Demo</h1>
        <p className="text-lg text-gray-600">Coming soon: A comprehensive demonstration of our platform's capabilities.</p>
      </div>
    </div>
  );
};

export default DemoOverview;