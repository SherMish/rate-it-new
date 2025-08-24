import Link from "next/link";
import { Home, ChevronLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface CategoryBreadcrumbsProps {
  categoryName: string;
  categoryId: string;
}

export function CategoryBreadcrumbs({ categoryName, categoryId }: CategoryBreadcrumbsProps) {
  // Generate structured data for breadcrumbs
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "בית",
        "item": process.env.NEXT_PUBLIC_APP_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `${process.env.NEXT_PUBLIC_APP_URL}/category/${categoryId}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList className="text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Home className="h-4 w-4" />
                  <span>בית</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            <BreadcrumbSeparator>
              <ChevronLeft className="h-4 w-4" />
            </BreadcrumbSeparator>
            
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium">
                {categoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </>
  );
}
