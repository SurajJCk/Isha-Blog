import { supabase } from "./supabaseClient";

export const fetchPosts = async () => {
  // Simplified query first to test
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  if (data) {
    // Handle image URLs
    data.forEach((post) => {
      if (post.image_url) {
        if (!post.image_url.startsWith("http")) {
          const { data: urlData } = supabase.storage
            .from("images")
            .getPublicUrl(post.image_url);
          post.image_url = urlData.publicUrl;
        }
      }
    });
  }

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
  // Simplified query first to test
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
  }

  if (data && data.image_url) {
    if (!data.image_url.startsWith("http")) {
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(data.image_url);
      data.image_url = urlData.publicUrl;
    }
  }

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
  try {
    // Create a unique filename with timestamp to avoid collisions
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return { error: uploadError };
    }

    // Get the full public URL using your Supabase project URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    // Log the URL for debugging
    console.log("File uploaded successfully. Public URL:", data.publicUrl);

    return {
      url: data.publicUrl,
      error: null,
    };
  } catch (error) {
    console.error("Error in uploadFile:", error);
    return { error };
  }
};

export const getVotes = async (postId) => {
  const { data, error } = await supabase
    .from("votes")
    .select("vote_type")
    .eq("post_id", postId);

  if (error) return { error };

  // Calculate total votes
  const total = data.reduce((acc, vote) => acc + vote.vote_type, 0);
  return { data: total, error: null };
};

export const getUserVote = async (postId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null };

  const { data, error } = await supabase
    .from("votes")
    .select("vote_type")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  return { data: data?.vote_type, error };
};

export const vote = async (postId, voteType) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: { message: "Must be logged in to vote" } };

  const { data: existingVote } = await getUserVote(postId);

  if (existingVote === voteType) {
    // Remove vote if clicking the same button
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
    return { data: null, error };
  } else {
    // Upsert the vote
    const { data, error } = await supabase
      .from("votes")
      .upsert({
        post_id: postId,
        user_id: user.id,
        vote_type: voteType,
      })
      .select();
    return { data, error };
  }
};

export const getPublicUrl = (bucket, filePath) => {
  if (!filePath) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return publicUrl;
};
