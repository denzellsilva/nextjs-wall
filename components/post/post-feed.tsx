"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export type Post = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  relativeTime: string;
};

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

export function mapPost(row: PostRow): Post {
  return {
    id: row.id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
    relativeTime: formatRelativeTime(row.created_at),
  };
}

export function PostFeed({
  initialPosts,
  profileName,
  profileImage,
}: {
  initialPosts: Post[];
  profileName: string;
  profileImage: string;
}) {
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    const supabase = createClient();
    supabase.realtime.setAuth();

    const channel = supabase
      .channel("posts", { config: { private: true } })
      .on("broadcast", { event: "INSERT" }, (payload) => {
        const inserted = mapPost(payload.payload as PostRow);
        setPosts((current) =>
          current.some((post) => post.id === inserted.id)
            ? current
            : [inserted, ...current].slice(0, 50),
        );
      })
      .on("broadcast", { event: "UPDATE" }, (payload) => {
        const updated = mapPost(payload.payload as PostRow);
        setPosts((current) =>
          current.map((post) => (post.id === updated.id ? updated : post)),
        );
      })
      .on("broadcast", { event: "DELETE" }, (payload) => {
        const deleted = payload.payload as Partial<PostRow>;
        if (deleted.id) {
          setPosts((current) =>
            current.filter((post) => post.id !== deleted.id),
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="pt-1">
            <div className="flex gap-3">
              {post.authorName === profileName ? (
                <Avatar size="lg">
                  <AvatarImage src={profileImage} alt={post.authorName} />
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
  );
}
