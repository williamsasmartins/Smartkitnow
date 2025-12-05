import SeoHead from "@/components/seo/SeoHead";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead 
        title="Cookie Policy | Smart Kit Now"
        description="Learn about how Smart Kit Now uses cookies to improve your experience."
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-muted-foreground">
            This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. 
              They are widely used to make websites work more efficiently and to provide information to the site owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
            <p>
              We use cookies for several purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Essential Cookies:</strong> These are necessary for the website to function correctly. They enable basic features like page navigation and access to secure areas.</li>
              <li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our content and user experience.</li>
              <li><strong>Marketing Cookies:</strong> These are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Choices</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in our Cookie Settings.
            </p>
            <div className="mt-4">
              <Link to="/cookie-settings">
                <Button>Manage Cookie Preferences</Button>
              </Link>
            </div>
            <p className="mt-4">
              You can also control cookies through your browser settings. Most browsers allow you to block or delete cookies. 
              However, please note that if you disable essential cookies, some parts of our website may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We encourage you to review this page periodically for the latest information on our cookie practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at: <a href="mailto:contact@smartkitnow.com" className="text-primary hover:underline">contact@smartkitnow.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
export const pageMeta = { allowAds: false, minContentScore: 1 };

