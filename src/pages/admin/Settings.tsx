import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Save, RefreshCcw, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const { toast } = useToast();
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "BeatForge",
    siteDescription: "The ultimate marketplace for beats and audio production",
    contactEmail: "support@beatforge.com",
    allowSignups: true,
    maintenanceMode: false
  });

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    defaultCurrency: "USD",
    commissionRate: 15,
    minimumWithdrawal: 50,
    enableStripe: true,
    enablePayPal: true
  });

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.sendgrid.net",
    smtpPort: 587,
    smtpUsername: "apikey",
    smtpPassword: "••••••••••••••••",
    senderEmail: "no-reply@beatforge.com",
    senderName: "BeatForge",
    enableEmailNotifications: true
  });

  // Storage settings
  const [storageSettings, setStorageSettings] = useState({
    provider: "aws",
    bucketName: "beatforge-uploads",
    region: "us-east-1",
    maxUploadSize: 100,
    allowedFileTypes: "mp3,wav,aiff,zip,pdf"
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleGeneralChange = (key: string, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePaymentChange = (key: string, value: any) => {
    setPaymentSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleEmailChange = (key: string, value: any) => {
    setEmailSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleStorageChange = (key: string, value: any) => {
    setStorageSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
      
      // In a real application, we would save these to a backend
      localStorage.setItem("adminSettings", JSON.stringify({
        general: generalSettings,
        payment: paymentSettings,
        email: emailSettings,
        storage: storageSettings
      }));
    }, 1000);
  };

  const clearCache = () => {
    // Simulate cache clearing
    setTimeout(() => {
      toast({
        title: "Cache cleared",
        description: "Application cache has been cleared successfully.",
      });
    }, 500);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure application settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={clearCache}>Clear Cache</Button>
          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your site's basic configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    value={generalSettings.siteName} 
                    onChange={(e) => handleGeneralChange("siteName", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email" 
                    value={generalSettings.contactEmail} 
                    onChange={(e) => handleGeneralChange("contactEmail", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input 
                  id="siteDescription" 
                  value={generalSettings.siteDescription} 
                  onChange={(e) => handleGeneralChange("siteDescription", e.target.value)} 
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowSignups">Allow User Signups</Label>
                  <p className="text-sm text-muted-foreground">Enable new user registrations</p>
                </div>
                <Switch 
                  id="allowSignups" 
                  checked={generalSettings.allowSignups} 
                  onCheckedChange={(checked) => handleGeneralChange("allowSignups", checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Put the site in maintenance mode</p>
                </div>
                <Switch 
                  id="maintenanceMode" 
                  checked={generalSettings.maintenanceMode} 
                  onCheckedChange={(checked) => handleGeneralChange("maintenanceMode", checked)} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment options and processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select 
                    value={paymentSettings.defaultCurrency}
                    onValueChange={(value) => handlePaymentChange("defaultCurrency", value)}
                  >
                    <SelectTrigger id="defaultCurrency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input 
                    id="commissionRate" 
                    type="number" 
                    min="0"
                    max="100"
                    value={paymentSettings.commissionRate} 
                    onChange={(e) => handlePaymentChange("commissionRate", Number(e.target.value))} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minimumWithdrawal">Minimum Withdrawal Amount</Label>
                <Input 
                  id="minimumWithdrawal" 
                  type="number"
                  min="0"
                  value={paymentSettings.minimumWithdrawal} 
                  onChange={(e) => handlePaymentChange("minimumWithdrawal", Number(e.target.value))} 
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableStripe">Enable Stripe</Label>
                  <p className="text-sm text-muted-foreground">Process payments through Stripe</p>
                </div>
                <Switch 
                  id="enableStripe" 
                  checked={paymentSettings.enableStripe} 
                  onCheckedChange={(checked) => handlePaymentChange("enableStripe", checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enablePayPal">Enable PayPal</Label>
                  <p className="text-sm text-muted-foreground">Process payments through PayPal</p>
                </div>
                <Switch 
                  id="enablePayPal" 
                  checked={paymentSettings.enablePayPal} 
                  onCheckedChange={(checked) => handlePaymentChange("enablePayPal", checked)} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email server and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input 
                    id="smtpServer" 
                    value={emailSettings.smtpServer} 
                    onChange={(e) => handleEmailChange("smtpServer", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input 
                    id="smtpPort" 
                    type="number" 
                    value={emailSettings.smtpPort} 
                    onChange={(e) => handleEmailChange("smtpPort", Number(e.target.value))} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input 
                    id="smtpUsername" 
                    value={emailSettings.smtpUsername} 
                    onChange={(e) => handleEmailChange("smtpUsername", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input 
                    id="smtpPassword" 
                    type="password" 
                    value={emailSettings.smtpPassword} 
                    onChange={(e) => handleEmailChange("smtpPassword", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <Input 
                    id="senderEmail" 
                    type="email"
                    value={emailSettings.senderEmail} 
                    onChange={(e) => handleEmailChange("senderEmail", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderName">Sender Name</Label>
                  <Input 
                    id="senderName" 
                    value={emailSettings.senderName} 
                    onChange={(e) => handleEmailChange("senderName", e.target.value)} 
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send automatic emails for important events</p>
                </div>
                <Switch 
                  id="enableEmailNotifications" 
                  checked={emailSettings.enableEmailNotifications} 
                  onCheckedChange={(checked) => handleEmailChange("enableEmailNotifications", checked)} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Storage Settings */}
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>Configure file storage options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Storage Provider</Label>
                <Select 
                  value={storageSettings.provider}
                  onValueChange={(value) => handleStorageChange("provider", value)}
                >
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">Amazon S3</SelectItem>
                    <SelectItem value="gcp">Google Cloud Storage</SelectItem>
                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                    <SelectItem value="local">Local Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bucketName">Bucket Name</Label>
                  <Input 
                    id="bucketName" 
                    value={storageSettings.bucketName} 
                    onChange={(e) => handleStorageChange("bucketName", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input 
                    id="region" 
                    value={storageSettings.region} 
                    onChange={(e) => handleStorageChange("region", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                  <Input 
                    id="maxUploadSize" 
                    type="number"
                    min="1"
                    value={storageSettings.maxUploadSize} 
                    onChange={(e) => handleStorageChange("maxUploadSize", Number(e.target.value))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                  <Input 
                    id="allowedFileTypes" 
                    value={storageSettings.allowedFileTypes} 
                    onChange={(e) => handleStorageChange("allowedFileTypes", e.target.value)} 
                    placeholder="Comma separated file extensions"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
 
 
 
 
 
 
 
 
 