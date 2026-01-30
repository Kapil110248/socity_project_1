"use client";

import { BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SocietyService } from "@/services/society.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function PlatformUpdatesPage() {
  const {
    data: guidelines = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["guidelines-for-me"],
    queryFn: SocietyService.getGuidelinesForMe,
  });

  if (error) {
    toast.error("Failed to load updates and guidelines.");
  }

  return (
    <div className="space-y-6 container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
          <BookOpen className="h-8 w-8 text-teal-600" />
          Updates & Guidelines
        </h1>
        <p className="text-muted-foreground">
          Updates and guidelines shared with you by the platform.
        </p>
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
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {g.title}
                  </CardTitle>
                  {g.category && (
                    <Badge variant="secondary" className="text-xs">
                      {g.category}
                    </Badge>
                  )}
                  {g.society?.name && (
                    <span className="text-xs text-gray-500">
                      · {g.society.name}
                    </span>
                  )}
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
