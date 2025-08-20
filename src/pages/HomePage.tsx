import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Building2, Shield, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-blood-donation.jpg";

const HomePage = () => {
  const stats = [
    { icon: Users, label: "Active Donors", value: "2,847", color: "text-primary" },
    { icon: Building2, label: "Partner Hospitals", value: "156", color: "text-success" },
    { icon: Heart, label: "Lives Saved", value: "12,340", color: "text-primary" },
    { icon: Shield, label: "Safe Donations", value: "99.9%", color: "text-success" },
  ];

  const features = [
    {
      icon: Search,
      title: "Find Donors",
      description: "Search for blood donors by location, blood type, and availability",
      action: "Search Now",
      href: "/donors"
    },
    {
      icon: Plus,
      title: "Request Blood",
      description: "Hospitals can create urgent blood requests for patient care",
      action: "Create Request",
      href: "/requests/new"
    },
    {
      icon: Heart,
      title: "Donate Blood",
      description: "Join our community of lifesavers and help those in need",
      action: "Join Now",
      href: "/register"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Connecting Lives, Saving Future
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Blood Donation{" "}
                  <span className="text-primary">Made Simple</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Connect donors with hospitals instantly. Our platform ensures safe, 
                  efficient blood donation management for communities worldwide.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary-dark shadow-lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Start Donating
                </Button>
                <Button size="lg" variant="outline">
                  <Building2 className="mr-2 h-5 w-5" />
                  Hospital Portal
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={heroImage}
                alt="Blood donation in modern medical facility"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <stat.icon className={`h-8 w-8 mx-auto ${stat.color}`} />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform streamlines the blood donation process for donors and hospitals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-accent/5">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link to={feature.href}>{feature.action}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 text-primary-foreground">
            <h2 className="text-3xl font-bold">Ready to Save Lives?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join our community today and be part of something bigger than yourself
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Register as Donor
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Hospital Registration
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;