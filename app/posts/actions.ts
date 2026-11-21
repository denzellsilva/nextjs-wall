"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SubmitPostState = {
  success: boolean;
  error?: string;
  body?: string;
};

export async function submitPost(
  _previousState: SubmitPostState,
  formData: FormData,
): Promise<SubmitPostState> {
  const body = String(formData.get("body") ?? "").trim();

  if (!body) {
    return { success: false, error: "Post cannot be empty." };
  }

  if (body.length > 280) {
    return { success: false, error: "Post cannot exceed 280 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_name: "Marl Denzell J. Silva",
      body,
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
