import { supabase } from "./supabaseClient";

export const getComments = async (postId) => {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles:user_id (
        name,
        avatar_url
      )
    `
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const addComment = async (postId, content) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("Current user:", user);

  if (!user) {
    console.log("No user found");
    return { error: { message: "Must be logged in to comment" } };
  }

  console.log("Attempting to add comment:", {
    postId,
    user_id: user.id,
    content,
  });

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        post_id: postId,
        user_id: user.id,
        content,
      },
    ])
    .select("*, profiles:user_id(name)")
    .single();

  console.log("Supabase response:", { data, error });
  return { data, error };
};
