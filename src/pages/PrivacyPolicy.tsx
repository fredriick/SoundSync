import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            At SoundSync, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains 
            how we collect, use, and safeguard your information when you use our website and services.
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using our service, you acknowledge that you have read and 
            understood this Privacy Policy.
          </p>
          
          <h2>2. Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our Service, including:
          </p>
          <ul>
            <li><strong>Personal Data:</strong> Information that can be used to identify you, such as your name, email address, telephone number, and billing information</li>
            <li><strong>Usage Data:</strong> Information about how you use our Service, including your browsing history, search queries, and interaction with features</li>
            <li><strong>Device Data:</strong> Information about the device you use to access our Service, including IP address, browser type, and operating system</li>
            <li><strong>Content Data:</strong> Information contained in the files you upload, such as audio files, project files, and other content</li>
          </ul>
          
          <h2>3. How We Collect Information</h2>
          <p>
            We collect information through various methods, including:
          </p>
          <ul>
            <li>Direct interactions when you create an account, purchase products, or use our services</li>
            <li>Automated technologies such as cookies and similar tracking technologies</li>
            <li>Third-party sources, such as payment processors and social media platforms (if you choose to connect them)</li>
          </ul>
          
          <h2>4. How We Use Your Information</h2>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul>
            <li>Providing, maintaining, and improving our Service</li>
            <li>Processing your transactions and managing your account</li>
            <li>Personalizing your experience and delivering content relevant to your interests</li>
            <li>Communicating with you about updates, promotions, and other information related to our Service</li>
            <li>Ensuring the security and integrity of our Service</li>
            <li>Complying with legal obligations</li>
          </ul>
          
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access, 
            alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
            storage is 100% secure, and we cannot guarantee absolute security.
          </p>
          
          <h2>6. Sharing Your Information</h2>
          <p>
            We may share your information with:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as payment processing and data analysis</li>
            <li><strong>Business Partners:</strong> Companies with whom we partner to offer products or services</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights or the rights of others</li>
          </ul>
          <p>
            We do not sell your personal information to third parties.
          </p>
          
          <h2>7. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul>
            <li>The right to access and receive a copy of your personal information</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to restrict or object to processing of your personal information</li>
            <li>The right to data portability</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>
          
          <h2>8. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to collect and store information about your interactions with our Service. 
            You can control cookies through your browser settings, but disabling cookies may limit your ability to use some features of our Service.
          </p>
          
          <h2>9. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. 
            If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information.
          </p>
          
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the "Last updated" date.
          </p>
          
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            <a href="mailto:privacy@soundsync.com" className="text-beatforge-500 hover:text-beatforge-600">
              privacy@soundsync.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
 
 
 
 
 
 
 
 
 