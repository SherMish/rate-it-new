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

interface ToolBreadcrumbsProps {
  businessName: string;
  category?: {
    id: string;
    name: string;
  };
}

export function ToolBreadcrumbs({ businessName, category }: ToolBreadcrumbsProps) {
  return (
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
          
          {category && (
            <>
              <BreadcrumbSeparator>
                <ChevronLeft className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link 
                    href={`/category/${category.id}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {category.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          
          <BreadcrumbSeparator>
            <ChevronLeft className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium max-w-[200px] lg:max-w-none truncate">
              {businessName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
