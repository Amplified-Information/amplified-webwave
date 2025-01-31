import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#F2FCE2] via-white to-[#F2FCE2] text-black">
      <div className="container mx-auto px-6 py-16 text-center">
        <img 
          src="/lovable-uploads/f8f959e3-530e-46d3-8306-1cc3ad3cebee.png" 
          alt="Amplified Information" 
          className="mx-auto mb-8 w-[400px] max-w-full object-contain" 
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">
          Amplify the Signal, Eliminate the Noise
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          Expert consulting services to transform your data infrastructure and drive business growth
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/services">
            <Button 
              className="bg-[#86C232] text-white hover:bg-[#61892F] animate-fadeIn"
              style={{ animationDelay: "0.4s" }}
            >
              Our Services <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/demo/overview">
            <Button 
              className="bg-[#86C232] text-white hover:bg-[#61892F] animate-fadeIn"
              style={{ animationDelay: "0.5s" }}
            >
              Interact with Demos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};