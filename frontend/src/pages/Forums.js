import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

const Forums = () => {
  const [forumsPost, setForumsPost] = useState([
    {
      id: 1,
      title: 'This is the title of this first post',
      content: 'This is the content of this first post.',
      comments: [{ id: 1, text: 'This is the comment on this first post.' }],
    },
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

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

  const handleCommentChange = (e) => {
    setNewCommentText(e.target.value);
  };

  const handleAddComment = (postId) => {
    if (newCommentText.trim() !== '') {
      const updatedPosts = forumsPost.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              { id: post.comments.length + 1, text: newCommentText },
            ],
          };
        }
        return post;
      });
      setForumsPost(updatedPosts);
      setNewCommentText(''); 
    }
  };

  return (
    <Container>
      <h1>Forums</h1>

      <Form>
        <Form.Group as={Row} controlId='newPostForm'>
          <Col sm={3}>
            <Form.Control
              type='text'
              placeholder='Post Title'
              Value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
          </Col>
          <Col sm={6}>
            <Form.Control
              as='textarea'
              row={3}
              placeholder='Post Content'
              Value={newPostContent}
              maxLength={500}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </Col>
          <Col sm={3}>
            <Button onClick={handleAddPost}>Add Post</Button>
          </Col>
        </Form.Group>
      </Form>

      {forumsPost.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>

          {post.comments.map((comment) => (
            <p key={comment.id}>{comment.text}</p>
          ))}

          <Form>
            <Form.Group as={Row} controlId={`addCommentForm_${post.id}`}>
              <Col sm={9}>
                <Form.Control
                  type='text'
                  placeholder='Comment here'
                  onChange={handleCommentChange}
                />
              </Col>
              <Col sm={3}>
                <Button onClick={() => handleAddComment(post.id)}>Add Comment</Button>
              </Col>
            </Form.Group>
          </Form>
        </div>
      ))}
    </Container>
  );
};

export default Forums;
