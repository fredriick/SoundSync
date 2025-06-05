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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Link, ExternalLink, Pencil, Trash, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FooterLink {
  id: string;
  title: string;
  url: string;
  description: string;
  isExternal: boolean;
  isActive: boolean;
  group: 'main' | 'legal' | 'social';
  order: number;
}

export default function FooterManagement() {
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<FooterLink | null>(null);
  const [newLink, setNewLink] = useState<Partial<FooterLink>>({
    title: "",
    url: "",
    description: "",
    isExternal: false,
    isActive: true,
    group: 'main',
    order: 0
  });

  useEffect(() => {
    // Load footer links from localStorage or use defaults
    const loadFooterLinks = () => {
      const savedLinks = localStorage.getItem('footerLinks');
      if (savedLinks) {
        try {
          setFooterLinks(JSON.parse(savedLinks));
        } catch (e) {
          console.error("Error parsing footer links", e);
          createDefaultLinks();
        }
      } else {
        createDefaultLinks();
      }
      setIsLoading(false);
    };

    // Set default footer links if none exist
    const createDefaultLinks = () => {
      const defaultLinks: FooterLink[] = [
        {
          id: "1",
          title: "About Us",
          url: "/aboutus",
          description: "Learn about our company and mission",
          isExternal: false,
          isActive: true,
          group: 'main',
          order: 0
        },
        {
          id: "2",
          title: "Contact",
          url: "/contact",
          description: "Get in touch with our team",
          isExternal: false,
          isActive: true,
          group: 'main',
          order: 1
        },
        {
          id: "3",
          title: "Careers",
          url: "/careers",
          description: "Join our team",
          isExternal: false,
          isActive: true,
          group: 'main',
          order: 2
        },
        {
          id: "4",
          title: "Terms of Service",
          url: "/terms",
          description: "Our terms of service",
          isExternal: false,
          isActive: true,
          group: 'legal',
          order: 0
        },
        {
          id: "5",
          title: "Privacy Policy",
          url: "/privacy",
          description: "Our privacy policy",
          isExternal: false,
          isActive: true,
          group: 'legal',
          order: 1
        },
        {
          id: "6",
          title: "Cookie Policy",
          url: "/cookies",
          description: "Our cookie policy",
          isExternal: false,
          isActive: true,
          group: 'legal',
          order: 2
        },
        {
          id: "7",
          title: "Twitter",
          url: "https://twitter.com/soundsync",
          description: "Follow us on Twitter",
          isExternal: true,
          isActive: true,
          group: 'social',
          order: 0
        },
        {
          id: "8",
          title: "Instagram",
          url: "https://instagram.com/soundsync",
          description: "Follow us on Instagram",
          isExternal: true,
          isActive: true,
          group: 'social',
          order: 1
        }
      ];
      
      setFooterLinks(defaultLinks);
      localStorage.setItem('footerLinks', JSON.stringify(defaultLinks));
    };

    // Simulate loading
    setTimeout(loadFooterLinks, 500);
  }, []);

  // Save footer links whenever they change
  useEffect(() => {
    if (!isLoading && footerLinks.length > 0) {
      localStorage.setItem('footerLinks', JSON.stringify(footerLinks));
      
      // Manually dispatch a storage event to notify other tabs/windows
      try {
        const storageEvent = new StorageEvent('storage', {
          key: 'footerLinks',
          newValue: JSON.stringify(footerLinks),
          storageArea: localStorage
        });
        window.dispatchEvent(storageEvent);
      } catch (e) {
        console.error("Error dispatching storage event", e);
      }
    }
  }, [footerLinks, isLoading]);

  const handleEditLink = (link: FooterLink) => {
    setCurrentLink(link);
    setIsEditDialogOpen(true);
  };

  const handleDeleteLink = (link: FooterLink) => {
    setCurrentLink(link);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentLink) {
      setFooterLinks(prev => prev.filter(link => link.id !== currentLink.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Link Deleted",
        description: `"${currentLink.title}" has been removed from the footer.`,
      });
    }
  };

  const saveChanges = () => {
    if (currentLink) {
      setFooterLinks(prev => 
        prev.map(link => link.id === currentLink.id ? currentLink : link)
      );
      setIsEditDialogOpen(false);
      toast({
        title: "Link Updated",
        description: `"${currentLink.title}" has been updated.`,
      });
    }
  };

  const addNewLink = () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Missing Information",
        description: "Please enter a title and URL for the link.",
        variant: "destructive"
      });
      return;
    }

    const newId = (Math.max(...footerLinks.map(link => parseInt(link.id)), 0) + 1).toString();
    const createdLink: FooterLink = {
      id: newId,
      title: newLink.title || "",
      url: newLink.url || "",
      description: newLink.description || "",
      isExternal: newLink.isExternal || false,
      isActive: newLink.isActive !== undefined ? newLink.isActive : true,
      group: newLink.group || 'main',
      order: newLink.order || 0
    };

    setFooterLinks(prev => [...prev, createdLink]);
    setIsAddDialogOpen(false);
    setNewLink({
      title: "",
      url: "",
      description: "",
      isExternal: false,
      isActive: true,
      group: 'main',
      order: 0
    });

    toast({
      title: "Link Added",
      description: `"${createdLink.title}" has been added to the footer.`,
    });
  };

  const toggleLinkActive = (id: string) => {
    setFooterLinks(prev => 
      prev.map(link => 
        link.id === id ? { ...link, isActive: !link.isActive } : link
      )
    );
  };

  const moveLink = (id: string, direction: 'up' | 'down') => {
    const index = footerLinks.findIndex(link => link.id === id);
    if (index === -1) return;

    const link = footerLinks[index];
    const group = link.group;
    const groupLinks = footerLinks.filter(l => l.group === group);
    const groupIndex = groupLinks.findIndex(l => l.id === id);

    if (direction === 'up' && groupIndex > 0) {
      const newOrder = groupLinks[groupIndex - 1].order;
      const prevOrder = link.order;
      
      setFooterLinks(prev => 
        prev.map(l => {
          if (l.id === id) return { ...l, order: newOrder };
          if (l.id === groupLinks[groupIndex - 1].id) return { ...l, order: prevOrder };
          return l;
        })
      );
    } else if (direction === 'down' && groupIndex < groupLinks.length - 1) {
      const newOrder = groupLinks[groupIndex + 1].order;
      const prevOrder = link.order;
      
      setFooterLinks(prev => 
        prev.map(l => {
          if (l.id === id) return { ...l, order: newOrder };
          if (l.id === groupLinks[groupIndex + 1].id) return { ...l, order: prevOrder };
          return l;
        })
      );
    }
  };

  // Sort links by group and order
  const sortedLinks = [...footerLinks].sort((a, b) => {
    if (a.group !== b.group) {
      return a.group.localeCompare(b.group);
    }
    return a.order - b.order;
  });

  // Group links for display
  const groupedLinks = {
    main: sortedLinks.filter(link => link.group === 'main'),
    legal: sortedLinks.filter(link => link.group === 'legal'),
    social: sortedLinks.filter(link => link.group === 'social')
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beatforge-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Footer Management</h2>
          <p className="text-muted-foreground">
            Manage links displayed in the website footer
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Link
        </Button>
      </div>

      {/* Main Links Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Main Navigation Links</h3>
        <Card>
          <LinkTable 
            links={groupedLinks.main}
            onEdit={handleEditLink}
            onDelete={handleDeleteLink}
            onToggleActive={toggleLinkActive}
            onMove={moveLink}
          />
        </Card>
      </div>

      {/* Legal Links Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Legal Links</h3>
        <Card>
          <LinkTable 
            links={groupedLinks.legal}
            onEdit={handleEditLink}
            onDelete={handleDeleteLink}
            onToggleActive={toggleLinkActive}
            onMove={moveLink}
          />
        </Card>
      </div>

      {/* Social Links Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Social Links</h3>
        <Card>
          <LinkTable 
            links={groupedLinks.social}
            onEdit={handleEditLink}
            onDelete={handleDeleteLink}
            onToggleActive={toggleLinkActive}
            onMove={moveLink}
          />
        </Card>
      </div>

      {/* Edit Link Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Footer Link</DialogTitle>
            <DialogDescription>
              Make changes to the footer link details.
            </DialogDescription>
          </DialogHeader>
          {currentLink && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Link Title</Label>
                <Input
                  id="title"
                  value={currentLink.title}
                  onChange={(e) => setCurrentLink({...currentLink, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={currentLink.url}
                  onChange={(e) => setCurrentLink({...currentLink, url: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={currentLink.description}
                  onChange={(e) => setCurrentLink({...currentLink, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="group">Link Group</Label>
                <select 
                  id="group"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={currentLink.group}
                  onChange={(e) => setCurrentLink({...currentLink, group: e.target.value as 'main' | 'legal' | 'social'})}
                >
                  <option value="main">Main Navigation</option>
                  <option value="legal">Legal</option>
                  <option value="social">Social Media</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isExternal" 
                  checked={currentLink.isExternal}
                  onCheckedChange={(checked) => setCurrentLink({...currentLink, isExternal: checked})}
                />
                <Label htmlFor="isExternal">Open in new tab</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  checked={currentLink.isActive}
                  onCheckedChange={(checked) => setCurrentLink({...currentLink, isActive: checked})}
                />
                <Label htmlFor="isActive">Link is active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Link Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this link from the footer?
            </DialogDescription>
          </DialogHeader>
          {currentLink && (
            <div className="py-4">
              <p>
                You are about to delete "<strong>{currentLink.title}</strong>" from the footer.
                This action cannot be undone.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Link Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Footer Link</DialogTitle>
            <DialogDescription>
              Add a new link to the website footer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-title">Link Title*</Label>
              <Input
                id="new-title"
                value={newLink.title}
                onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                placeholder="About Us"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-url">URL*</Label>
              <Input
                id="new-url"
                value={newLink.url}
                onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                placeholder="/about"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                value={newLink.description}
                onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                placeholder="Learn about our company and mission"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-group">Link Group</Label>
              <select 
                id="new-group"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={newLink.group}
                onChange={(e) => setNewLink({...newLink, group: e.target.value as 'main' | 'legal' | 'social'})}
              >
                <option value="main">Main Navigation</option>
                <option value="legal">Legal</option>
                <option value="social">Social Media</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="new-isExternal" 
                checked={newLink.isExternal}
                onCheckedChange={(checked) => setNewLink({...newLink, isExternal: checked})}
              />
              <Label htmlFor="new-isExternal">Open in new tab</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="new-isActive" 
                checked={newLink.isActive !== undefined ? newLink.isActive : true}
                onCheckedChange={(checked) => setNewLink({...newLink, isActive: checked})}
              />
              <Label htmlFor="new-isActive">Link is active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={addNewLink}>Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Card component for styling tables
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {children}
    </div>
  );
}

// Link Table component for reusability
function LinkTable({ 
  links, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onMove
}: { 
  links: FooterLink[], 
  onEdit: (link: FooterLink) => void, 
  onDelete: (link: FooterLink) => void,
  onToggleActive: (id: string) => void,
  onMove: (id: string, direction: 'up' | 'down') => void
}) {
  if (links.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No links in this section yet. Add some links to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>External</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.id}>
            <TableCell className="font-medium">{link.title}</TableCell>
            <TableCell className="font-mono text-sm">
              {link.url.startsWith('http') ? (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  <span>{link.url}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link className="h-3 w-3" />
                  <span>{link.url}</span>
                </div>
              )}
            </TableCell>
            <TableCell>{link.isExternal ? "Yes" : "No"}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={link.isActive} 
                  onCheckedChange={() => onToggleActive(link.id)} 
                  id={`status-${link.id}`}
                />
                <Label htmlFor={`status-${link.id}`} className="cursor-pointer">
                  {link.isActive ? "Active" : "Inactive"}
                </Label>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => onMove(link.id, 'up')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" onClick={() => onMove(link.id, 'down')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" onClick={() => onEdit(link)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => onDelete(link)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 
 
 
 
 
 
 
 
 
 