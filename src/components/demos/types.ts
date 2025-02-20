
export interface Demo {
  title: string;
  description: string;
  path: string;
  isActive?: boolean;
  status?: string;
}

export interface DemoSectionProps {
  title: string;
  icon: React.ReactNode;
  demos: Demo[];
  hoverClassName?: string;
  iconClassName?: string;
}
