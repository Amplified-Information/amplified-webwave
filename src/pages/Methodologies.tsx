import { Navigation } from "@/components/Navigation";

const methodologies = [
  {
    name: "Agile Data Warehouse Design",
    description: "An iterative approach to data warehouse development that emphasizes rapid delivery and continuous stakeholder feedback."
  },
  {
    name: "Data Vault 2.0",
    description: "A hybrid modeling methodology designed for enterprise data warehousing that combines the best of 3NF and dimensional modeling."
  },
  {
    name: "Kimball Dimensional Modeling",
    description: "A bottom-up approach to data warehouse design that focuses on delivering business value through dimensional models optimized for data analytics."
  },
  {
    name: "CRISP-DM",
    description: "Cross-Industry Standard Process for Data Mining - a comprehensive methodology for data mining and analytics projects."
  },
  {
    name: "DataOps",
    description: "An automated, process-oriented methodology for improving the quality and reducing the cycle time of data analytics."
  }
];

const Methodologies = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8">
          Industry-Leading Methodologies
        </h1>
        <div className="grid gap-6">
          {methodologies.map((methodology, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {methodology.name}
              </h2>
              <p className="text-gray-600">
                {methodology.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Methodologies;