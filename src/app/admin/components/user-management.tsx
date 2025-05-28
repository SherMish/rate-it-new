"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Mail, User, Calendar } from "lucide-react";

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  isWebsiteOwner: boolean;
  isVerifiedWebsiteOwner: boolean;
  reviewCount: number;
  relatedWebsite: string | null;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/users?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();
      setUsers(data.users || []);
      setTotalUsers(data.total || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const maxPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin":
        return "מנהל";
      case "business_owner":
        return "בעל עסק";
      case "business_user":
        return "משתמש עסקי";
      case "user":
      default:
        return "משתמש";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          placeholder="חפש משתמשים..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm text-right"
          dir="rtl"
        />
        <h2 className="text-xl font-bold">ניהול משתמשים</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">טוען משתמשים...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user._id} className="p-4" dir="rtl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-sm">
                      תפקיד: {getRoleDisplay(user.role)}
                    </p>
                    <p className="text-sm">ביקורות: {user.reviewCount}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="py-2 px-3 text-sm">
              עמוד {currentPage} מתוך {maxPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(maxPages, p + 1))}
              disabled={currentPage === maxPages}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
