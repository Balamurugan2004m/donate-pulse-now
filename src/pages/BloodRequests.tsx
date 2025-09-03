import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusChip } from "@/components/ui/status-chip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Building2, MapPin, Clock, Users, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface BloodRequest {
  id: string;
  hospitalName: string;
  bloodGroup: string;
  city: string;
  unitsNeeded: number;
  unitsFulfilled: number;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  status: "pending" | "fulfilled" | "canceled";
  createdAt: string;
  deadline: string;
  pledges: number;
}

const BloodRequests = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");

  // Mock data - would come from API
  const requests: BloodRequest[] = [
    {
      id: "1",
      hospitalName: "City General Hospital",
      bloodGroup: "O-",
      city: "New York",
      unitsNeeded: 10,
      unitsFulfilled: 7,
      urgencyLevel: "critical",
      status: "pending",
      createdAt: "2024-03-15T10:30:00Z",
      deadline: "2024-03-18T23:59:59Z",
      pledges: 5
    },
    {
      id: "2", 
      hospitalName: "St. Mary's Medical Center",
      bloodGroup: "A+",
      city: "Los Angeles",
      unitsNeeded: 5,
      unitsFulfilled: 5,
      urgencyLevel: "medium",
      status: "fulfilled",
      createdAt: "2024-03-10T08:15:00Z",
      deadline: "2024-03-15T23:59:59Z",
      pledges: 5
    },
    {
      id: "3",
      hospitalName: "Metro Health System",
      bloodGroup: "B-",
      city: "Chicago", 
      unitsNeeded: 8,
      unitsFulfilled: 3,
      urgencyLevel: "high",
      status: "pending",
      createdAt: "2024-03-12T14:20:00Z",
      deadline: "2024-03-16T23:59:59Z",
      pledges: 3
    },
      {
        id: "4",
        hospitalName: "Regional Medical Center",
        bloodGroup: "AB+",
        city: "Houston",
        unitsNeeded: 3,
        unitsFulfilled: 1,
        urgencyLevel: "low",
        status: "pending",
        createdAt: "2024-03-14T09:45:00Z",
        deadline: "2024-03-20T23:59:59Z",
        pledges: 1
      },
      {
        id: "5",
        hospitalName: "Children's Medical Center",
        bloodGroup: "O+",
        city: "Miami",
        unitsNeeded: 15,
        unitsFulfilled: 12,
        urgencyLevel: "critical",
        status: "pending",
        createdAt: "2024-03-16T06:30:00Z",
        deadline: "2024-03-17T23:59:59Z",
        pledges: 8
      },
      {
        id: "6",
        hospitalName: "University Hospital",
        bloodGroup: "A-",
        city: "Boston",
        unitsNeeded: 6,
        unitsFulfilled: 6,
        urgencyLevel: "medium",
        status: "fulfilled",
        createdAt: "2024-03-11T16:20:00Z",
        deadline: "2024-03-16T23:59:59Z",
        pledges: 6
      },
      {
        id: "7",
        hospitalName: "Community General Hospital",
        bloodGroup: "B+",
        city: "Seattle",
        unitsNeeded: 4,
        unitsFulfilled: 0,
        urgencyLevel: "high",
        status: "pending",
        createdAt: "2024-03-17T11:15:00Z",
        deadline: "2024-03-19T23:59:59Z",
        pledges: 0
      },
      {
        id: "8",
        hospitalName: "Sacred Heart Medical Center",
        bloodGroup: "AB-",
        city: "Phoenix",
        unitsNeeded: 2,
        unitsFulfilled: 1,
        urgencyLevel: "medium",
        status: "pending",
        createdAt: "2024-03-13T13:45:00Z",
        deadline: "2024-03-21T23:59:59Z",
        pledges: 1
      },
      {
        id: "9",
        hospitalName: "Veterans Medical Center",
        bloodGroup: "O-",
        city: "Denver",
        unitsNeeded: 12,
        unitsFulfilled: 4,
        urgencyLevel: "critical",
        status: "pending",
        createdAt: "2024-03-15T14:20:00Z",
        deadline: "2024-03-18T23:59:59Z",
        pledges: 3
      }
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const urgencyLevels = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
  ];

  const filteredRequests = requests.filter(request => {
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesBloodGroup = !bloodGroupFilter || request.bloodGroup === bloodGroupFilter;
    const matchesUrgency = !urgencyFilter || request.urgencyLevel === urgencyFilter;
    
    return matchesStatus && matchesBloodGroup && matchesUrgency;
  });

  const getUrgencyChipVariant = (urgency: string) => {
    switch (urgency) {
      case "critical": return "urgent";
      case "high": return "pending";
      case "medium": return "active";
      case "low": return "available";
      default: return "pending";
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffInHours = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours <= 0) return "Expired";
    if (diffInHours < 24) return `${diffInHours}h left`;
    const days = Math.floor(diffInHours / 24);
    return `${days}d left`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blood Requests</h1>
            <p className="text-muted-foreground">Find urgent blood requests in your area</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link to="/requests/new">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filter Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Blood Groups</SelectItem>
                  {bloodGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Urgency Levels</SelectItem>
                  {urgencyLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setStatusFilter("");
                  setBloodGroupFilter("");
                  setUrgencyFilter("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
          </p>

          <div className="grid gap-6">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{request.hospitalName}</CardTitle>
                        <StatusChip 
                          variant={request.status === "fulfilled" ? "fulfilled" : request.status === "canceled" ? "canceled" : "pending"}
                          size="sm"
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </StatusChip>
                      </div>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.city}
                      </CardDescription>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {request.bloodGroup}
                      </div>
                      <StatusChip 
                        variant={getUrgencyChipVariant(request.urgencyLevel)}
                        size="sm"
                      >
                        {request.urgencyLevel.charAt(0).toUpperCase() + request.urgencyLevel.slice(1)}
                      </StatusChip>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {request.unitsFulfilled}/{request.unitsNeeded} units
                      </span>
                    </div>
                    <Progress 
                      value={(request.unitsFulfilled / request.unitsNeeded) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Hospital</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{request.pledges} pledges</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{getTimeRemaining(request.deadline)}</span>
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{request.urgencyLevel} priority</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button 
                      size="sm" 
                      disabled={request.status !== "pending"}
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Make Pledge
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/requests/${request.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">No requests found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or create a new request</p>
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

export default BloodRequests;