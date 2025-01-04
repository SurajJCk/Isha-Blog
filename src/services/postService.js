import { supabase } from "./supabaseClient";

// Fetch all posts
export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return { error };
  }

  // Handle image URLs
  if (data) {
    data.forEach((post) => {
      if (post.image_url && !post.image_url.startsWith("http")) {
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(post.image_url);
        post.image_url = urlData.publicUrl;
      }
    });
  }

  return { data, error };
};

// Get single post
export const getPost = async (id) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { error };

  if (data?.image_url && !data.image_url.startsWith("http")) {
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(data.image_url);
    data.image_url = urlData.publicUrl;
  }

  return { data, error };
};

// Upload file
export const uploadFile = async (file, bucket) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;
    return { url: fileName, error: null };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error };
  }
};

// Create or update post
export const handlePost = async (postData, files = null) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in");

    let image_url = postData.image_url;
    let video_url = postData.video_url;

    if (files?.image) {
      const { url, error: uploadError } = await uploadFile(
        files.image,
        "images"
      );
      if (uploadError) throw uploadError;
      image_url = url;
    }

    if (files?.video) {
      const { url, error: uploadError } = await uploadFile(
        files.video,
        "videos"
      );
      if (uploadError) throw uploadError;
      video_url = url;
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert([
        {
          ...postData,
          image_url,
          video_url,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error handling post:", error);
    return { error };
  }
};

// Voting functions
export const vote = async (postId, voteType) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: { message: "Must be logged in to vote" } };

  const { data, error } = await supabase.from("votes").upsert([
    {
      post_id: postId,
      user_id: user.id,
      vote_type: voteType,
    },
  ]);

  return { data, error };
};

export const getVotes = async (postId) => {
  const { data, error } = await supabase
    .from("votes")
    .select("vote_type")
    .eq("post_id", postId);

  if (error) return { error };

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

// User role management
export const updateUserRole = async (userId, isAdmin) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Must be logged in to update user roles");
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({
        is_admin: isAdmin,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { error };
  }
};

// For backward compatibility
export const createPost = handlePost;
export const updatePost = handlePost;
export const deletePost = async (id) => {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  return { error };
};
