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
  Plus, 
  MoreHorizontal, 
  Package, 
  Edit, 
  Trash2,
  ShoppingCart,
  Eye,
  Music
} from "lucide-react";

interface MarketplaceItem {
  id: string;
  title: string;
  artist: string;
  price: string;
  bpm: number;
  keySignature: string;
  genre: string;
  imageUrl: string;
  inStock: boolean;
  salesCount: number;
  dateAdded: string;
  featured?: boolean;
  description?: string;
}

export default function MarketplaceManagement() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MarketplaceItem | null>(null);
  
  const [editForm, setEditForm] = useState({
    title: "",
    artist: "",
    price: "",
    bpm: 128,
    keySignature: "C",
    genre: "Mixed",
    imageUrl: "",
    inStock: true,
    description: ""
  });
  
  // Initial load of marketplace items
  useEffect(() => {
    loadMarketplaceItems();
  }, []);
  
  // Save items to localStorage whenever they change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('marketplaceItems', JSON.stringify(items));
    }
  }, [items]);
  
  // Load marketplace items from localStorage or use fallback data
  const loadMarketplaceItems = () => {
    setIsLoading(true);
    
    // Try to load from localStorage first
    const storedItems = localStorage.getItem('marketplaceItems');
    
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        setItems(parsedItems);
        setIsLoading(false);
      } catch (e) {
        console.error('Error parsing stored marketplace items', e);
        loadMockItems();
      }
    } else {
      // If no items in localStorage, load default mock data
      loadMockItems();
    }
  };
  
  // Load mock marketplace items as fallback
  const loadMockItems = () => {
    setTimeout(() => {
      // Create mock marketplace items based on tracks
      const storedTracks = localStorage.getItem('appTracks');
      
      if (storedTracks) {
        try {
          const parsedTracks = JSON.parse(storedTracks);
          // Convert tracks to marketplace items
          const marketplaceItems: MarketplaceItem[] = parsedTracks.map((track: any) => ({
            id: track.id,
            title: track.title,
            artist: track.artist,
            price: track.price || "$19.99",
            bpm: track.bpm || 128,
            keySignature: track.keySignature || "C",
            genre: track.genre || "Mixed",
            imageUrl: track.imageUrl,
            inStock: true,
            salesCount: Math.floor(Math.random() * 100),
            dateAdded: track.dateAdded || new Date().toISOString().split('T')[0],
            featured: track.featured || false,
            description: `Professional quality ${track.genre || "audio"} track by ${track.artist}. Perfect for your next project.`
          }));
          
          setItems(marketplaceItems);
          localStorage.setItem('marketplaceItems', JSON.stringify(marketplaceItems));
        } catch (e) {
          console.error('Error creating marketplace items from tracks', e);
          createDefaultItems();
        }
      } else {
        createDefaultItems();
      }
      
      setIsLoading(false);
    }, 500);
  };
  
  // Create default marketplace items if no tracks are available
  const createDefaultItems = () => {
    const defaultItems: MarketplaceItem[] = [
      {
        id: "1",
        title: "Deep Bass Kit",
        artist: "BeatMaster",
        price: "$29.99",
        bpm: 95,
        keySignature: "Fm",
        genre: "Hip Hop",
        imageUrl: "https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?auto=format&fit=crop&w=800&q=80",
        inStock: true,
        salesCount: 89,
        dateAdded: "2023-08-15",
        description: "Premium deep bass samples for hip hop and trap production. Includes 50 unique samples."
      },
      {
        id: "2",
        title: "Synthwave Essentials",
        artist: "RetroWave",
        price: "$24.99",
        bpm: 120,
        keySignature: "Am",
        genre: "Synthwave",
        imageUrl: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?auto=format&fit=crop&w=800&q=80",
        inStock: true,
        salesCount: 124,
        dateAdded: "2023-09-01",
        description: "Complete collection of retro-inspired synth sounds and drum kits for creating authentic synthwave tracks."
      },
      {
        id: "3",
        title: "Lo-Fi Melody Pack",
        artist: "ChillBeats",
        price: "$19.99",
        bpm: 85,
        keySignature: "C",
        genre: "Lo-Fi",
        imageUrl: "https://images.unsplash.com/photo-1477233534935-f5e6fe7c1159?auto=format&fit=crop&w=800&q=80",
        inStock: true,
        salesCount: 78,
        dateAdded: "2023-10-10",
        description: "Soothing melodies and warm textures perfect for lo-fi beats and ambient music production."
      }
    ];
    
    setItems(defaultItems);
    localStorage.setItem('marketplaceItems', JSON.stringify(defaultItems));
    
    toast({
      title: "Default Items Loaded",
      description: "Default marketplace items have been loaded successfully.",
    });
  };
  
  // Filter items based on search query
  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.artist.toLowerCase().includes(query) ||
      item.genre.toLowerCase().includes(query) ||
      item.keySignature.toLowerCase().includes(query)
    );
  });
  
  const handleFormChange = (field: string, value: any) => {
    setEditForm({
      ...editForm,
      [field]: value
    });
  };
  
  const handleEdit = (item: MarketplaceItem) => {
    setCurrentItem(item);
    setEditForm({
      title: item.title,
      artist: item.artist,
      price: item.price,
      bpm: item.bpm,
      keySignature: item.keySignature,
      genre: item.genre,
      imageUrl: item.imageUrl,
      inStock: item.inStock,
      description: item.description || ""
    });
    setIsEditDialogOpen(true);
  };
  
  const handlePreview = (item: MarketplaceItem) => {
    setCurrentItem(item);
    setIsPreviewDialogOpen(true);
  };
  
  const handleDelete = (item: MarketplaceItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  const saveEditedItem = () => {
    if (!currentItem) return;
    
    // Update the item in the items array
    const updatedItems = items.map(item => {
      if (item.id === currentItem.id) {
        return {
          ...item,
          title: editForm.title,
          artist: editForm.artist,
          price: editForm.price,
          bpm: editForm.bpm,
          keySignature: editForm.keySignature,
          genre: editForm.genre,
          imageUrl: editForm.imageUrl,
          inStock: editForm.inStock,
          description: editForm.description
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Item Updated",
      description: `${editForm.title} has been updated.`
    });
  };
  
  const addNewItem = () => {
    // Create a new item with the form data
    const newItem: MarketplaceItem = {
      id: Date.now().toString(),
      title: editForm.title,
      artist: editForm.artist,
      price: editForm.price,
      bpm: editForm.bpm,
      keySignature: editForm.keySignature,
      genre: editForm.genre,
      imageUrl: editForm.imageUrl,
      inStock: editForm.inStock,
      salesCount: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      description: editForm.description
    };
    
    setItems([...items, newItem]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Item Added",
      description: `${editForm.title} has been added to the marketplace.`
    });
  };
  
  const deleteItem = () => {
    if (!currentItem) return;
    
    // Remove the item from the items array
    const updatedItems = items.filter(item => item.id !== currentItem.id);
    setItems(updatedItems);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Item Deleted",
      description: `${currentItem.title} has been removed from the marketplace.`,
      variant: "destructive"
    });
  };
  
  const handleAdd = () => {
    setCurrentItem(null);
    setEditForm({
      title: "",
      artist: "",
      price: "$19.99",
      bpm: 128,
      keySignature: "C",
      genre: "Mixed",
      imageUrl: "",
      inStock: true,
      description: ""
    });
    setIsAddDialogOpen(true);
  };
  
  const toggleStockStatus = (item: MarketplaceItem) => {
    // Toggle the inStock status of the item
    const updatedItems = items.map(i => {
      if (i.id === item.id) {
        return { ...i, inStock: !i.inStock };
      }
      return i;
    });
    
    setItems(updatedItems);
    
    toast({
      title: "Stock Status Updated",
      description: `${item.title} is now ${!item.inStock ? "in stock" : "out of stock"}.`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketplace Management</h2>
          <p className="text-muted-foreground">Manage marketplace items, prices, and availability</p>
        </div>
        <div className="space-x-2">
          <Button onClick={loadMarketplaceItems} variant="outline">
            Refresh
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="hip hop">Hip Hop</SelectItem>
            <SelectItem value="trap">Trap</SelectItem>
            <SelectItem value="lo-fi">Lo-Fi</SelectItem>
            <SelectItem value="synthwave">Synthwave</SelectItem>
            <SelectItem value="edm">EDM</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Items table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center">
                    <Package className="h-8 w-8 animate-pulse text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-muted-foreground">Loading marketplace items...</p>
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No items found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.artist}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-beatforge-100 text-beatforge-800 dark:bg-beatforge-900 dark:text-beatforge-300">
                      {item.genre}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{item.salesCount}</span> sales
                      <div className="text-xs text-muted-foreground">
                        {item.bpm} BPM • {item.keySignature}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.inStock 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </div>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handlePreview(item)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStockStatus(item)}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {item.inStock ? "Mark as Out of Stock" : "Mark as In Stock"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
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
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Marketplace Item</DialogTitle>
            <DialogDescription>
              Update item information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                value={editForm.artist}
                onChange={(e) => handleFormChange("artist", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={editForm.imageUrl}
                onChange={(e) => handleFormChange("imageUrl", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={editForm.price}
                onChange={(e) => handleFormChange("price", e.target.value)}
                placeholder="$19.99"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bpm">BPM</Label>
                <Input
                  id="bpm"
                  type="number"
                  value={editForm.bpm}
                  onChange={(e) => handleFormChange("bpm", parseInt(e.target.value))}
                  placeholder="128"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keySignature">Key</Label>
                <Input
                  id="keySignature"
                  value={editForm.keySignature}
                  onChange={(e) => handleFormChange("keySignature", e.target.value)}
                  placeholder="C"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={editForm.genre}
                onChange={(e) => handleFormChange("genre", e.target.value)}
                placeholder="Hip Hop"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editForm.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Professional quality audio track..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="inStock"
                checked={editForm.inStock}
                onChange={(e) => handleFormChange("inStock", e.target.checked)}
                className="w-4 h-4 text-beatforge-600 rounded focus:ring-beatforge-500"
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new item to the marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={editForm.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-artist">Artist</Label>
              <Input
                id="new-artist"
                value={editForm.artist}
                onChange={(e) => handleFormChange("artist", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-imageUrl">Image URL</Label>
              <Input
                id="new-imageUrl"
                value={editForm.imageUrl}
                onChange={(e) => handleFormChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-price">Price</Label>
              <Input
                id="new-price"
                value={editForm.price}
                onChange={(e) => handleFormChange("price", e.target.value)}
                placeholder="$19.99"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="new-bpm">BPM</Label>
                <Input
                  id="new-bpm"
                  type="number"
                  value={editForm.bpm}
                  onChange={(e) => handleFormChange("bpm", parseInt(e.target.value))}
                  placeholder="128"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-keySignature">Key</Label>
                <Input
                  id="new-keySignature"
                  value={editForm.keySignature}
                  onChange={(e) => handleFormChange("keySignature", e.target.value)}
                  placeholder="C"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-genre">Genre</Label>
              <Input
                id="new-genre"
                value={editForm.genre}
                onChange={(e) => handleFormChange("genre", e.target.value)}
                placeholder="Hip Hop"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-description">Description</Label>
              <Input
                id="new-description"
                value={editForm.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Professional quality audio track..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="new-inStock"
                checked={editForm.inStock}
                onChange={(e) => handleFormChange("inStock", e.target.checked)}
                className="w-4 h-4 text-beatforge-600 rounded focus:ring-beatforge-500"
              />
              <Label htmlFor="new-inStock">In Stock</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Preview Item</DialogTitle>
          </DialogHeader>
          {currentItem && (
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="rounded-lg overflow-hidden aspect-square">
                  <img 
                    src={currentItem.imageUrl} 
                    alt={currentItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">{currentItem.title}</h3>
                  <p className="text-muted-foreground">{currentItem.description}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Details</h4>
                  <ul className="space-y-1 text-sm">
                    <li><span className="text-muted-foreground">Artist:</span> {currentItem.artist}</li>
                    <li><span className="text-muted-foreground">Genre:</span> {currentItem.genre}</li>
                    <li><span className="text-muted-foreground">BPM:</span> {currentItem.bpm}</li>
                    <li><span className="text-muted-foreground">Key:</span> {currentItem.keySignature}</li>
                    <li><span className="text-muted-foreground">Price:</span> {currentItem.price}</li>
                    <li><span className="text-muted-foreground">Status:</span> {currentItem.inStock ? "In Stock" : "Out of Stock"}</li>
                    <li><span className="text-muted-foreground">Date Added:</span> {currentItem.dateAdded}</li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentItem.salesCount} sales
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Music className="h-4 w-4" />
                    Play Preview
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentItem?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 