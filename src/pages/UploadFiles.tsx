import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload, FileAudio, File, ArrowRight, CheckCircle, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

export default function UploadFiles() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [instructions, setInstructions] = useState('');
  const [references, setReferences] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [isFullProductionPackage, setIsFullProductionPackage] = useState(false);
  
  // Check if the user is coming from a successful payment
  useEffect(() => {
    const mockUserRaw = localStorage.getItem('mockUser');
    if (mockUserRaw) {
      const mockUser = JSON.parse(mockUserRaw);
      
      // If there's no current purchase, redirect to dashboard
      if (!mockUser.currentPurchaseId) {
        navigate('/dashboard');
        return;
      }
      
      // Find the current purchase
      const purchases = mockUser.purchases || [];
      const currentPurchase = purchases.find((p: any) => p.id === mockUser.currentPurchaseId);
      
      if (currentPurchase) {
        setPurchaseData(currentPurchase);
        // Check if this is the Full Production Package
        setIsFullProductionPackage(currentPurchase.serviceName === "Full Production Package");
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/sign-in');
    }
  }, [navigate]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to array
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('audio/')) {
      return <FileAudio className="h-5 w-5 text-beatforge-500" />;
    }
    return <File className="h-5 w-5 text-muted-foreground" />;
  };

  const handleSkip = () => {
    // For Full Production Package only - proceed without files
    if (!isFullProductionPackage) return;
    
    // Update the purchase record without files
    const mockUserRaw = localStorage.getItem('mockUser');
    if (mockUserRaw) {
      const mockUser = JSON.parse(mockUserRaw);
      const purchases = mockUser.purchases || [];
      
      // Update the current purchase
      const updatedPurchases = purchases.map((p: any) => {
        if (p.id === mockUser.currentPurchaseId) {
          return {
            ...p,
            fileUploaded: true, // Mark as uploaded even though we skipped
            instructions: instructions,
            references: references,
            filesOptional: true, // Flag that files were optional and skipped
            status: "in-progress",
            progressValue: 10, // Start at 10%
            progressSteps: [
              { title: "Order Received", completed: true, date: new Date().toISOString() },
              { title: "In Progress", completed: true, date: new Date().toISOString() },
              { title: "Review", completed: false },
              { title: "Completed", completed: false }
            ],
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      
      // Clear the current purchase ID
      localStorage.setItem('mockUser', JSON.stringify({
        ...mockUser,
        purchases: updatedPurchases,
        currentPurchaseId: null // Clear current purchase
      }));
    }
    
    toast({
      title: "Order processed",
      description: "Your production request has been initiated. We'll contact you to gather more information.",
    });
    
    // Navigate to dashboard with services tab
    navigate('/dashboard?tab=services');
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (files.length === 0 && !isFullProductionPackage) {
      toast({
        title: "No files selected",
        description: "Please upload at least one audio file to proceed.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload with progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 100) {
        progress = 100;
        clearInterval(uploadInterval);
        
        setTimeout(() => {
          // Mark the purchase as having files uploaded
          const mockUserRaw = localStorage.getItem('mockUser');
          if (mockUserRaw) {
            const mockUser = JSON.parse(mockUserRaw);
            const purchases = mockUser.purchases || [];
            
            // Update the current purchase
            const updatedPurchases = purchases.map((p: any) => {
              if (p.id === mockUser.currentPurchaseId) {
                return {
                  ...p,
                  fileUploaded: true,
                  instructions: instructions,
                  references: references,
                  files: files.map(f => f.name),
                  status: "in-progress",
                  progressValue: 10, // Start at 10%
                  progressSteps: [
                    { title: "Files Uploaded", completed: true, date: new Date().toISOString() },
                    { title: "In Progress", completed: true, date: new Date().toISOString() },
                    { title: "Review", completed: false },
                    { title: "Completed", completed: false }
                  ],
                  updatedAt: new Date().toISOString()
                };
              }
              return p;
            });
            
            // Clear the current purchase ID
            localStorage.setItem('mockUser', JSON.stringify({
              ...mockUser,
              purchases: updatedPurchases,
              currentPurchaseId: null // Clear current purchase
            }));
          }
          
          setIsUploading(false);
          
          toast({
            title: "Files uploaded successfully",
            description: "Your files have been uploaded and your service request is now in progress.",
          });
          
          // Navigate to dashboard with services tab
          navigate('/dashboard?tab=services');
        }, 500);
      }
      setUploadProgress(progress);
    }, 200);
  };
  
  if (!purchaseData) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 py-16 flex flex-col items-center justify-center">
          <div className="container max-w-lg text-center">
            <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-beatforge-500 animate-spin mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold">Loading purchase information...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Files</CardTitle>
              <CardDescription>
                Please upload your audio files for your {purchaseData.serviceName} service.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFullProductionPackage && (
                <Alert className="mb-6 bg-beatforge-900/20 border-beatforge-500/50">
                  <Info className="h-4 w-4 text-beatforge-500" />
                  <AlertTitle>File Upload Optional</AlertTitle>
                  <AlertDescription>
                    For the Full Production Package, file upload is optional. You can skip this step and we'll contact you to gather more information, or upload any reference files or demos you have now.
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Audio Files {isFullProductionPackage && "(Optional)"}</Label>
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={triggerFileInput}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Drag & drop files here</h3>
                    <p className="text-sm text-muted-foreground">
                      or click to browse your device
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: WAV, MP3, AIFF, FLAC (Up to 500MB per file)
                    </p>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label>{files.length} File{files.length !== 1 ? 's' : ''} Selected</Label>
                    <div className="border rounded-lg divide-y">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file)}
                            <div>
                              <p className="font-medium truncate max-w-[200px] md:max-w-[300px]">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions {isFullProductionPackage ? "(Optional)" : ""}</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Please describe what you'd like us to do with these files, any specific instructions, etc."
                    rows={4}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="references">Reference Tracks (Optional)</Label>
                  <Textarea
                    id="references"
                    placeholder="List any reference tracks or artists you'd like us to use as inspiration."
                    rows={3}
                    value={references}
                    onChange={(e) => setReferences(e.target.value)}
                  />
                </div>
                
                {!isFullProductionPackage && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Make sure you've uploaded all necessary files before submitting. You won't be able to add more files later without contacting support.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {isUploading ? (
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uploading files...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                  
                  {uploadProgress === 100 && (
                    <div className="flex items-center justify-center text-green-600 mt-2">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Upload complete! Redirecting to dashboard...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`w-full ${isFullProductionPackage ? 'flex flex-col sm:flex-row gap-4' : ''}`}>
                  <Button 
                    type="button" 
                    className={`${isFullProductionPackage ? 'flex-1' : 'w-full'}`}
                    onClick={(e) => {
                      // Create a synthetic form event
                      const formElement = document.querySelector('form');
                      if (formElement) {
                        const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>;
                        Object.defineProperty(formEvent, 'currentTarget', { value: formElement });
                        handleSubmit(formEvent);
                      }
                    }}
                  >
                    {files.length > 0 || !isFullProductionPackage ? 'Submit Files' : 'Submit Request'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  {isFullProductionPackage && (
                    <Button 
                      type="button" 
                      variant="outline"
                      className="flex-1"
                      onClick={handleSkip}
                    >
                      Skip File Upload
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 