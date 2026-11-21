"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const submitPostSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Post cannot be empty.")
    .max(280, "Post cannot exceed 280 characters."),
});

export type SubmitPostState = {
  success: boolean;
  error?: string;
  body?: string;
};

export async function submitPost(
  _previousState: SubmitPostState,
  formData: FormData,
): Promise<SubmitPostState> {
  const result = submitPostSchema.safeParse({
    body: formData.get("body"),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Invalid post.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_name: "Marl Denzell J. Silva",
      body: result.data.body,
    })
    .select("id, author_name, body, created_at")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");

  return {
    success: true,
    body: data.body,
  };
}
