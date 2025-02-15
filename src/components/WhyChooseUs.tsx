
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const reasons = [
  "20+ years of industry experience",
  <div className="flex items-center gap-3">
    <img 
      src="/uploads/f50a8f6c-1a61-46ac-8e5f-bda51fdb2300.png" 
      alt="CBIP Logo" 
      className="h-6 w-auto"
    />
    <a href="https://tdwi.org/cbip" target="_blank" rel="noopener noreferrer" className="hover:underline">
      Certified expert consultant
    </a>
  </div>,
  "Tailored solutions for your business",
  "End-to-end project guidance",
  "Proven track record of success",
  <Link to="/methodologies" className="hover:underline">Industry-leading methodologies</Link>,
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
