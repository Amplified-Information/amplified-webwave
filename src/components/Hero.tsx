import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-light via-primary to-primary-dark text-white">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
          Amplifying Your Data Systems
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          Expert consulting services to transform your data infrastructure and drive business growth
        </p>
        <Button 
          className="bg-white text-primary hover:bg-gray-100 animate-fadeIn"
          style={{ animationDelay: "0.4s" }}
        >
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};