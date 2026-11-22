import { Suspense } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreatePostForm } from "@/components/post/create-form";
import { PostFeed, type Post } from "@/components/post/post-feed";
import { PostFeedSkeleton } from "@/components/post/post-card-skeleton";
import { createClient } from "@/lib/supabase/server";

const profileName = "Marl Denzell J. Silva";

type PostRow = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

async function Posts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, author_name, body, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  const initialPosts: Post[] = (data as PostRow[]).map((row) => ({
    id: row.id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
    relativeTime: formatInitialRelativeTime(row.created_at),
  }));

  return (
    <PostFeed
      initialPosts={initialPosts}
      profileName={profileName}
      profileImage="/denzell.jpg"
    />
  );
}

function formatInitialRelativeTime(createdAt: string) {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.max(0, Math.floor(elapsed / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 sm:grid-cols-[260px_minmax(0,1fr)]">
        <aside>
          <div className="sticky top-6 space-y-4">
            <Card className="overflow-hidden py-0">
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <Image
                  src="/denzell.jpg"
                  alt={profileName}
                  fill
                  sizes="260px"
                  className="object-cover"
                  priority
                />
              </div>
              <CardContent className="pb-5 pt-4">
                <h1 className="text-xl font-semibold leading-tight">
                  {profileName}
                </h1>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold">About</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  <span>Manila, Philippines</span>
                </div>
                <Separator />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Building, learning, and sharing a little of the journey along
                  the way.
                </p>
              </CardContent>
            </Card>
          </div>
        </aside>

        <section className="min-w-0 space-y-4">
          <CreatePostForm authorName={profileName} avatarSrc="/denzell.jpg" />

          <Suspense fallback={<PostFeedSkeleton />}>
            <Posts />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
