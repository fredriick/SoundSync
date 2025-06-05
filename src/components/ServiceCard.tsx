import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  price: string;
  popular?: boolean;
  className?: string;
  id?: string;
}

export function ServiceCard({
  title,
  description,
  icon,
  features,
  price,
  popular = false,
  className,
  id = title.toLowerCase().replace(/\s+/g, "-"),
}: ServiceCardProps) {
  const serviceSlug = title.toLowerCase().replace(/\s+/g, "-");
  
  // Determine the appropriate link based on the service
  const serviceLink = title === "Full Production Package" 
    ? `/full-production-detail` 
    : `/services/${serviceSlug}`;
  
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md",
        popular && "border-beatforge-500 shadow-beatforge-500/10",
        className
      )}
    >
      {popular && (
        <div className="absolute -top-3 right-6 rounded-full bg-beatforge-500 px-3 py-1 text-xs font-medium text-white">
          Popular
        </div>
      )}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-500">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <div className="mb-6 text-3xl font-bold">
        {price === "Contact Us" ? (
          <span className="text-beatforge-500">{price}</span>
        ) : (
          price
        )}
      </div>
      <ul className="mb-6 space-y-2 text-sm">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-beatforge-500"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Button 
        className={popular ? "bg-beatforge-500 hover:bg-beatforge-600" : ""}
        asChild
      >
        <Link to={serviceLink}>
          {title === "Full Production Package" && price === "Contact Us" ? "Contact Us" : "Learn More"}
        </Link>
      </Button>
    </div>
  );
}
