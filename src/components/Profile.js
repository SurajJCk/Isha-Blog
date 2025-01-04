import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabaseClient";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile data:", error);
      } else {
        setProfileData(data);
      }
      setLoading(false);
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Profile</h1>
      {profileData ? (
        <div>
          <p>
            <strong>Name:</strong> {profileData.name}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Admin Status:</strong> {profileData.is_admin ? "Yes" : "No"}
          </p>
        </div>
      ) : (
        <p>No profile data found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
