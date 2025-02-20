
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Demo } from "./types";

interface DemoCardProps {
  demo: Demo;
  icon: React.ReactNode;
  hoverClassName?: string;
}

export const DemoCard = ({ demo, icon, hoverClassName = "hover:bg-[#F2FCE2]" }: DemoCardProps) => {
  return (
    <Link to={demo.path} className="group relative">
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
