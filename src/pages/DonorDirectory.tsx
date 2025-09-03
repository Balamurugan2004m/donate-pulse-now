import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusChip } from "@/components/ui/status-chip";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Phone, Calendar, Heart } from "lucide-react";

interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  city: string;
  phone: string;
  lastDonated: string;
  available: boolean;
  donationCount: number;
}

const DonorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  // Mock data - would come from API
  const donors: Donor[] = [
    {
      id: "1",
      name: "John Smith",
      bloodGroup: "O+",
      city: "New York",
      phone: "+1 (555) 123-4567",
      lastDonated: "2024-01-15",
      available: true,
      donationCount: 12
    },
    {
      id: "2",
      name: "Sarah Johnson",
      bloodGroup: "A-",
      city: "Los Angeles",
      phone: "+1 (555) 987-6543",
      lastDonated: "2023-11-20",
      available: true,
      donationCount: 8
    },
    {
      id: "3",
      name: "Michael Brown",
      bloodGroup: "B+",
      city: "Chicago",
      phone: "+1 (555) 456-7890",
      lastDonated: "2024-02-28",
      available: false,
      donationCount: 15
    },
    {
      id: "4",
      name: "Emily Davis",
      bloodGroup: "AB-",
      city: "Houston",
      phone: "+1 (555) 234-5678",
      lastDonated: "2023-12-10",
      available: true,
      donationCount: 6
    }
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia"];

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = !bloodGroupFilter || donor.bloodGroup === bloodGroupFilter;
    const matchesCity = !cityFilter || donor.city === cityFilter;
    
    return matchesSearch && matchesBloodGroup && matchesCity;
  });

  const canDonate = (lastDonated: string) => {
    const lastDonationDate = new Date(lastDonated);
    const daysSinceLastDonation = Math.floor((Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastDonation >= 90;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Donor Directory</h1>
          <p className="text-muted-foreground">Find and connect with blood donors in your area</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or blood group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setBloodGroupFilter("");
                  setCityFilter("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found {filteredDonors.length} donor{filteredDonors.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDonors.map((donor) => (
              <Card key={donor.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{donor.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {donor.city}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {donor.bloodGroup}
                      </div>
                      <StatusChip 
                        variant={donor.available && canDonate(donor.lastDonated) ? "available" : "unavailable"}
                        size="sm"
                      >
                        {donor.available && canDonate(donor.lastDonated) ? "Available" : "Unavailable"}
                      </StatusChip>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {donor.phone}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last donated: {new Date(donor.lastDonated).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {donor.donationCount} donations
                    </Badge>
                    
                    <Button 
                      size="sm" 
                      disabled={!donor.available || !canDonate(donor.lastDonated)}
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDonors.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">No donors found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDirectory;