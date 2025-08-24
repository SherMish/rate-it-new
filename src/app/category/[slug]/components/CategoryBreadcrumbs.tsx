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
}

export function CategoryBreadcrumbs({ categoryName }: CategoryBreadcrumbsProps) {
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
  );
}
