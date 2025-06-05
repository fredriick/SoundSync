import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { User, Bell, Lock, CreditCard, UserCircle, Edit2, Upload, Camera } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  phoneNumber: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
}

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize profile state from localStorage or with default values
  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      return {
        name: userData.name || 'John Doe',
        email: userData.email || 'john.doe@example.com',
        avatar: userData.avatar || 'https://i.pravatar.cc/150?u=john.doe@example.com',
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || '',
        phoneNumber: userData.phoneNumber || '',
        emailNotifications: userData.emailNotifications !== undefined ? userData.emailNotifications : true,
        marketingEmails: userData.marketingEmails !== undefined ? userData.marketingEmails : false,
      };
    }
    
    return {
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://i.pravatar.cc/150?u=john.doe@example.com',
      bio: '',
      location: '',
      website: '',
      phoneNumber: '',
      emailNotifications: true,
      marketingEmails: false,
    };
  });
  
  const [editableProfile, setEditableProfile] = useState<UserProfile>(profile);
  
  // Check if user is authenticated
  useEffect(() => {
    const mockUserRaw = localStorage.getItem('mockUser');
    if (mockUserRaw) {
      const mockUser = JSON.parse(mockUserRaw);
      if (!mockUser.isSignedIn) {
        navigate('/sign-in', { replace: true });
      }
    } else {
      navigate('/sign-in', { replace: true });
    }
  }, [navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setEditableProfile(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setEditableProfile(prev => ({
            ...prev,
            avatar: event.target?.result as string
          }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setProfile(editableProfile);
      setIsEditing(false);
      setIsSaving(false);
      
      // Update localStorage
      const mockUserRaw = localStorage.getItem('mockUser');
      if (mockUserRaw) {
        const mockUser = JSON.parse(mockUserRaw);
        const updatedUser = {
          ...mockUser,
          name: editableProfile.name,
          email: editableProfile.email,
          avatar: editableProfile.avatar,
          bio: editableProfile.bio,
          location: editableProfile.location,
          website: editableProfile.website,
          phoneNumber: editableProfile.phoneNumber,
          emailNotifications: editableProfile.emailNotifications,
          marketingEmails: editableProfile.marketingEmails,
        };
        localStorage.setItem('mockUser', JSON.stringify(updatedUser));
        
        // Dispatch a custom event to notify other components of the change
        // This is an alternative to page refresh
        window.dispatchEvent(new Event('mockUserUpdated'));
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    }, 1000);
  };
  
  const handleCancel = () => {
    setEditableProfile(profile);
    setIsEditing(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 space-y-6">
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div 
                    className="relative w-24 h-24 mb-4 group rounded-full border-2 border-border"
                    style={{
                      background: `url(${isEditing ? editableProfile.avatar : profile.avatar}) center/cover no-repeat, #374151`
                    }}
                  >
                    {isEditing && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={triggerFileInput}
                      >
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4" 
                    onClick={() => {
                      setIsEditing(true);
                      setActiveTab("general");
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  
                  {/* Hidden file input for image upload */}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </CardContent>
              </Card>
              
              <div className="hidden md:block">
                <div className="space-y-2">
                  <div
                    className={`flex items-center px-3 py-2 rounded-md cursor-pointer
                    ${activeTab === "general" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}
                    `}
                    onClick={() => setActiveTab("general")}
                  >
                    <UserCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">General</span>
                  </div>
                  <div
                    className={`flex items-center px-3 py-2 rounded-md cursor-pointer
                    ${activeTab === "notifications" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}
                    `}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Notifications</span>
                  </div>
                  <div
                    className={`flex items-center px-3 py-2 rounded-md cursor-pointer
                    ${activeTab === "security" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}
                    `}
                    onClick={() => setActiveTab("security")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Security</span>
                  </div>
                  <div
                    className={`flex items-center px-3 py-2 rounded-md cursor-pointer
                    ${activeTab === "billing" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}
                    `}
                    onClick={() => setActiveTab("billing")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Billing</span>
                  </div>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="md:hidden">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="general">
                    <UserCircle className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Lock className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="billing">
                    <CreditCard className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </aside>
            
            <div className="flex-1">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>
                        {activeTab === "general" && "General Information"}
                        {activeTab === "notifications" && "Notifications"}
                        {activeTab === "security" && "Security"}
                        {activeTab === "billing" && "Billing"}
                      </CardTitle>
                      <CardDescription>
                        {activeTab === "general" && "Manage your profile information"}
                        {activeTab === "notifications" && "Manage your notification preferences"}
                        {activeTab === "security" && "Manage your account security"}
                        {activeTab === "billing" && "Manage your payment methods and history"}
                      </CardDescription>
                    </div>
                    {!isEditing && activeTab === "general" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {activeTab === "general" && (
                    <div className="space-y-6">
                      {isEditing ? (
                        // Edit mode
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input 
                                id="name" 
                                name="name" 
                                value={editableProfile.name} 
                                onChange={handleInputChange} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                value={editableProfile.email} 
                                onChange={handleInputChange} 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea 
                              id="bio" 
                              name="bio" 
                              value={editableProfile.bio} 
                              onChange={handleInputChange} 
                              placeholder="Tell us about yourself"
                              rows={4}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input 
                                id="location" 
                                name="location" 
                                value={editableProfile.location} 
                                onChange={handleInputChange} 
                                placeholder="City, Country"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phoneNumber">Phone Number</Label>
                              <Input 
                                id="phoneNumber" 
                                name="phoneNumber" 
                                value={editableProfile.phoneNumber} 
                                onChange={handleInputChange} 
                                placeholder="+1 (123) 456-7890"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input 
                              id="website" 
                              name="website" 
                              value={editableProfile.website} 
                              onChange={handleInputChange} 
                              placeholder="https://yourwebsite.com"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Profile Picture</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="avatar">Image URL</Label>
                                <Input 
                                  id="avatar" 
                                  name="avatar" 
                                  value={editableProfile.avatar} 
                                  onChange={handleInputChange} 
                                  placeholder="https://example.com/avatar.jpg"
                                />
                                
                                <div 
                                  className="h-20 w-20 mt-2 rounded-full border-2 border-border mx-auto"
                                  style={{
                                    background: `url(${editableProfile.avatar}) center/cover no-repeat, #374151`
                                  }}
                                ></div>
                              </div>
                              <div className="space-y-2">
                                <Label>Or upload an image</Label>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={triggerFileInput}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Image
                                  </Button>
                                  {editableProfile.avatar !== profile.avatar && (
                                    <span className="text-xs text-muted-foreground">
                                      New image selected
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              You can provide an image URL or upload an image from your device
                            </p>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                              <p>{profile.name}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                              <p>{profile.email}</p>
                            </div>
                          </div>
                          
                          {profile.bio && (
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                              <p className="whitespace-pre-line">{profile.bio}</p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profile.location && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                                <p>{profile.location}</p>
                              </div>
                            )}
                            
                            {profile.phoneNumber && (
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                                <p>{profile.phoneNumber}</p>
                              </div>
                            )}
                          </div>
                          
                          {profile.website && (
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                              <a 
                                href={profile.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-beatforge-500 hover:underline"
                              >
                                {profile.website}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch 
                          checked={editableProfile.emailNotifications}
                          onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Marketing Emails</h3>
                          <p className="text-sm text-muted-foreground">Receive marketing emails and promotions</p>
                        </div>
                        <Switch 
                          checked={editableProfile.marketingEmails}
                          onCheckedChange={(checked) => handleSwitchChange('marketingEmails', checked)}
                        />
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-muted-foreground">Change your password to protect your account</p>
                        <Button variant="outline" className="mt-2">Change Password</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        <Button variant="outline" className="mt-2">Enable 2FA</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Sessions</h3>
                        <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                        <Button variant="outline" className="mt-2">View Sessions</Button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "billing" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Payment Methods</h3>
                        <div className="border rounded-md p-4 mt-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-12 bg-gray-100 rounded mr-4 flex items-center justify-center">
                              <span className="text-xs font-medium">VISA</span>
                            </div>
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-sm text-muted-foreground">Expires 12/25</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                        <Button variant="outline" className="mt-2">Add Payment Method</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Billing History</h3>
                        <div className="rounded-md border mt-2">
                          <div className="grid grid-cols-3 p-3 font-medium border-b">
                            <div>Date</div>
                            <div>Description</div>
                            <div className="text-right">Amount</div>
                          </div>
                          <div className="p-4 text-center text-muted-foreground">
                            No billing history available
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                {isEditing && activeTab === "general" && (
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                )}
                {activeTab !== "general" && !isEditing && (
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 