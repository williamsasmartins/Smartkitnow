import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="pt-20 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            This page is under construction. Please check back soon for our contact information and support options.
          </p>
          <div className="bg-card border border-border/50 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground">
              We're working on bringing you the best ways to get in touch with our team. 
              Stay tuned for updates!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;