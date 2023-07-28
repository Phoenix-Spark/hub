import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

const Forums = () => {
  const [forumsPost, setForumsPost] = useState([
    {
      id: 1,
      title: 'First Post',
      content: 'This is the first post',
      comments: [{ id: 1, text: 'This is amazing!' }],
    },
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const handleAddPost = () => {
    const newPost = {
      id: forumsPost.length + 1,
      title: newPostTitle,
      content: newPostContent,
      comments: [],
    };

    setForumsPost([...forumsPost, newPost]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  // const handleAddComment = (postId, commentText) => {
  // 	const updatedPosts = forumsPost.map(post => {
  // 		if (post.id === postId) {
  // 			return {
  // 			post: {...post},
  // 				comments: [...post.comments, commentText]
  // 			}
  // 		}
  // 	}
  // }

  return (
    <Container>
      <h1>Forums</h1>
    </Container>
  );
};

export default Forums;
