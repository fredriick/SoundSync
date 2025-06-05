import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, BarChart3, Server, Shield, Settings2, AlertTriangle, ShieldAlert } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance";

interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  uptime: number;
  enabled: boolean;
  lastIncident?: string;
  category: "api" | "storage" | "security" | "frontend" | "database" | "other";
}

// Function to check if user is a superadmin
const checkIsSuperAdmin = (): boolean => {
  const mockUserRaw = localStorage.getItem('mockUser');
  if (mockUserRaw) {
    try {
      const mockUser = JSON.parse(mockUserRaw);
      return mockUser.role === "superadmin";
    } catch (e) {
      console.error("Error parsing user data", e);
    }
  }
  return false;
};

export default function ServicesManagement() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    description: "",
    status: "operational",
    category: "api",
    enabled: true,
    uptime: 100
  });

  // Check if user is a superadmin
  useEffect(() => {
    const isSuperAdmin = checkIsSuperAdmin();
    
    if (!isSuperAdmin) {
      toast({
        title: "Access Denied",
        description: "Only Super Admins can access service management",
        variant: "destructive"
      });
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    // Simulate fetching services data
    const timer = setTimeout(() => {
      const mockServices: Service[] = [
        {
          id: "1",
          name: "Authentication API",
          description: "User authentication and authorization service",
          status: "operational",
          uptime: 99.98,
          enabled: true,
          category: "api"
        },
        {
          id: "2",
          name: "Storage Service",
          description: "Audio file storage and retrieval system",
          status: "operational",
          uptime: 99.95,
          enabled: true,
          category: "storage"
        },
        {
          id: "3",
          name: "Search API",
          description: "Music search and indexing service",
          status: "degraded",
          uptime: 97.5,
          lastIncident: "2 hours ago",
          enabled: true,
          category: "api"
        },
        {
          id: "4",
          name: "User Database",
          description: "Core user information database",
          status: "operational",
          uptime: 99.99,
          enabled: true,
          category: "database"
        },
        {
          id: "5",
          name: "Analytics Service",
          description: "User and playback analytics pipeline",
          status: "operational",
          uptime: 99.7,
          enabled: true,
          category: "api"
        },
        {
          id: "6",
          name: "CDN Distribution",
          description: "Content delivery network for audio streaming",
          status: "maintenance",
          uptime: 98.2,
          lastIncident: "Scheduled maintenance",
          enabled: true,
          category: "frontend"
        },
        {
          id: "7",
          name: "Security Monitoring",
          description: "Real-time security monitoring and threat detection",
          status: "operational",
          uptime: 99.95,
          enabled: true,
          category: "security"
        }
      ];
      
      setServices(mockServices);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadgeColor = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return "bg-green-500 hover:bg-green-500/80";
      case "degraded":
        return "bg-yellow-500 hover:bg-yellow-500/80";
      case "outage":
        return "bg-red-500 hover:bg-red-500/80";
      case "maintenance":
        return "bg-blue-500 hover:bg-blue-500/80";
      default:
        return "";
    }
  };

  const getCategoryIcon = (category: Service["category"]) => {
    switch (category) {
      case "api":
        return <Server className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "storage":
        return <BarChart3 className="h-4 w-4" />;
      case "frontend":
      case "database":
      case "other":
      default:
        return <Settings2 className="h-4 w-4" />;
    }
  };

  // Show access denied screen if loading (to prevent flash of content)
  if (!checkIsSuperAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-4">
          <ShieldAlert className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
          Only Super Admins can access the Services Management page.
        </p>
        <Button onClick={() => navigate("/admin")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const handleStatusChange = (serviceId: string, newStatus: ServiceStatus) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId ? { ...service, status: newStatus } : service
      )
    );
    
    toast({
      title: "Service status updated",
      description: `Service status has been changed to ${newStatus}`,
    });
  };

  const handleToggleService = (serviceId: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId ? { ...service, enabled: !service.enabled } : service
      )
    );
    
    const service = services.find(s => s.id === serviceId);
    toast({
      title: service?.enabled ? "Service disabled" : "Service enabled",
      description: `${service?.name} has been ${service?.enabled ? "disabled" : "enabled"}`,
    });
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
  };

  const saveServiceChanges = () => {
    if (!editingService) return;
    
    setServices(prev => 
      prev.map(service => 
        service.id === editingService.id ? editingService : service
      )
    );
    
    setIsEditDialogOpen(false);
    toast({
      title: "Service updated",
      description: `${editingService.name} has been updated successfully`,
    });
  };

  const addNewService = () => {
    if (!newService.name || !newService.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const createdService: Service = {
      id: `${services.length + 1}`,
      name: newService.name,
      description: newService.description,
      status: (newService.status as ServiceStatus) || "operational",
      uptime: newService.uptime || 100,
      enabled: newService.enabled || true,
      category: (newService.category as Service["category"]) || "other"
    };
    
    setServices(prev => [...prev, createdService]);
    setIsAddDialogOpen(false);
    setNewService({
      name: "",
      description: "",
      status: "operational",
      category: "api",
      enabled: true,
      uptime: 100
    });
    
    toast({
      title: "Service added",
      description: `${createdService.name} has been added successfully`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage all platform services
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add New Service</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} className={!service.enabled ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className="mr-2">{getCategoryIcon(service.category)}</span>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </div>
                <Badge className={getStatusBadgeColor(service.status)}>
                  {service.status}
                </Badge>
              </div>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="font-medium">{service.uptime}%</span>
                </div>
                {service.lastIncident && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last incident:</span>
                    <span className="font-medium flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" />
                      {service.lastIncident}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={service.enabled} 
                  onCheckedChange={() => handleToggleService(service.id)} 
                  id={`enable-${service.id}`} 
                />
                <Label htmlFor={`enable-${service.id}`}>{service.enabled ? "Enabled" : "Disabled"}</Label>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleEditService(service)}>
                Configure
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Service Configuration</DialogTitle>
            <DialogDescription>
              Make changes to service configuration and status.
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={editingService.name}
                  onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingService.description}
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <div className="flex flex-wrap gap-2">
                  {(["operational", "degraded", "outage", "maintenance"] as ServiceStatus[]).map(status => (
                    <Badge 
                      key={status}
                      className={`cursor-pointer ${editingService.status === status ? getStatusBadgeColor(status) : 'bg-secondary'}`}
                      onClick={() => setEditingService({...editingService, status})}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingService.category}
                  onChange={(e) => setEditingService({...editingService, category: e.target.value as Service["category"]})}
                >
                  <option value="api">API</option>
                  <option value="storage">Storage</option>
                  <option value="security">Security</option>
                  <option value="frontend">Frontend</option>
                  <option value="database">Database</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={editingService.enabled}
                  onCheckedChange={(checked) => setEditingService({...editingService, enabled: checked})}
                  id="service-enabled"
                />
                <Label htmlFor="service-enabled">Service Enabled</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveServiceChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Service Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service for monitoring and management.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-name">Service Name*</Label>
              <Input
                id="new-name"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                placeholder="Authentication API"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-description">Description*</Label>
              <Textarea
                id="new-description"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                placeholder="Handles user authentication and authorization"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-category">Category</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newService.category}
                onChange={(e) => setNewService({...newService, category: e.target.value as Service["category"]})}
              >
                <option value="api">API</option>
                <option value="storage">Storage</option>
                <option value="security">Security</option>
                <option value="frontend">Frontend</option>
                <option value="database">Database</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Initial Status</Label>
              <div className="flex flex-wrap gap-2">
                {(["operational", "degraded", "outage", "maintenance"] as ServiceStatus[]).map(status => (
                  <Badge 
                    key={status}
                    className={`cursor-pointer ${(newService.status as string) === status ? getStatusBadgeColor(status) : 'bg-secondary'}`}
                    onClick={() => setNewService({...newService, status})}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={newService.enabled}
                onCheckedChange={(checked) => setNewService({...newService, enabled: checked})}
                id="new-service-enabled"
              />
              <Label htmlFor="new-service-enabled">Service Enabled</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={addNewService}>Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 