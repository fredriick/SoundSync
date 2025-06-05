import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoreHorizontal, Search, UserPlus, Filter } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type UserRole = "user" | "artist" | "editor" | "admin" | "suspended";
type UserStatus = "active" | "inactive" | "pending" | "suspended";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  joinDate: string;
  lastActive: string;
  totalPlays?: number;
  country?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");

  useEffect(() => {
    // Simulate fetching users data
    const timer = setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: "u1",
          name: "Alex Johnson",
          email: "alex.johnson@example.com",
          role: "admin",
          status: "active",
          avatarUrl: "https://i.pravatar.cc/150?u=a1",
          joinDate: "2022-01-10",
          lastActive: "2023-06-15T08:30:00",
          totalPlays: 2547,
          country: "United States"
        },
        {
          id: "u2",
          name: "Maria Garcia",
          email: "maria.g@example.com",
          role: "artist",
          status: "active",
          avatarUrl: "https://i.pravatar.cc/150?u=a2",
          joinDate: "2022-02-18",
          lastActive: "2023-06-14T14:22:00",
          totalPlays: 12890,
          country: "Spain"
        },
        {
          id: "u3",
          name: "John Smith",
          email: "john.smith@example.com",
          role: "user",
          status: "active",
          avatarUrl: "https://i.pravatar.cc/150?u=a3",
          joinDate: "2022-03-05",
          lastActive: "2023-06-15T10:15:00",
          totalPlays: 867,
          country: "Canada"
        },
        {
          id: "u4",
          name: "Priya Patel",
          email: "priya.p@example.com",
          role: "editor",
          status: "active",
          avatarUrl: "https://i.pravatar.cc/150?u=a4",
          joinDate: "2022-04-12",
          lastActive: "2023-06-15T07:45:00",
          totalPlays: 1432,
          country: "India"
        },
        {
          id: "u5",
          name: "Mohammed Ali",
          email: "m.ali@example.com",
          role: "user",
          status: "inactive",
          avatarUrl: "https://i.pravatar.cc/150?u=a5",
          joinDate: "2022-05-20",
          lastActive: "2023-05-30T16:20:00",
          totalPlays: 394,
          country: "Egypt"
        },
        {
          id: "u6",
          name: "Emma Wilson",
          email: "emma.w@example.com",
          role: "user",
          status: "pending",
          avatarUrl: "https://i.pravatar.cc/150?u=a6",
          joinDate: "2023-06-01",
          lastActive: "2023-06-02T11:10:00",
          totalPlays: 12,
          country: "United Kingdom"
        },
        {
          id: "u7",
          name: "Carlos Rodriguez",
          email: "carlos.r@example.com",
          role: "artist",
          status: "active",
          avatarUrl: "https://i.pravatar.cc/150?u=a7",
          joinDate: "2022-08-15",
          lastActive: "2023-06-14T20:30:00",
          totalPlays: 8763,
          country: "Mexico"
        },
        {
          id: "u8",
          name: "Jana Novak",
          email: "jana.n@example.com",
          role: "user",
          status: "suspended",
          avatarUrl: "https://i.pravatar.cc/150?u=a8", 
          joinDate: "2022-09-22",
          lastActive: "2023-05-10T13:45:00",
          totalPlays: 523,
          country: "Czech Republic"
        }
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply filters whenever search query, role filter or status filter changes
    let results = users;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    // Apply role filter
    if (roleFilter !== "all") {
      results = results.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(results);
  }, [searchQuery, roleFilter, statusFilter, users]);

  const getUserStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-500/80">Active</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-500/80">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-500 hover:bg-red-500/80">Suspended</Badge>;
      default:
        return null;
    }
  };

  const getUserRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500 hover:bg-purple-500/80">Admin</Badge>;
      case "artist":
        return <Badge className="bg-blue-500 hover:bg-blue-500/80">Artist</Badge>;
      case "editor":
        return <Badge className="bg-cyan-500 hover:bg-cyan-500/80">Editor</Badge>;
      case "user":
        return <Badge variant="secondary">User</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Check if the date string has time information (contains 'T')
      if (dateString.includes('T')) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
      } else {
        // If it's just a date without time
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date);
      }
    } catch (error) {
      return dateString; // Return the original string if parsing fails
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const saveUserChanges = () => {
    if (!selectedUser) return;
    
    setUsers(prev => 
      prev.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      )
    );
    
    setIsEditDialogOpen(false);
    toast({
      title: "User updated",
      description: `${selectedUser.name}'s information has been updated successfully`,
    });
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'suspended' as UserStatus, role: 'suspended' as UserRole } 
          : user
      )
    );
    
    toast({
      title: "User suspended",
      description: "The user has been suspended successfully",
    });
  };

  const handleActivateUser = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'active' as UserStatus, role: user.role === 'suspended' ? 'user' as UserRole : user.role } 
          : user
      )
    );
    
    toast({
      title: "User activated",
      description: "The user has been activated successfully",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Manage users, roles and permissions
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <Label className="text-xs">Role</Label>
                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | "all")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <Label className="text-xs">Status</Label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UserStatus | "all")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getUserRoleBadge(user.role)}</TableCell>
                  <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                  <TableCell>{formatDate(user.joinDate)}</TableCell>
                  <TableCell>{formatDate(user.lastActive)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit details</DropdownMenuItem>
                        <DropdownMenuItem>View activity</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === 'suspended' ? (
                          <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                            Activate user
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            Suspend user
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                  <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {selectedUser.id}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({...selectedUser, role: value as UserRole})}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedUser.status}
                  onValueChange={(value) => setSelectedUser({...selectedUser, status: value as UserStatus})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedUser.country && (
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={selectedUser.country}
                    onChange={(e) => setSelectedUser({...selectedUser, country: e.target.value})}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveUserChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 