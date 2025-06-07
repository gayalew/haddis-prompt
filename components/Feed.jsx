"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-12 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    const filtered = posts.filter((post) => {
      const tag = post?.tag?.toLowerCase() || "";
      const username = post?.username?.toLowerCase() || "";
      const postContent = post?.content?.toLowerCase() || "";
      const search = searchValue.toLowerCase();
      return (
        tag.includes(search) ||
        username.includes(search) ||
        postContent.includes(search)
      );
    });
    setFilteredPosts(filtered);
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);

    // Filter posts based on the clicked tag
    const filtered = posts.filter(
      (post) => post.tag.toLowerCase() === tag.toLowerCase()
    );
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/prompt");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data); // Initialize filteredPosts with all posts
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []); // Removed posts from dependency array to prevent infinite loop

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
