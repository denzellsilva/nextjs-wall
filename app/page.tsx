"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
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

const initialPosts: Post[] = [
  {
    id: "1",
    authorName: "Anna",
    body: "Hey Marl, did you debug your coffee maker yet? Last cup tasted like JavaScript errors.",
    createdAt: "2026-11-19T20:20:00+08:00",
    relativeTime: "4h",
  },
  {
    id: "2",
    authorName: "Adelaida",
    body: "Marl, saw your last coding session—pretty sure you broke Stack Overflow again!",
    createdAt: "2026-11-19T18:45:00+08:00",
    relativeTime: "6h",
  },
  {
    id: "3",
    authorName: "Juho",
    body: "Are you still coding in pajamas, or have you upgraded to full-time sweatpants mode?",
    createdAt: "2026-11-19T14:10:00+08:00",
    relativeTime: "10h",
  },
  {
    id: "4",
    authorName: "Maija",
    body: "Rumor has it your computer has more stickers than code running on it. Confirm?",
    createdAt: "2026-11-18T21:30:00+08:00",
    relativeTime: "1d",
  },
];

export default function Home() {
  const [posts] = useState(initialPosts);

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
          <CreatePostForm
            authorName={profileName}
            avatarSrc="/denzell.jpg"
          />

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
