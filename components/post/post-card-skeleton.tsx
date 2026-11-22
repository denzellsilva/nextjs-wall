import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardContent className="pt-1">
        <div className="flex gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PostFeedSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading posts">
      {Array.from({ length: 3 }, (_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  );
}
