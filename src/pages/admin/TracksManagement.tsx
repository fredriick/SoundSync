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
import { Textarea } from "@/components/ui/textarea";
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
  Music, 
  Edit, 
  Trash2,
  Play,
  Star,
  Eye
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  featured: boolean;
  listens: number;
  dateAdded: string;
  price?: string;
  bpm?: number;
  keySignature?: string;
  genre?: string;
}

export default function TracksManagement() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    artist: "",
    imageUrl: "",
    featured: false,
    price: "",
    bpm: 128,
    keySignature: "",
    genre: ""
  });
  
  // Fetch tracks data - in a real app, this would be an API call
  useEffect(() => {
    // First check if we have tracks in localStorage
    const storedTracks = localStorage.getItem('appTracks');
    
    if (storedTracks) {
      try {
        const parsedTracks = JSON.parse(storedTracks);
        setTracks(parsedTracks);
        setIsLoading(false);
      } catch (e) {
        console.error('Error parsing stored tracks', e);
        loadMockTracks();
      }
    } else {
      loadMockTracks();
    }
  }, []);
  
  // Load mock tracks as fallback
  const loadMockTracks = () => {
    setTimeout(() => {
      const mockTracks: Track[] = [
        {
          id: "1",
          title: "Midnight Echoes",
          artist: "Luna Wave",
          imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
          featured: true,
          listens: 1245,
          dateAdded: "2023-09-15",
          price: "$24.99",
          bpm: 128,
          keySignature: "Am",
          genre: "Synthwave"
        },
        {
          id: "2",
          title: "Electric Dreams",
          artist: "Neon Pulse",
          imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
          featured: true,
          listens: 983,
          dateAdded: "2023-10-02",
          price: "$19.99",
          bpm: 140,
          keySignature: "Fm",
          genre: "Trap"
        },
        {
          id: "3",
          title: "Urban Symphony",
          artist: "Metro Beats",
          imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
          featured: true,
          listens: 752,
          dateAdded: "2023-10-10",
          price: "$14.99",
          bpm: 90,
          keySignature: "C",
          genre: "Lo-Fi"
        },
        {
          id: "4",
          title: "Cosmic Voyage",
          artist: "Stella Nova",
          imageUrl: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?auto=format&fit=crop&w=800&q=80",
          featured: false,
          listens: 421,
          dateAdded: "2023-11-05",
          price: "$29.99",
          bpm: 150,
          keySignature: "G",
          genre: "EDM"
        },
        {
          id: "5",
          title: "Ocean Breeze",
          artist: "Wave Riders",
          imageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=800&q=80",
          featured: false,
          listens: 287,
          dateAdded: "2023-11-12",
          price: "$34.99",
          bpm: 95,
          keySignature: "Dm",
          genre: "Hip Hop"
        }
      ];
      setTracks(mockTracks);
      // Save to localStorage
      localStorage.setItem('appTracks', JSON.stringify(mockTracks));
      setIsLoading(false);
      
      // Show success toast
      toast({
        title: "Tracks Reset",
        description: "Default tracks have been loaded successfully.",
      });
    }, 500);
  };
  
  // Save tracks to localStorage whenever they change
  useEffect(() => {
    if (tracks.length > 0) {
      localStorage.setItem('appTracks', JSON.stringify(tracks));
    }
  }, [tracks]);
  
  // Filter tracks based on search query
  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle opening edit dialog
  const handleEdit = (track: Track) => {
    setCurrentTrack(track);
    setEditForm({
      title: track.title,
      artist: track.artist,
      imageUrl: track.imageUrl,
      featured: track.featured,
      price: track.price || "$19.99",
      bpm: track.bpm || 128,
      keySignature: track.keySignature || "C",
      genre: track.genre || "Mixed"
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle opening preview dialog
  const handlePreview = (track: Track) => {
    setCurrentTrack(track);
    setIsPreviewDialogOpen(true);
  };
  
  // Handle opening delete dialog
  const handleDelete = (track: Track) => {
    setCurrentTrack(track);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form change
  const handleFormChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle saving edited track
  const saveEditedTrack = () => {
    if (!currentTrack) return;
    
    // Update track in the list
    const updatedTracks = tracks.map(track => 
      track.id === currentTrack.id 
        ? { 
            ...track, 
            title: editForm.title, 
            artist: editForm.artist, 
            imageUrl: editForm.imageUrl,
            featured: editForm.featured,
            price: editForm.price,
            bpm: editForm.bpm,
            keySignature: editForm.keySignature,
            genre: editForm.genre
          } 
        : track
    );
    
    // Update state
    setTracks(updatedTracks);
    
    // Save to localStorage
    localStorage.setItem('appTracks', JSON.stringify(updatedTracks));
    
    // Show success toast
    toast({
      title: "Track Updated",
      description: `${editForm.title} has been updated.`,
    });
    
    // Close dialog
    setIsEditDialogOpen(false);
  };
  
  // Handle opening add dialog
  const handleAdd = () => {
    setEditForm({
      title: "",
      artist: "",
      imageUrl: "",
      featured: false,
      price: "$19.99",
      bpm: 128,
      keySignature: "C",
      genre: "Mixed"
    });
    setIsAddDialogOpen(true);
  };
  
  // Handle adding new track
  const addNewTrack = () => {
    // Generate a new ID
    const newId = String(tracks.length + 1);
    
    // Create new track object
    const newTrack: Track = {
      id: newId,
      title: editForm.title,
      artist: editForm.artist,
      imageUrl: editForm.imageUrl,
      featured: editForm.featured,
      listens: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      price: editForm.price,
      bpm: editForm.bpm,
      keySignature: editForm.keySignature,
      genre: editForm.genre
    };
    
    // Add to tracks list
    const updatedTracks = [...tracks, newTrack];
    setTracks(updatedTracks);
    
    // Save to localStorage
    localStorage.setItem('appTracks', JSON.stringify(updatedTracks));
    
    // Show success toast
    toast({
      title: "Track Added",
      description: `${editForm.title} by ${editForm.artist} has been added.`,
    });
    
    // Close dialog
    setIsAddDialogOpen(false);
  };
  
  // Handle delete track
  const deleteTrack = () => {
    if (!currentTrack) return;
    
    // Remove track from the list
    const updatedTracks = tracks.filter(track => track.id !== currentTrack.id);
    setTracks(updatedTracks);
    
    // Save to localStorage
    localStorage.setItem('appTracks', JSON.stringify(updatedTracks));
    
    // Show success toast
    toast({
      title: "Track Deleted",
      description: `${currentTrack.title} has been removed.`,
    });
    
    // Close dialog
    setIsDeleteDialogOpen(false);
  };
  
  // Toggle featured status
  const toggleFeatured = (track: Track) => {
    // Set featured status explicitly to true or false
    const newFeaturedStatus = !track.featured;
    
    console.log(`Setting ${track.title} featured status to: ${newFeaturedStatus}`);
    
    const updatedTracks = tracks.map(t => 
      t.id === track.id 
        ? { ...t, featured: newFeaturedStatus } 
        : t
    );
    
    setTracks(updatedTracks);
    
    // Save to localStorage
    localStorage.setItem('appTracks', JSON.stringify(updatedTracks));
    
    toast({
      title: newFeaturedStatus ? "Added to Featured" : "Removed from Featured",
      description: `${track.title} has been ${newFeaturedStatus ? "added to" : "removed from"} featured tracks.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Tracks</h2>
          <p className="text-muted-foreground">Manage the tracks displayed on the platform</p>
        </div>
        <div className="space-x-2">
          <Button onClick={loadMockTracks} variant="outline">
            Reset Tracks
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Track
          </Button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tracks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="notfeatured">Not Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Tracks table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Track</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Listens</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <Music className="h-8 w-8 animate-pulse text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-muted-foreground">Loading tracks...</p>
                </TableCell>
              </TableRow>
            ) : filteredTracks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No tracks found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredTracks.map((track) => (
                <TableRow key={track.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded overflow-hidden">
                        <img 
                          src={track.imageUrl} 
                          alt={track.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{track.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{track.artist}</TableCell>
                  <TableCell>
                    <div 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        track.featured 
                          ? "bg-beatforge-100 text-beatforge-800 dark:bg-beatforge-900 dark:text-beatforge-300" 
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {track.featured ? "Featured" : "Not Featured"}
                    </div>
                  </TableCell>
                  <TableCell>{track.listens.toLocaleString()}</TableCell>
                  <TableCell>{new Date(track.dateAdded).toLocaleDateString()}</TableCell>
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
                        <DropdownMenuItem onClick={() => handlePreview(track)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFeatured(track)}>
                          <Star className="h-4 w-4 mr-2" />
                          {track.featured ? "Remove from Featured" : "Add to Featured"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(track)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(track)} className="text-red-600">
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
      
      {/* Edit Track Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Track</DialogTitle>
            <DialogDescription>
              Update track information.
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
              <Select 
                value={editForm.genre} 
                onValueChange={(value) => handleFormChange("genre", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Synthwave">Synthwave</SelectItem>
                  <SelectItem value="Trap">Trap</SelectItem>
                  <SelectItem value="Lo-Fi">Lo-Fi</SelectItem>
                  <SelectItem value="EDM">EDM</SelectItem>
                  <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                  <SelectItem value="Pop">Pop</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={editForm.featured}
                onChange={(e) => handleFormChange("featured", e.target.checked)}
                className="w-4 h-4 text-beatforge-600 rounded focus:ring-beatforge-500"
              />
              <Label htmlFor="featured">Featured Track</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedTrack}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Track Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Track</DialogTitle>
            <DialogDescription>
              Add a new track to the platform.
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
              <Select 
                value={editForm.genre} 
                onValueChange={(value) => handleFormChange("genre", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Synthwave">Synthwave</SelectItem>
                  <SelectItem value="Trap">Trap</SelectItem>
                  <SelectItem value="Lo-Fi">Lo-Fi</SelectItem>
                  <SelectItem value="EDM">EDM</SelectItem>
                  <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                  <SelectItem value="Pop">Pop</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={editForm.featured}
                onChange={(e) => handleFormChange("featured", e.target.checked)}
                className="w-4 h-4 text-beatforge-600 rounded focus:ring-beatforge-500"
              />
              <Label htmlFor="featured">Featured Track</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewTrack}>Add Track</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Track Preview</DialogTitle>
          </DialogHeader>
          {currentTrack && (
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-md">
                <img 
                  src={currentTrack.imageUrl} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{currentTrack.title}</h3>
                <p className="text-muted-foreground">{currentTrack.artist}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {currentTrack.listens.toLocaleString()} listens
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Play className="h-4 w-4" />
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
            <DialogTitle>Delete Track</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentTrack?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteTrack}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 