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
import { toast } from "@/components/ui/use-toast";
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  UserCog,
  Shield,
  Ban,
  Loader2,
  Mail,
  User as UserIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserRole = "user" | "producer" | "admin";

type UserStatus = "active" | "suspended" | "pending";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  avatarUrl?: string;
  tracksCount: number;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    role: "user" as UserRole,
    status: "active" as UserStatus,
  });
  
  // Fetch users data - in a real app, this would be an API call
  useEffect(() => {
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "user",
          status: "active",
          joinDate: "2023-01-15",
          avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=John",
          tracksCount: 5
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          role: "producer",
          status: "active",
          joinDate: "2023-02-21",
          avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=Jane",
          tracksCount: 12
        },
        {
          id: "3",
          name: "Michael Johnson",
          email: "michael.johnson@example.com",
          role: "admin",
          status: "active",
          joinDate: "2022-11-05",
          avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=Michael",
          tracksCount: 0
        },
        {
          id: "4",
          name: "Emily Williams",
          email: "emily.williams@example.com",
          role: "user",
          status: "suspended",
          joinDate: "2023-03-10",
          avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=Emily",
          tracksCount: 3
        },
        {
          id: "5",
          name: "Robert Brown",
          email: "robert.brown@example.com",
          role: "producer",
          status: "pending",
          joinDate: "2023-04-18",
          avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=Robert",
          tracksCount: 8
        }
      ];
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle opening edit dialog
  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setEditForm({
      role: user.role,
      status: user.status
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle opening details dialog
  const handleViewDetails = (user: User) => {
    setCurrentUser(user);
    setIsDetailsDialogOpen(true);
  };
  
  // Handle form change
  const handleFormChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle saving edited user
  const saveEditedUser = () => {
    if (!currentUser) return;
    
    // Update user in the list
    setUsers(prev => 
      prev.map(user => 
        user.id === currentUser.id 
          ? { 
              ...user, 
              role: editForm.role, 
              status: editForm.status
            } 
          : user
      )
    );
    
    // Show success toast
    toast({
      title: "User Updated",
      description: `${currentUser.name}'s information has been updated.`,
    });
    
    // Close dialog
    setIsEditDialogOpen(false);
  };
  
  // Handle messaging a user
  const handleMessage = (user: User) => {
    // In a real app, this would open a message composer or send to a messaging page
    toast({
      title: "Message Feature",
      description: `Messaging feature for ${user.name} would be implemented here.`,
    });
  };
  
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "producer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
      </div>
      
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users by name or email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Users table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Tracks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-muted-foreground">Loading users...</p>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No users found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>{user.tracksCount}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                          <UserIcon className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Role/Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMessage(user)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update role and status for {currentUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={editForm.role} 
                onValueChange={(value) => handleFormChange("role", value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-2" />
                      User
                    </div>
                  </SelectItem>
                  <SelectItem value="producer">
                    <div className="flex items-center">
                      <UserCog className="h-4 w-4 mr-2" />
                      Producer
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={editForm.status} 
                onValueChange={(value) => handleFormChange("status", value as UserStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* User Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {currentUser?.name}.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
                  <p className="mt-1">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <p className="mt-1">{currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Join Date</h4>
                  <p className="mt-1">{new Date(currentUser.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Tracks Uploaded</h4>
                  <p className="mt-1">{currentUser.tracksCount}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium text-muted-foreground">User Activity</h4>
                <div className="mt-2 p-3 rounded-md bg-muted">
                  <p className="text-sm">Activity statistics would be displayed here.</p>
                  <p className="text-sm text-muted-foreground">Last login: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => { 
              setIsDetailsDialogOpen(false);
              if (currentUser) handleEdit(currentUser);
            }}>
              Edit User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 