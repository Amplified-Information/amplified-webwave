
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Demo } from "./types";
import { useEffect } from "react";

interface DemoCardProps {
  demo: Demo;
  icon: React.ReactNode;
  hoverClassName?: string;
}

export const DemoCard = ({ demo, icon, hoverClassName = "hover:bg-[#F2FCE2]" }: DemoCardProps) => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <Link 
      to={demo.path} 
      className="group relative"
      onClick={() => window.scrollTo(0, 0)}
    >
      <Card className={`h-full transition-all duration-300 hover:shadow-lg ${hoverClassName}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {demo.title}
          </CardTitle>
          <CardDescription>{demo.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
