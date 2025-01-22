import { Contact as ContactSection } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <ContactSection />
    </div>
  );
};

export default Contact;