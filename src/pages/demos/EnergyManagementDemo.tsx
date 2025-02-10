
import { Navigation } from "@/components/Navigation";

const EnergyManagementDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Energy Management Demo</h1>
        <p className="text-lg text-gray-600 mb-8">
          Explore how our energy management solutions can help optimize consumption and reduce costs.
        </p>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600">Demo content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default EnergyManagementDemo;
