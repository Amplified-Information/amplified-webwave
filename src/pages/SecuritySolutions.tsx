import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, ShieldCheck, Fingerprint } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const SecuritySolutions = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary">Security Solutions</h1>
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Data Protection</h2>
                  <p className="text-muted-foreground">
                    Implement comprehensive data protection strategies to safeguard your valuable
                    information assets from threats.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Lock className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Access Control</h2>
                  <p className="text-muted-foreground">
                    Design and implement robust access control systems to ensure only authorized
                    personnel can access sensitive data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Compliance Management</h2>
                  <p className="text-muted-foreground">
                    Ensure your data infrastructure meets all relevant regulatory requirements
                    and industry standards.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Fingerprint className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Identity Management</h2>
                  <p className="text-muted-foreground">
                    Implement secure identity and access management solutions to protect your
                    systems and data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SecuritySolutions;