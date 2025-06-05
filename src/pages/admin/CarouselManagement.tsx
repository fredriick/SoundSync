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
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { 
  Plus, 
  MoreHorizontal, 
  Package, 
  Edit, 
  Trash2,
  Eye,
  Image,
  PlusCircle,
  Trash,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export default function CarouselManagement() {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<CarouselItem | null>(null);
  
  // Initial load of carousel items
  useEffect(() => {
    loadCarouselItems();
  }, []);
  
  // Save carousel items to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && carouselItems.length > 0) {
      localStorage.setItem('carouselItems', JSON.stringify(carouselItems));
    }
  }, [carouselItems, isLoading]);
  
  // Load carousel items from localStorage or use fallback data
  const loadCarouselItems = () => {
    setIsLoading(true);
    // Try to load from localStorage first
    const storedCarouselItems = localStorage.getItem('carouselItems');
    
    if (storedCarouselItems) {
      try {
        const parsedItems = JSON.parse(storedCarouselItems);
        setCarouselItems(parsedItems);
        setIsLoading(false);
      } catch (e) {
        console.error('Error parsing stored carousel items', e);
        createDefaultCarouselItems();
      }
    } else {
      // If no carousel items in localStorage, load default ones
      createDefaultCarouselItems();
    }
    setIsLoading(false);
  };
  
  // Create default carousel items if none are available
  const createDefaultCarouselItems = () => {
    const defaultCarouselItems: CarouselItem[] = [
      {
        id: "1",
        title: "New Beats Collection",
        description: "Check out our latest collection of high-quality beats for your next project",
        imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80",
        linkUrl: "/marketplace",
        isActive: true,
        sortOrder: 1
      },
      {
        id: "2",
        title: "Custom Beat Production",
        description: "Let us create a custom beat tailored to your unique style and vision",
        imageUrl: "https://images.unsplash.com/photo-1578598336145-527623de0fcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80",
        linkUrl: "/services",
        isActive: true,
        sortOrder: 2
      },
      {
        id: "3",
        title: "Summer Sale - 30% Off",
        description: "Limited time offer on all beats in our exclusive summer collection",
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80",
        linkUrl: "/marketplace?category=featured",
        isActive: false,
        sortOrder: 3
      }
    ];
    
    setCarouselItems(defaultCarouselItems);
    localStorage.setItem('carouselItems', JSON.stringify(defaultCarouselItems));
    
    toast({
      title: "Default Carousel Items Loaded",
      description: "Default carousel items have been loaded successfully.",
    });
  };

  // Filter carousel items based on search query
  const filteredItems = carouselItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form field changes
  const handleFormChange = (field: string, value: any) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Open edit dialog
  const handleEditItem = (item: CarouselItem) => {
    setCurrentItem(item);
    setEditDialogOpen(true);
  };
  
  // Open delete dialog
  const handleDeleteItem = (item: CarouselItem) => {
    setCurrentItem(item);
    setDeleteDialogOpen(true);
  };
  
  // Save edited carousel item
  const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentItem) return;
    
    const updatedItems = editDialogOpen
      ? carouselItems.map(item => item.id === currentItem.id ? currentItem : item)
      : [...carouselItems, currentItem];
    
    setCarouselItems(updatedItems);
    localStorage.setItem('carouselItems', JSON.stringify(updatedItems));
    
    toast({
      title: editDialogOpen ? "Item Updated" : "Item Added",
      description: `The carousel item was successfully ${editDialogOpen ? "updated" : "added"}.`,
    });
    
    setEditDialogOpen(false);
    setAddDialogOpen(false);
  };
  
  // Add new carousel item
  const handleAddItem = () => {
    setCurrentItem({
      id: Date.now().toString(),
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "/marketplace",
      isActive: true,
      sortOrder: carouselItems.length + 1
    });
    setAddDialogOpen(true);
  };
  
  // Delete carousel item
  const confirmDeleteItem = () => {
    if (!currentItem) return;
    
    const updatedItems = carouselItems.filter(item => item.id !== currentItem.id);
    setCarouselItems(updatedItems);
    localStorage.setItem('carouselItems', JSON.stringify(updatedItems));
    
    toast({
      title: "Item Deleted",
      description: `The carousel item was successfully deleted.`,
    });
    
    setDeleteDialogOpen(false);
  };
  
  // Open preview dialog
  const handlePreviewItem = (item: CarouselItem) => {
    setCurrentItem(item);
    setPreviewDialogOpen(true);
  };
  
  // Toggle carousel item active status
  const handleToggleActive = (id: string) => {
    setCarouselItems(carouselItems.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    
    const newItems = [...carouselItems];
    const currentOrder = newItems[index].sortOrder;
    const prevOrder = newItems[index - 1].sortOrder;
    
    newItems[index].sortOrder = prevOrder;
    newItems[index - 1].sortOrder = currentOrder;
    
    setCarouselItems([...newItems].sort((a, b) => a.sortOrder - b.sortOrder));
  };

  const handleMoveDown = (index: number) => {
    if (index >= carouselItems.length - 1) return;
    
    const newItems = [...carouselItems];
    const currentOrder = newItems[index].sortOrder;
    const nextOrder = newItems[index + 1].sortOrder;
    
    newItems[index].sortOrder = nextOrder;
    newItems[index + 1].sortOrder = currentOrder;
    
    setCarouselItems([...newItems].sort((a, b) => a.sortOrder - b.sortOrder));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Home Page Carousel</h2>
          <p className="text-muted-foreground">Manage carousel items shown on the home page</p>
        </div>
        <div className="space-x-2">
          <Button onClick={loadCarouselItems} variant="outline">
            Reset Carousel
          </Button>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>
      
      {/* Carousel items table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <Package className="h-8 w-8 animate-pulse text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-muted-foreground">Loading carousel items...</p>
                </TableCell>
              </TableRow>
            ) : filteredItems.sort((a, b) => a.sortOrder - b.sortOrder).map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="flex items-center space-x-2">
                  <span>{item.sortOrder}</span>
                  <div className="flex flex-col">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="h-5 w-5"
                    >
                      ▲
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMoveDown(index)}
                      disabled={index === filteredItems.length - 1}
                      className="h-5 w-5"
                    >
                      ▼
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                <TableCell>
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={() => handleToggleActive(item.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="h-16 w-28 rounded overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.linkUrl}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handlePreviewItem(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Carousel Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveItem}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={currentItem?.title || ''}
                  onChange={(e) => setCurrentItem(curr => curr ? { ...curr, title: e.target.value } : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={currentItem?.description || ''}
                  onChange={(e) => setCurrentItem(curr => curr ? { ...curr, description: e.target.value } : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={currentItem?.imageUrl || ''}
                  onChange={(e) => setCurrentItem(curr => curr ? { ...curr, imageUrl: e.target.value } : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkUrl" className="text-right">Link URL</Label>
                <Input
                  id="linkUrl"
                  value={currentItem?.linkUrl || ''}
                  onChange={(e) => setCurrentItem(curr => curr ? { ...curr, linkUrl: e.target.value } : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">Active</Label>
                <div className="col-span-3 flex items-center">
                  <Switch
                    id="isActive"
                    checked={currentItem?.isActive || false}
                    onCheckedChange={(checked) => setCurrentItem(curr => curr ? { ...curr, isActive: checked } : null)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Carousel Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveItem}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-title" className="text-right">Title</Label>
                <Input
                  id="new-title"
                  value={currentItem?.title || ''}
                  onChange={(e) => setCurrentItem(curr => curr ? { ...curr, title: e.target.value } : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-description" className="text-right">Description</Label>
                <Textarea
                  id="new-description"
                  value={currentItem?.description || ''}
                  onChange={(e) => setCurrentItem(curr => curr ? { ...curr, description: e.target.value } : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-imageUrl" className="text-right">Image URL</Label>
                <Input
                  id="new-imageUrl"
                  value={currentItem?.imageUrl || ''}
                  onChange={(e) => setCurrentItem(curr => curr ? { ...curr, imageUrl: e.target.value } : null)}
                  className="col-span-3"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-linkUrl" className="text-right">Link URL</Label>
                <Input
                  id="new-linkUrl"
                  value={currentItem?.linkUrl || ''}
                  onChange={(e) => setCurrentItem(curr => curr ? { ...curr, linkUrl: e.target.value } : null)}
                  className="col-span-3"
                  placeholder="/marketplace"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-isActive" className="text-right">Active</Label>
                <div className="col-span-3 flex items-center">
                  <Switch
                    id="new-isActive"
                    checked={currentItem?.isActive || false}
                    onCheckedChange={(checked) => setCurrentItem(curr => curr ? { ...curr, isActive: checked } : null)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Carousel Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this carousel item?</p>
            <p className="font-bold mt-2">{currentItem?.title}</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={confirmDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Preview Carousel Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {currentItem && (
              <div className="space-y-4">
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <img 
                    src={currentItem.imageUrl} 
                    alt={currentItem.title}
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                    <h3 className="text-white text-2xl font-bold">{currentItem.title}</h3>
                    <p className="text-white mt-2">{currentItem.description}</p>
                    <p className="text-white opacity-75 mt-4 text-sm">
                      Links to: {currentItem.linkUrl}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <p className={`font-medium ${currentItem.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {currentItem.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div>
                    <Label>Sort Order</Label>
                    <p>{currentItem.sortOrder}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 