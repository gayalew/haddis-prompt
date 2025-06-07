"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const response = await fetch(`/api/users/${params?.id}/posts`);
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch user posts:", data);
        return;
      }
      setUserPosts(data);
    };

    if (params?.id) fetchUserPosts();
  }, [userName]);

  if (!userName) {
    return <div>No user found</div>;
  }

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s profile page. Explore ${userName}'s posts and contributions.`}
      data={userPosts}
      handleEdit={() => {}}
      handleDelete={() => {}}
    />
  );
};

export default UserProfile;
