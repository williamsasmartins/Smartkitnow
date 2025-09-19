import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Zap, Lightbulb, Plus } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header Section */}
      <Header />

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-16">
        {/* Welcome Section */}
        <section className="text-center mb-16 animate-fade-in">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-slide-up">
              Welcome to Smart Kit Now
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Your ultimate collection of smart tools and utilities. Discover powerful solutions designed to enhance your productivity and streamline your workflow.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <Button className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-glow">
                <Zap className="mr-2 h-4 w-4" />
                Get Started
              </Button>
              <Button variant="outline" className="border-border hover:bg-accent transition-all duration-300">
                <Lightbulb className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Tool Cards Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Smart Tools Coming Soon</h3>
            <p className="text-muted-foreground text-lg">
              We're building an amazing collection of tools to help you work smarter, not harder.
            </p>
          </div>

          {/* Placeholder Tool Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tool Card 1 */}
            <Card className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary-soft/20 group-hover:bg-primary-soft/30 transition-colors">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Tool Name</CardTitle>
                      <CardDescription>Coming Soon</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Amazing tool functionality will be available here soon. Stay tuned for updates!
                </p>
              </CardContent>
            </Card>

            {/* Tool Card 2 */}
            <Card className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-secondary-indigo/20 group-hover:bg-secondary-indigo/30 transition-colors">
                      <Zap className="h-5 w-5 text-secondary-indigo" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Another Tool</CardTitle>
                      <CardDescription>Coming Soon</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  More exciting functionality will be added here. We're working hard to bring you the best tools!
                </p>
              </CardContent>
            </Card>

            {/* Add New Tool Card */}
            <Card className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-gradient-hero border-border/50 cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-center h-20">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg text-center">Add New Tool</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  More tools will be added soon. Check back for exciting new features!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Index;
