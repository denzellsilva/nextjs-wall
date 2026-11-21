"use client";

import { useActionState, useState } from "react";
import { Send } from "lucide-react";
import { submitPost, type SubmitPostState } from "@/app/posts/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type CreatePostFormProps = {
  authorName: string;
  avatarSrc: string;
};

export function CreatePostForm({
  authorName,
  avatarSrc,
}: CreatePostFormProps) {
  const [body, setBody] = useState("");
  const [state, formAction, pending] = useActionState<
    SubmitPostState,
    FormData
  >(submitPost, { success: false });
  const trimmedBody = body.trim();
  const canShare = trimmedBody.length > 0 && trimmedBody.length <= 280;

  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold">Create a post</h2>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Avatar className="mt-1" size="lg">
            <AvatarImage src={avatarSrc} alt={authorName} />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
          <form
            className="min-w-0 flex-1"
            action={formAction}
            onSubmit={() => setBody("")}
          >
            <Textarea
              name="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={280}
              placeholder="What's on your mind?"
              className="min-h-24 resize-none"
              aria-label="Post text"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span
                className={
                  body.length >= 260
                    ? "text-xs font-medium text-destructive"
                    : "text-xs text-muted-foreground"
                }
              >
                {body.length}/280
              </span>
              <Button type="submit" disabled={!canShare || pending}>
                <Send />
                {pending ? "Sharing..." : "Share"}
              </Button>
              {state.error ? (
                <p className="mt-2 text-xs text-destructive">{state.error}</p>
              ) : null}
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}