"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreatePostForm } from "@/components/post/create-form";

type Post = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  relativeTime: string;
};

const profileName = "Marl Denzell J. Silva";

type PostRow = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

function formatRelativeTime(createdAt: string) {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.max(0, Math.floor(elapsed / 60000));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  return `${Math.floor(hours / 24)}d`;
}

function mapPost(row: PostRow): Post {
  return {
    id: row.id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
    relativeTime: formatRelativeTime(row.created_at),
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase.realtime.setAuth();

    async function loadPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("id, author_name, body, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setPosts(data.map(mapPost));
      }
    }

    const channel = supabase
      .channel("posts", { config: { private: true } })
      .on("broadcast", { event: "*" }, (payload) => {
        if (payload.event === "INSERT") {
          const inserted = mapPost(payload.payload as PostRow);
          setPosts((current) =>
            current.some((post) => post.id === inserted.id)
              ? current
              : [inserted, ...current].slice(0, 50),
          );
        }
      })
      .subscribe();

    loadPosts();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-1">
                  <div className="flex gap-3">
                    {post.authorName === profileName ? (
                      <Avatar size="lg">
                        <AvatarImage src="/denzell.jpg" alt={post.authorName} />
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar size="lg">
                        <AvatarFallback>
                          {post.authorName
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-semibold">{post.authorName}</h3>
                        <time className="shrink-0 text-xs text-muted-foreground">
                          {post.relativeTime}
                        </time>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-6">
                        {post.body}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
