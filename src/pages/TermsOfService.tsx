import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to SoundSync ("Company", "we", "our", "us"). These Terms of Service ("Terms", "Terms of Service") govern 
            your use of our website and services (collectively, the "Service") operated by SoundSync.
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, 
            you do not have permission to access the Service.
          </p>
          
          <h2>2. Communications</h2>
          <p>
            By creating an account on our service, you agree to receive communications from us, which may include 
            service announcements, promotional messages, and important updates about your account or our services. 
            You can opt out of non-essential communications at any time.
          </p>
          
          <h2>3. Purchases</h2>
          <p>
            If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked 
            to supply certain information relevant to your Purchase including your credit card details, billing address, and other information.
          </p>
          <p>
            You represent and warrant that: (i) you have the legal right to use any payment method(s) in connection with any Purchase; 
            and (ii) the information you supply to us is accurate, correct, and complete.
          </p>
          
          <h2>4. Digital Content and Licenses</h2>
          <p>
            When you purchase digital content from SoundSync, such as audio files, samples, beats, or MIDI files, you are purchasing 
            a license to use the content according to the terms specified at the time of purchase.
          </p>
          <p>
            Unless explicitly stated otherwise, licenses for digital content are non-exclusive, worldwide, and perpetual. 
            You may not redistribute, resell, or sublicense any digital content purchased from SoundSync.
          </p>
          
          <h2>5. Service Usage</h2>
          <p>
            You agree not to use the Service:</p>
          <ul>
            <li>In any way that violates any applicable national, federal, state, local, or international law or regulation</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter", "spam", or any other similar solicitation</li>
            <li>To impersonate or attempt to impersonate SoundSync, a SoundSync employee, another user, or any other person or entity</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
          </ul>
          
          <h2>6. User-Generated Content</h2>
          <p>
            Our Service may allow you to post, upload, or share content, including audio files, comments, and other materials. 
            You retain any ownership rights to content you submit, post, or display on or through the Service.
          </p>
          <p>
            By posting content to the Service, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, 
            modify, perform, display, distribute, and otherwise disclose to third parties any content for the purposes of providing 
            and improving the Service.
          </p>
          
          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including 
            without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
          </p>
          
          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall SoundSync, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for 
            any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, 
            data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or 
            use the Service.
          </p>
          
          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access 
            or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
          
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            <a href="mailto:legal@soundsync.com" className="text-beatforge-500 hover:text-beatforge-600">
              legal@soundsync.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
 
 
 
 
 
 
 
 
 