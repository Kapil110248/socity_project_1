"use client";

import { BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SocietyService } from "@/services/society.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function PlatformUpdatesPage() {
  const { user } = useAuthStore();

  const {
    data: guidelines = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["guidelines-for-me", user?.id],
    queryFn: SocietyService.getGuidelinesForMe,
    enabled: !!user?.id,
  });

  if (error) {
    toast.error("Failed to load updates and guidelines.");
  }

  return (
    <div className="space-y-6 container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
            <BookOpen className="h-8 w-8 text-teal-600" />
            Updates & Guidelines
          </h1>
          <p className="text-muted-foreground text-sm">
            Important updates and community guidelines for you.
          </p>
        </div>

        {user?.role?.toLowerCase() === "admin" && (
          <Link href="/dashboard/admin/guidelines">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white gap-2 shadow-sm">
              <Settings className="h-4 w-4" />
              Manage My Guidelines
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-gray-200">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : guidelines.length === 0 ? (
        <Card className="border border-gray-200">
          <CardContent className="py-12 text-center text-gray-500">
            No updates or guidelines have been shared with you yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {guidelines.map((g: any) => (
            <Card
              key={g.id}
              className="border-l-4 border-l-teal-500 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {g.title}
                    </CardTitle>
                    {g.category && (
                      <Badge variant="secondary" className="text-xs">
                        {g.category}
                      </Badge>
                    )}
                  </div>
                  <Badge className={g.society?.name ? "bg-teal-100 text-teal-700 hover:bg-teal-100 border-teal-200" : "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"}>
                    {g.society?.name || "Official Platform"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 whitespace-pre-wrap">
                  {g.content}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
