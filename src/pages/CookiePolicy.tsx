import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            This Cookie Policy explains how SoundSync ("we", "us", "our") uses cookies and similar technologies 
            on our website. This policy is designed to help you understand what cookies are, how we use them, 
            and the choices you have regarding their use.
          </p>
          
          <h2>2. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit 
            websites. They are widely used to make websites work more efficiently and provide information to the website owners. 
            Cookies enhance your browsing experience by:
          </p>
          <ul>
            <li>Remembering your preferences and settings</li>
            <li>Helping you navigate between pages efficiently</li>
            <li>Enabling certain features and functionalities</li>
            <li>Collecting information about how you use the website</li>
          </ul>
          
          <h2>3. Types of Cookies We Use</h2>
          <p>
            We use different types of cookies for various purposes:
          </p>
          
          <h3>3.1. Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable core functionality such as 
            security, network management, and account access. You cannot opt out of these cookies.
          </p>
          
          <h3>3.2. Performance/Analytics Cookies</h3>
          <p>
            These cookies collect information about how visitors use our website, such as which pages they visit most often 
            and if they receive error messages. This information helps us improve the website's performance and user experience.
          </p>
          
          <h3>3.3. Functionality Cookies</h3>
          <p>
            These cookies allow the website to remember choices you make (such as your username, language, or region) 
            and provide enhanced, personalized features.
          </p>
          
          <h3>3.4. Targeting/Advertising Cookies</h3>
          <p>
            These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to 
            limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.
          </p>
          
          <h2>4. Third-Party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics, 
            deliver advertisements, and so on. These third-party cookies may include:
          </p>
          <ul>
            <li>Google Analytics for website traffic analysis</li>
            <li>Payment processors for handling transactions</li>
            <li>Social media plugins for content sharing</li>
            <li>Advertising networks for targeted marketing</li>
          </ul>
          
          <h2>5. Cookie Management</h2>
          <p>
            Most web browsers allow you to manage your cookie preferences. You can:
          </p>
          <ul>
            <li>Delete cookies from your device</li>
            <li>Block cookies by activating settings on your browser</li>
            <li>Choose to block all cookies or only third-party cookies</li>
          </ul>
          <p>
            Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, 
            and some services may not function properly.
          </p>
          
          <h3>Browser-Specific Instructions</h3>
          <p>
            Here are links to instructions for managing cookies in common web browsers:
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-beatforge-500 hover:text-beatforge-600">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-beatforge-500 hover:text-beatforge-600">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-beatforge-500 hover:text-beatforge-600">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-beatforge-500 hover:text-beatforge-600">Microsoft Edge</a></li>
          </ul>
          
          <h2>6. Do Not Track Signals</h2>
          <p>
            Some browsers have a "Do Not Track" feature that signals to websites that you visit that you do not want to have 
            your online activity tracked. Our website does not currently respond to "Do Not Track" signals.
          </p>
          
          <h2>7. Updates to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. 
            Any changes will be posted on this page with an updated revision date.
          </p>
          
          <h2>8. More Information</h2>
          <p>
            If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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
 
 
 
 
 
 
 
 
 