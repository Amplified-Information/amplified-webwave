
import { DemoCard } from "./DemoCard";
import type { DemoSectionProps } from "./types";

export const DemoSection = ({ title, icon, demos, hoverClassName, iconClassName }: DemoSectionProps) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demos.map((demo) => (
          <DemoCard 
            key={demo.path}
            demo={demo}
            icon={icon}
            hoverClassName={hoverClassName}
          />
        ))}
      </div>
    </div>
  );
};
