import { CheckCircle } from "lucide-react";

const reasons = [
  "20+ years of industry experience",
  <a href="https://tdwi.org/cbip" target="_blank" rel="noopener noreferrer" className="hover:underline">CBIP Certified expert consultant</a>,
  "Tailored solutions for your business",
  "24/7 technical support",
  "Proven track record of success",
  "Industry-leading methodologies",
];

export const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-primary">
            Why Choose Amplified Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm"
              >
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};