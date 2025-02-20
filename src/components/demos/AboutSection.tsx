
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const AboutSection = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>About This Site</CardTitle>
        <CardDescription>Welcome to our interactive demonstration platform</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          This demo section showcases our various capabilities and solutions through hands-on, interactive examples. 
          Each demo is carefully crafted to demonstrate specific features and functionalities of our platform. 
          From AI-powered garden planning to real-time analytics and financial tools, you can explore and 
          experience our technology firsthand. Select any demo below to get started.
        </p>
      </CardContent>
    </Card>
  );
};
