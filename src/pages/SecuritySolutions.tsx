
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, ShieldCheck, Fingerprint } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const SecuritySolutions = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary">Security Solutions</h1>
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          Protect your digital assets with our comprehensive security solutions. 
          We provide robust, multi-layered security measures that safeguard your data, 
          systems, and infrastructure while ensuring compliance with industry standards 
          and regulations.
        </p>
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Data Protection</h2>
                  <p className="text-muted-foreground">
                    Comprehensive data protection strategies to safeguard your valuable
                    information assets from internal and external threats.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Encryption</strong> – Advanced encryption protocols for data at rest and in transit</li>
                    <li><strong>Data Masking</strong> – Protection of sensitive information through data obfuscation</li>
                    <li><strong>Backup Solutions</strong> – Automated backup systems with secure offsite storage</li>
                    <li><strong>Data Recovery</strong> – Rapid recovery procedures for business continuity</li>
                  </ul>
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
                    Robust access management systems ensuring only authorized personnel
                    can access sensitive resources and data.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Role-Based Access</strong> – Granular permissions based on user roles and responsibilities</li>
                    <li><strong>Multi-Factor Authentication</strong> – Additional security layers beyond passwords</li>
                    <li><strong>Single Sign-On</strong> – Streamlined access management across multiple systems</li>
                    <li><strong>Access Monitoring</strong> – Real-time tracking of system access and user activities</li>
                  </ul>
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
                    Comprehensive compliance solutions ensuring adherence to industry
                    standards and regulatory requirements.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Regulatory Compliance</strong> – Adherence to GDPR, HIPAA, and other standards</li>
                    <li><strong>Audit Trails</strong> – Detailed logging of all system and data access activities</li>
                    <li><strong>Policy Management</strong> – Development and enforcement of security policies</li>
                    <li><strong>Risk Assessment</strong> – Regular evaluation of security risks and vulnerabilities</li>
                  </ul>
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
                    Advanced identity and access management solutions protecting your
                    systems and data with robust authentication methods.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Biometric Authentication</strong> – Secure access using unique biological identifiers</li>
                    <li><strong>Identity Verification</strong> – Multi-step verification processes for user authentication</li>
                    <li><strong>Privileged Access Management</strong> – Special controls for high-privilege accounts</li>
                    <li><strong>Directory Services</strong> – Centralized user identity and access management</li>
                  </ul>
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
