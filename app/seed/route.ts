import { faker } from "@faker-js/faker";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function seedPosts() {
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "The seeder is only available in development." },
      { status: 403 },
    );
  }

  faker.seed(20261121);

  const posts = Array.from({ length: 10 }, () => ({
    author_name: faker.person.fullName(),
    body: faker.lorem.sentence({ min: 8, max: 18 }).slice(0, 280),
  }));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert(posts)
    .select("id, author_name, body, created_at");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");

  return Response.json({
    message: "Seeded 10 posts.",
    posts: data,
  });
}

export async function GET() {
  return seedPosts();
}

export async function POST() {
  return seedPosts();
}
