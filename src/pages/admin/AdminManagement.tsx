import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  UserPlus,
  Shield,
  ShieldAlert,
  Ban,
  Loader2,
  Mail,
  AlertTriangle,
  CheckCircle2,
  User as UserIcon,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define admin user type
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  permissions: string[];
  status: "active" | "inactive";
  lastLogin: string;
  avatar?: string;
  createdAt: string;
}

// Generate mock admin users
const generateMockAdmins = (): AdminUser[] => {
  return [
    {
      id: "1",
      name: "Super Admin",
      email: "superadmin@soundsync.com",
      role: "superadmin",
      permissions: ["all"],
      status: "active",
      lastLogin: new Date().toISOString(),
      createdAt: "2023-01-15T09:00:00Z",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: "2",
      name: "Admin User",
      email: "admin@soundsync.com",
      role: "admin",
      permissions: ["users", "content", "marketplace"],
      status: "active",
      lastLogin: "2023-09-02T14:20:00Z",
      createdAt: "2023-02-20T11:00:00Z",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: "3",
      name: "Content Manager",
      email: "content@soundsync.com",
      role: "admin",
      permissions: ["content", "marketplace"],
      status: "active",
      lastLogin: "2023-09-01T09:15:00Z",
      createdAt: "2023-03-10T10:30:00Z",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: "4",
      name: "User Manager",
      email: "users@soundsync.com",
      role: "admin",
      permissions: ["users", "sellers"],
      status: "active",
      lastLogin: "2023-08-29T11:45:00Z",
      createdAt: "2023-04-05T08:15:00Z",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: "5",
      name: "Marketplace Admin",
      email: "marketplace@soundsync.com",
      role: "admin",
      permissions: ["marketplace", "content"],
      status: "active",
      lastLogin: "2023-08-15T16:30:00Z",
      createdAt: "2023-05-20T13:45:00Z",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg"
    }
  ];
};

export default function AdminManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);
  
  // New admin template
  const [newAdmin, setNewAdmin] = useState<Omit<AdminUser, 'id' | 'lastLogin' | 'createdAt'>>({
    name: "",
    email: "",
    role: "admin",
    permissions: [],
    status: "active",
  });
  
  // Permission options
  const permissionOptions = [
    { value: "users", label: "User Management" },
    { value: "sellers", label: "Seller Management" },
    { value: "content", label: "Content Management" },
    { value: "marketplace", label: "Marketplace Management" },
    { value: "settings", label: "System Settings" },
  ];

  // Load admin users
  useEffect(() => {
    const loadAdmins = async () => {
      setIsLoading(true);
      
      try {
        // Check for superadmin login status in localStorage
        const currentUser = localStorage.getItem('mockUser');
        let parsedUser = null;
        
        if (currentUser) {
          parsedUser = JSON.parse(currentUser);
        }
        
        // Get admin users from localStorage or create defaults
        const storedAdmins = localStorage.getItem("adminUsers");
        
        if (storedAdmins) {
          const parsedAdmins = JSON.parse(storedAdmins);
          
          // Ensure there's always at least one superadmin
          const hasSuperAdmin = parsedAdmins.some(admin => 
            admin.role === "superadmin" && admin.status === "active"
          );
          
          if (!hasSuperAdmin) {
            const defaultAdmins = generateMockAdmins();
            const superAdmin = defaultAdmins.find(admin => admin.role === "superadmin");
            
            if (superAdmin) {
              parsedAdmins.push(superAdmin);
              localStorage.setItem("adminUsers", JSON.stringify(parsedAdmins));
            }
          }
          
          setAdmins(parsedAdmins);
        } else {
          const mockAdmins = generateMockAdmins();
          setAdmins(mockAdmins);
          localStorage.setItem("adminUsers", JSON.stringify(mockAdmins));
        }
      } catch (error) {
        console.error("Error loading admin users:", error);
        // Set default admins as fallback
        const mockAdmins = generateMockAdmins();
        setAdmins(mockAdmins);
        localStorage.setItem("adminUsers", JSON.stringify(mockAdmins));
      } finally {
        setIsLoading(false);
      }
    };
    
    // Simulate API call
    setTimeout(loadAdmins, 1000);
  }, []);
  
  // Save admins to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && admins.length > 0) {
      localStorage.setItem("adminUsers", JSON.stringify(admins));
    }
  }, [admins, isLoading]);

  // Filter admins based on search query
  const filteredAdmins = admins.filter(admin => {
    const searchString = searchQuery.toLowerCase();
    return (
      admin.name.toLowerCase().includes(searchString) ||
      admin.email.toLowerCase().includes(searchString) ||
      admin.role.toLowerCase().includes(searchString)
    );
  });

  // Handle edit admin
  const handleEditAdmin = (admin: AdminUser) => {
    setEditingAdmin({...admin});
    setIsEditDialogOpen(true);
  };

  // Save edited admin
  const saveEditedAdmin = () => {
    if (editingAdmin) {
      setAdmins(prev => 
        prev.map(admin => 
          admin.id === editingAdmin.id ? editingAdmin : admin
        )
      );
      
      toast({
        title: "Admin updated",
        description: `${editingAdmin.name}'s details have been updated successfully.`,
      });
      
      setIsEditDialogOpen(false);
      setEditingAdmin(null);
    }
  };

  // Handle create new admin
  const handleAddAdmin = () => {
    // Validate form
    if (!newAdmin.name || !newAdmin.email) {
      toast({
        title: "Missing information",
        description: "Please provide both name and email for the new administrator.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate permissions for admin role
    if (newAdmin.role === "admin" && newAdmin.permissions.length === 0) {
      toast({
        title: "No permissions selected",
        description: "Please select at least one permission for this administrator.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdmin.email)) {
      toast({
        title: "Invalid email",
        description: "Please provide a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    // Check for duplicate email
    const isDuplicateEmail = admins.some(admin => 
      admin.email.toLowerCase() === newAdmin.email.toLowerCase()
    );
    
    if (isDuplicateEmail) {
      toast({
        title: "Email already exists",
        description: "An administrator with this email already exists.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new admin
    const newAdminComplete: AdminUser = {
      ...newAdmin as any,
      id: `admin-${Date.now()}`,
      lastLogin: "Never",
      createdAt: new Date().toISOString(),
      // Ensure superadmins have "all" permission
      permissions: newAdmin.role === "superadmin" ? ["all"] : newAdmin.permissions
    };
    
    setAdmins(prev => [...prev, newAdminComplete]);
    
    toast({
      title: `${newAdmin.role === "superadmin" ? "Super Admin" : "Admin"} created`,
      description: `${newAdminComplete.name} has been added successfully.`,
    });
    
    setIsAddDialogOpen(false);
    setNewAdmin({
      name: "",
      email: "",
      role: "admin",
      permissions: [],
      status: "active",
    });
  };

  // Handle delete admin
  const openDeleteDialog = (admin: AdminUser) => {
    setAdminToDelete(admin);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAdmin = () => {
    if (adminToDelete) {
      // Prevent deleting the last superadmin
      const remainingSuperadmins = admins.filter(
        admin => admin.role === 'superadmin' && 
                admin.id !== adminToDelete.id && 
                admin.status === "active"
      ).length;

      if (adminToDelete.role === 'superadmin' && remainingSuperadmins === 0) {
        toast({
          title: "Cannot delete",
          description: "Cannot delete the last active superadmin. Please create another superadmin first.",
          variant: "destructive"
        });
        setIsDeleteDialogOpen(false);
        setAdminToDelete(null);
        return;
      }
      
      // If the user is a superadmin and we're about to delete them, warn
      const currentUser = localStorage.getItem('mockUser');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        if (parsedUser.email === adminToDelete.email) {
          toast({
            title: "Warning",
            description: "You are deleting your own admin account. You may lose access to the system.",
            variant: "destructive"
          });
        }
      }

      setAdmins(prev => prev.filter(admin => admin.id !== adminToDelete.id));
      
      toast({
        title: "Admin deleted",
        description: `${adminToDelete.name} has been removed successfully.`,
      });
      
      setIsDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  // Toggle admin status
  const toggleAdminStatus = (adminId: string) => {
    setAdmins(prev => 
      prev.map(admin => {
        if (admin.id === adminId) {
          const newStatus = admin.status === "active" ? "inactive" : "active";
          
          toast({
            title: `Admin ${newStatus}`,
            description: `${admin.name}'s account is now ${newStatus}.`,
          });
          
          return { ...admin, status: newStatus };
        }
        return admin;
      })
    );
  };

  // Handle permission change
  const handlePermissionChange = (admin: AdminUser, permission: string, isChecked: boolean) => {
    if (admin.role === 'superadmin') {
      return ["all"]; // Superadmins always have all permissions
    }
    
    const updatedPermissions = isChecked
      ? [...admin.permissions, permission]
      : admin.permissions.filter(p => p !== permission);
    
    return updatedPermissions;
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    if (dateString === "Never") return "Never";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get current user information
  const getCurrentUserEmail = () => {
    const currentUser = localStorage.getItem('mockUser');
    if (currentUser) {
      try {
        const parsedUser = JSON.parse(currentUser);
        return parsedUser.email || '';
      } catch (e) {
        return '';
      }
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Management</h2>
        <p className="text-muted-foreground">
          Manage administrator accounts and permissions for SoundSync platform
        </p>
      </div>
      
      {/* Current User Indicator */}
      <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between border">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-500" />
          <span className="text-sm font-medium">You are logged in as a Superadmin with full management capabilities</span>
        </div>
        <Badge className="bg-purple-500 hover:bg-purple-600">Superadmin</Badge>
      </div>
      
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search admins..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Add Admin
        </Button>
      </div>
      
      {/* Admins Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading administrators...</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Admin</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No administrators found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin) => {
                  const isCurrentUser = admin.email === getCurrentUserEmail();
                  return (
                    <TableRow key={admin.id} className={isCurrentUser ? "bg-muted/30" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {admin.avatar && <AvatarImage src={admin.avatar} alt={admin.name} />}
                            <AvatarFallback>
                              {admin.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {admin.name}
                              {isCurrentUser && (
                                <Badge variant="outline" className="ml-1 text-xs">You</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{admin.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {admin.role === "superadmin" ? (
                          <Badge className="bg-purple-500 hover:bg-purple-600 flex items-center gap-1 w-fit">
                            <ShieldAlert className="h-3 w-3" />
                            Super Admin
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1 w-fit">
                            <Shield className="h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {admin.role === "superadmin" ? (
                            <Badge variant="outline" className="border-purple-500 text-purple-500">
                              All Permissions
                            </Badge>
                          ) : admin.permissions.length === 0 ? (
                            <span className="text-sm text-muted-foreground italic">
                              No permissions assigned
                            </span>
                          ) : (
                            admin.permissions.map(permission => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permissionOptions.find(p => p.value === permission)?.label || permission}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {admin.status === "active" ? (
                          <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600 flex items-center gap-1 w-fit">
                            <Ban className="h-3 w-3" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {admin.lastLogin === "Never" ? (
                          <span className="text-sm text-muted-foreground">Never</span>
                        ) : (
                          formatDate(admin.lastLogin)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditAdmin(admin)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                navigator.clipboard.writeText(admin.email);
                                toast({
                                  title: "Email copied",
                                  description: "Admin email address copied to clipboard",
                                });
                              }}
                              className="cursor-pointer"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => toggleAdminStatus(admin.id)}
                              className="cursor-pointer"
                              disabled={admin.role === "superadmin" && 
                                        admin.status === "active" && 
                                        admins.filter(a => a.role === "superadmin" && a.status === "active" && a.id !== admin.id).length === 0}
                            >
                              {admin.status === "active" ? (
                                <>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(admin)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                              disabled={admin.role === "superadmin" && 
                                        admins.filter(a => a.role === "superadmin" && a.status === "active" && a.id !== admin.id).length === 0}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Administrator</DialogTitle>
            <DialogDescription>
              Update administrator details and permissions
            </DialogDescription>
          </DialogHeader>
          
          {editingAdmin && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingAdmin.name}
                  onChange={(e) => setEditingAdmin({...editingAdmin, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editingAdmin.email}
                  onChange={(e) => setEditingAdmin({...editingAdmin, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={editingAdmin.role}
                  onValueChange={(value: any) => {
                    // If changing to superadmin, give all permissions
                    const newPermissions = value === "superadmin" ? ["all"] : 
                      value === "admin" && editingAdmin.role === "superadmin" ? 
                        // If downgrading from superadmin to admin, give default permissions
                        ["users", "content"] : editingAdmin.permissions;
                    setEditingAdmin({...editingAdmin, role: value, permissions: newPermissions});
                  }}
                  disabled={editingAdmin.role === "superadmin" && 
                            admins.filter(a => a.role === "superadmin" && a.id !== editingAdmin.id).length === 0}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                {editingAdmin.role === "superadmin" && 
                  admins.filter(a => a.role === "superadmin" && a.id !== editingAdmin.id).length === 0 && (
                  <div className="col-span-3 col-start-2 text-xs text-amber-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Cannot change: This is the only active superadmin
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Permissions
                </Label>
                <div className="col-span-3 space-y-2">
                  {editingAdmin.role === "superadmin" ? (
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded text-sm text-muted-foreground">
                      <div className="font-medium text-purple-800 dark:text-purple-300 mb-1 flex items-center gap-1">
                        <ShieldAlert className="h-4 w-4" />
                        Super Admin Privileges
                      </div>
                      Superadmins automatically have access to all system permissions and features
                    </div>
                  ) : (
                    permissionOptions.map(permission => (
                      <div key={permission.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`permission-${permission.value}`}
                          checked={editingAdmin.permissions.includes(permission.value)}
                          onCheckedChange={(checked) => {
                            const updatedPermissions = handlePermissionChange(
                              editingAdmin, 
                              permission.value, 
                              checked as boolean
                            );
                            setEditingAdmin({...editingAdmin, permissions: updatedPermissions || []});
                          }}
                        />
                        <Label 
                          htmlFor={`permission-${permission.value}`}
                          className="text-sm font-normal"
                        >
                          {permission.label}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="status"
                    checked={editingAdmin.status === "active"}
                    onCheckedChange={(checked) => 
                      setEditingAdmin({...editingAdmin, status: checked ? "active" : "inactive"})
                    }
                    disabled={editingAdmin.role === "superadmin" && 
                              admins.filter(a => a.role === "superadmin" && a.status === "active" && a.id !== editingAdmin.id).length === 0}
                  />
                  <Label htmlFor="status" className="text-sm font-normal">
                    {editingAdmin.status === "active" ? "Active" : "Inactive"}
                  </Label>
                  {editingAdmin.role === "superadmin" && 
                    admins.filter(a => a.role === "superadmin" && a.status === "active" && a.id !== editingAdmin.id).length === 0 && 
                    editingAdmin.status === "active" && (
                    <span className="text-xs text-amber-500 flex items-center gap-1 ml-2">
                      <AlertTriangle className="h-3 w-3" />
                      Cannot deactivate the only superadmin
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveEditedAdmin}
              disabled={!editingAdmin?.name || !editingAdmin?.email}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Admin Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Administrator</DialogTitle>
            <DialogDescription>
              Create a new administrator account for the SoundSync platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-name" className="text-right">
                Name
              </Label>
              <Input
                id="new-name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                className="col-span-3"
                placeholder="Full name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-email" className="text-right">
                Email
              </Label>
              <Input
                id="new-email"
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                className="col-span-3"
                placeholder="email@soundsync.com"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-role" className="text-right">
                Role
              </Label>
              <Select
                value={newAdmin.role}
                onValueChange={(value: any) => {
                  // If superadmin, give all permissions
                  const newPermissions = value === "superadmin" ? ["all"] : [];
                  setNewAdmin({...newAdmin, role: value, permissions: newPermissions});
                }}
              >
                <SelectTrigger className="col-span-3" id="new-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Permissions
              </Label>
              <div className="col-span-3 space-y-2">
                {newAdmin.role === "superadmin" ? (
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded text-sm text-muted-foreground">
                    <div className="font-medium text-purple-800 dark:text-purple-300 mb-1 flex items-center gap-1">
                      <ShieldAlert className="h-4 w-4" />
                      Super Admin Privileges
                    </div>
                    Superadmins automatically have access to all system permissions and features
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground mb-2">
                      Select which permissions to grant this administrator:
                    </div>
                    {permissionOptions.map(permission => (
                      <div key={permission.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`new-permission-${permission.value}`}
                          checked={newAdmin.permissions.includes(permission.value)}
                          onCheckedChange={(checked) => {
                            const updatedPermissions = checked 
                              ? [...newAdmin.permissions, permission.value]
                              : newAdmin.permissions.filter(p => p !== permission.value);
                            setNewAdmin({...newAdmin, permissions: updatedPermissions});
                          }}
                        />
                        <Label 
                          htmlFor={`new-permission-${permission.value}`}
                          className="text-sm font-normal"
                        >
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-status" className="text-right">
                Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="new-status"
                  checked={newAdmin.status === "active"}
                  onCheckedChange={(checked) => 
                    setNewAdmin({...newAdmin, status: checked ? "active" : "inactive"})
                  }
                />
                <Label htmlFor="new-status" className="text-sm font-normal">
                  {newAdmin.status === "active" ? "Active" : "Inactive"}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddAdmin}
              disabled={!newAdmin.name || !newAdmin.email || (newAdmin.role === "admin" && newAdmin.permissions.length === 0)}
            >
              {newAdmin.role === "superadmin" ? "Create Super Admin" : "Create Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Administrator
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the administrator account.
            </DialogDescription>
          </DialogHeader>
          
          {adminToDelete && (
            <div className="py-4 flex items-center gap-3">
              <Avatar>
                {adminToDelete.avatar && <AvatarImage src={adminToDelete.avatar} alt={adminToDelete.name} />}
                <AvatarFallback>
                  {adminToDelete.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{adminToDelete.name}</div>
                <div className="text-sm text-muted-foreground">{adminToDelete.email}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteAdmin}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Missing Checkbox component, let's create a proper one
function Checkbox({ 
  id, 
  checked, 
  onCheckedChange,
  disabled
}: { 
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        disabled={disabled}
        className={`h-4 w-4 rounded border ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
          border-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beatforge-500
          ${checked ? 'bg-beatforge-500 border-beatforge-500' : 'bg-background'}`}
      />
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute h-3 w-3 text-white pointer-events-none"
          style={{ left: '2px', top: '2px' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
  );
} 
 
 
 
 
 
 
 
 
 