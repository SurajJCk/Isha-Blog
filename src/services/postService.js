import { supabase } from "./supabaseClient";

export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
};

export const createPost = async (postData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: "You must be logged in to create a post" } };
  }

  const { title, content, author_name, place, image_url, video_url } = postData;

  // Use the provided author_name or fall back to user metadata
  const finalAuthorName =
    author_name || user.user_metadata?.full_name || user.email;

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        title,
        content,
        user_id: user.id,
        author_name: finalAuthorName,
        place,
        image_url,
        video_url,
      },
    ])
    .select()
    .single();

  return { data, error };
};

export const getPost = async (id) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
};

export const updatePost = async (id, postData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: "You must be logged in to update a post" } };
  }

  // First check if the user owns this post
  const { data: existingPost } = await getPost(id);
  if (existingPost?.user_id !== user.id) {
    return { error: { message: "You can only edit your own posts" } };
  }

  const { data, error } = await supabase
    .from("posts")
    .update(postData)
    .eq("id", id)
    .select();

  return { data, error };
};

export const deletePost = async (id) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: "You must be logged in to delete a post" } };
  }

  // First check if the user owns this post
  const { data: existingPost } = await getPost(id);
  if (existingPost?.user_id !== user.id) {
    return { error: { message: "You can only delete your own posts" } };
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);
  return { error };
};

export const getUserPosts = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: "You must be logged in to view your posts" } };
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return { data, error };
};

// Optional: Add a function to search posts
export const searchPosts = async (searchTerm) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const uploadFile = async (file, bucket) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `${bucket}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    return { error: uploadError };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return { url: publicUrl };
};
