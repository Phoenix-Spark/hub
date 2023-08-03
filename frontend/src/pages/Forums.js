import { useEffect, useState, useContext } from 'react';
import { Accordion, Button, Col, Form, Row, ListGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AppContext from '../AppContext.js';
import { formatDate } from '../utils/index.js';

/*
const dataStructure = [   //this demonstrates the format of the forumData state variable below
  {                       //dummyData[0] (Category 0)
    name: '',
    detail: ``,
    posts: [
      {                   //dummyData[0].posts[0] (Post 0)
        id: 1,
        users_id: 1,
        category_id: 1,
        title: '',
        body: '',
        create_time: Date.now(),
        is_edited: false,
        edit_time: null,
        views: 0,
        username: '',
        photo_url: '',
        comments: [
          {               //dummyData[0].posts[0].comments[0] (Comment 0)
            id: 1,
            post_id: 1,
            users_id: 1,
            body: '',
            create_time: Date.now(),
            is_edited: false,
            edit_time: null,
            username: '',
            photo_url: '',
            replies: [
              {               //dummyData[0].posts[0].comments[0].replies[0] (Reply 0)
                id: 1,
                comment_id: 1,
                users_id: 1,
                body: '',
                create_time: '',
                is_edited: false,
                edit_time: null,
                username: '',
                photo_url: '',
              }//, more replies...
            ]
          }//, more comments...
        ]
      }//, more posts...
    ]
  }//, more categories...
]
*/

const Forums = () => {
  const { server, user, setProfileModal } = useContext(AppContext);
  const [forumData, setForumData] = useState([]);

  //Post's States:
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [poststoShow, setPoststoShow] = useState(5);

  //Comment's States:
  const [commentBody, setCommentBody] = useState('');
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [commentstoShow, setCommentstoShow] = useState(5);

  //Reply's States:
  const [replyBody, setReplyBody] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      await fetch(`${server}/forum`)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(data => {
          const newData = [...data];
          newData.forEach(cat => {
            cat.posts = [];
          });
          setForumData(newData);
        });
    } catch (e) {
      console.error('There was an error.', e);
    }
  };

  const fetchPosts = async (category_index, category_id) => {
    try {
      await fetch(`${server}/forum/${category_id}`)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(data => {
          const newData = [...forumData];
          const newPosts = data;
          newPosts.forEach(post => {
            post.comments = [];
          });
          newData[category_index].posts.push(...newPosts);
          setForumData(newData);
        });
    } catch (e) {
      console.error('There was an error.', e);
    }
  };

  const fetchComments = async (category_index, post_index, post_id) => {
    try {
      await fetch(`${server}/forum/post/${post_id}/comments`)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(data => {
          const newData = [...forumData];
          const newComments = data;
          newComments.forEach(comment => {
            comment.replies = [];
          });
          newData[category_index].posts[post_index].comments.push(...newComments);
          setForumData(newData);
        });
    } catch (e) {
      console.error('There was an error.', e);
    }
  };

  const fetchReplies = async (category_index, post_index, comment_index, comment_id) => {
    try {
      await fetch(`${server}/forum/comment/${comment_id}/replies`)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(data => {
          const newData = [...forumData];
          newData[category_index].posts[post_index].comments[comment_index].replies.push(...data);
          setForumData(newData);
        });
    } catch (e) {
      console.error('There was an error.', e);
    }
  };

  const handleCategoryEnter = (category_index, category_id) => {
    if (forumData[category_index].posts.length === 0) {
      fetchPosts(category_index, category_id);
    } else {
    }
  };

  const handlePostEnter = (category_index, post_index, post_id) => {
    if (forumData[category_index].posts[post_index].comments.length === 0) {
      fetchComments(category_index, post_index, post_id);
    } else {
    }
  };

  const handleCommentEnter = (category_index, post_index, comment_index, comment_id) => {
    if (forumData[category_index].posts[post_index].comments[comment_index].replies.length === 0) {
      fetchReplies(category_index, post_index, comment_index, comment_id);
    } else {
    }
  };

  const createPost = async (category_id, category_index, title, body) => {
    try {
      const response = await fetch(`${server}/forum/post`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          categoryId: category_id,
          title: title,
          body: body,
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to create your post');
      }
      const data = await response.json();
      console.log('New post created:', data);

      let newData = [...forumData];
      console.log('user = ', user);
      newData[category_index].posts.unshift({ ...data, comments: [], username: user.username, photo_url: user.photo }); //fakes local data until real refresh})
      setForumData(newData);
      handleCloseCreatePostModal();
    } catch (error) {
      console.error('Error creating a post', error);
    }
  };

  const handleCreatePost = (category_id, category_index) => {
    const title = postTitle;
    const body = postBody;
    createPost(category_id, category_index, title, body);
  };

  const handleCloseCreatePostModal = () => {
    setSelectedCategory(null);
    setSelectedCategoryIndex(null);
    setShowCreatePostModal(false);
    setPostTitle('');
    setPostBody('');
  };

  const handleShowCreatePostModal = (category_id, category_index) => {
    setSelectedCategory(category_id);
    setSelectedCategoryIndex(category_index);
    setShowCreatePostModal(true);
  };

  //Add Comment Functionality
  const addComment = async (category_index, post_index, post_id, body) => {
    console.log('create comment');
    try {
      const response = await fetch(`${server}/forum/comment`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          postId: post_id,
          userId: user.id,
          body: body,
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to create your comment');
      }
      const data = await response.json();
      console.log('New comment created:', data);

      let newData = [...forumData];
      console.log(category_index, post_index, post_id, body);
      console.log(newData);
      console.log(newData.posts);
      newData[category_index].posts[post_index].comments.push({ ...data, replies: [], username: user.username, photo_url: user.photo }); //fakes local data until real refresh})
      setForumData(newData);
      handleCloseAddCommentModal();
    } catch (error) {
      console.error('Error creating a comment', error);
    }
  };

  const handleAddComment = (category_index, post_index, post_id) => {
    const body = commentBody;
    addComment(category_index, post_index, post_id, body);
  };

  const handleShowAddCommentModal = (category_index, post_index, post_id) => {
    setSelectedCategoryIndex(category_index);
    setSelectedPostIndex(post_index);
    setSelectedPost(post_id);
    setShowAddCommentModal(true);
  };

  const handleCloseAddCommentModal = () => {
    setSelectedCategoryIndex(null);
    setSelectedPostIndex(null);
    setSelectedPost(null);
    setShowAddCommentModal(false);
    setCommentBody('');
  };

  //Reply functionalities:
  const reply = async (category_index, post_index, comment_index, comment_id, body) => {
    console.log('create reply');
    try {
      const response = await fetch(`${server}/forum/reply`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          commentId: comment_id,
          userId: user.id,
          body: body,
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to create your reply');
      }
      const data = await response.json();
      console.log('New reply created:', data);

      let newData = [...forumData];
      newData[category_index].posts[post_index].comments[comment_index].replies.push({
        ...data,
        username: user.username,
        photo_url: user.photo,
      }); //fakes local data until real refresh})
      setForumData(newData);
      handleCloseReplyModal();
    } catch (error) {
      console.error('Error creating a reply', error);
    }
  };

  const handleReply = (category_index, post_index, comment_index, comment_id) => {
    const body = replyBody;
    reply(category_index, post_index, comment_index, comment_id, body);
  };

  const handleShowReplyModal = (category_index, post_index, comment_index, comment_id) => {
    setSelectedCategoryIndex(category_index);
    setSelectedPostIndex(post_index);
    setSelectedCommentIndex(comment_index);
    setSelectedComment(comment_id);
    setShowReplyModal(true);
  };

  const handleCloseReplyModal = () => {
    setSelectedCategoryIndex(null);
    setSelectedPostIndex(null);
    setSelectedCommentIndex(null);
    setSelectedComment(null);
    setShowReplyModal(false);
    setReplyBody('');
  };

  //Delete functionalities
  const handleDeletePost = async (event, postId, postIndex, catIndex) => {
    event.stopPropagation()
    try {
      const response = await fetch(`${server}/forum/post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the post.');
      }
      console.log('Post deleted successfully.');
      let newData = [...forumData];
      newData[catIndex].posts.splice(postIndex, 1);
      setForumData(newData);
    } catch (error) {
      console.error('Error deleting the post:', error);
    }
  };

  const handleDeleteComment = async (event, commentId, commentIndex, postIndex, catIndex) => {
    event.stopPropagation()
    try {
      const response = await fetch(`${server}/forum/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the comment.');
      }
      console.log('Comment deleted successfully.');
      let newData = [...forumData];
      newData[catIndex].posts[postIndex].comments.splice(commentIndex, 1);
      setForumData(newData);
    } catch (error) {
      console.error('Error deleting the comment:', error);
    }
  };

  const handleDeleteReply = async (event, replyId, replyIndex, commentIndex, postIndex, catIndex) => {
    event.stopPropagation()
    try {
      const response = await fetch(`${server}/forum/reply/${replyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the reply.');
      }
      console.log('Reply deleted successfully.');
      let newData = [...forumData];
      newData[catIndex].posts[postIndex].comments[commentIndex].replies.splice(replyIndex, 1);
      setForumData(newData); //why is this not causing rerender???
    } catch (error) {
      console.error('Error deleting the reply:', error);
    }
  };

  return (
    <>
      <br />
      <h1>Forums</h1>  
      <Accordion className="mt-5">
        {forumData?.map((category, cat_index) => (
          <Accordion.Item
            key={cat_index}
            eventKey={cat_index}
          >
            <Accordion.Header>
              <h2>{category.name}</h2>
            </Accordion.Header>
            <Accordion.Body onEnter={() => handleCategoryEnter(cat_index, category.id)}>
              <div className="d-flex justify-content-between">
                <h4>{category.detail}</h4>
                <Button
                  disabled={!user}
                  onClick={() => handleShowCreatePostModal(category.id, cat_index)}
                >
                  Create a Post...
                </Button>
              </div>
              <Accordion className="mt-5">
                {forumData[cat_index].posts.slice(0, poststoShow).map((post, post_index) => (
                  <Accordion.Item
                    key={post_index}
                    eventKey={post_index}
                  >
                    <Accordion.Header>
                      <div className="d-flex w-100 me-4 justify-content-between">
                        <div className="d-flex">
                          {user?.roles === 'site' ? (
                            <Button
                              style={{ height: '50px', flex: 'none', marginRight: '10px' }}
                              variant="danger"
                              onClick={(event) => handleDeletePost(event, post.id, post.index, cat_index)}
                            >
                              Delete
                            </Button>
                          ) : (
                            <></>
                          )}
                          <h5>{post.title}</h5>
                        </div>
                        <PostUserTag post={post} />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body onEnter={() => handlePostEnter(cat_index, post_index, post.id)}>
                      {post.body}
                      <br />
                      <br />
                      <div className="d-flex justify-content-between">
                        <h4>{`Comments(${forumData[cat_index].posts[post_index].comments.length}):`}</h4>
                        <Button
                          disabled={!user}
                          onClick={() => handleShowAddCommentModal(cat_index, post_index, post.id)}
                        >
                          Add Comment...
                        </Button>
                      </div>
                      <Accordion className="mt-5">
                        {forumData[cat_index].posts[post_index].comments.slice(0, commentstoShow[post.id] || 5).map((comment, comment_index) => (
                          <Accordion.Item
                            key={comment_index}
                            eventKey={comment_index}
                          >
                            <Accordion.Header>
                              <div className="d-flex w-100 me-4 justify-content-between">
                                <div className="d-flex">
                                  {user?.roles === 'site' ? (
                                    <Button
                                      style={{ height: '50px', flex: 'none', marginRight: '10px' }}
                                      variant="danger"
                                      onClick={(event) => handleDeleteComment(event, comment.id, comment_index, post_index, cat_index)}
                                    >
                                      Delete
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                  <h6>{comment.body.substring(0, 63).concat('...')}</h6>
                                </div>  
                                <CommentUserTag comment={comment} />
                              </div>
                            </Accordion.Header>
                            <Accordion.Body onEnter={() => handleCommentEnter(cat_index, post_index, comment_index, comment.id)}>
                              {comment.body}
                              <br />
                              <br />
                              <Accordion>
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header>
                                    <div className="d-flex w-100 me-4 justify-content-between">
                                      <h6>Replies</h6>
                                      <h6>{comment.replies.length}</h6>
                                    </div>
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <ListGroup>
                                      {comment.replies.map((reply, reply_index) => (
                                        <ListGroup.Item key={reply_index}>
                                          <div className="d-flex w-100 me-4 justify-content-between">
                                            {user?.roles === 'site' ? (
                                              <Button
                                                style={{ height: '50px', flex: 'none', marginRight: '10px' }}
                                                variant="danger"
                                                onClick={(event) =>
                                                  handleDeleteReply(event, reply.id, reply_index, comment_index, post_index, cat_index)
                                                }
                                              >
                                                Delete
                                              </Button>
                                            ) : (
                                              <></>
                                            )}
                                            <h6 className="me-5">{reply.body}</h6>
                                            <h6>
                                              <ReplyUserTag reply={reply} />
                                            </h6>
                                          </div>
                                        </ListGroup.Item>
                                      ))}
                                    </ListGroup>
                                    <div
                                      className="mt-3"
                                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                                    >
                                      <Button
                                        style={{ textAlign: 'right' }}
                                        disabled={!user}
                                        onClick={() => handleShowReplyModal(cat_index, post_index, comment_index, reply.id)}
                                      >
                                        Reply...
                                      </Button>
                                    </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                        <br />
                        <br />
                        <Button disabled={!user} 
                        onClick={() => setCommentstoShow(prev => ({...prev, [post.id]: (prev[post.id] || 5) + 5}))}
                        >
                          Load More Comments...
                        </Button>
                      </Accordion>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
                <br />
                <br />
                <Button disabled={!user} onClick={() => setPoststoShow(prev => prev +10)}>Load More Posts...</Button>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/*Post Modal*/}
      {showCreatePostModal && selectedCategory !== null && (
        <Modal
          size="lg"
          centered
          show={showCreatePostModal}
          onHide={handleCloseCreatePostModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create a New Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="postTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter post title"
                value={postTitle}
                onChange={e => setPostTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="postBody">
              <Form.Label>Body</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Type here"
                value={postBody}
                onChange={e => setPostBody(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseCreatePostModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleCreatePost(selectedCategory, selectedCategoryIndex)}
            >
              Create Post
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/*Comment Modal*/}
      {showAddCommentModal && selectedPost !== null && (
        <Modal
          size="lg"
          centered
          show={showAddCommentModal}
          onHide={handleCloseAddCommentModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add a Comment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="commentBody">
              <Form.Label>Body</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Type here"
                value={commentBody}
                onChange={e => setCommentBody(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseAddCommentModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleAddComment(selectedCategoryIndex, selectedPostIndex, selectedPost)}
            >
              Add Comment
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/*Reply Modal*/}
      {showReplyModal && selectedComment !== null && (
        <Modal
          size="lg"
          centered
          show={showReplyModal}
          onHide={handleCloseReplyModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Reply Back</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="replyBody">
              <Form.Label>Body</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Type here"
                value={replyBody}
                onChange={e => setReplyBody(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseReplyModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleReply(selectedCategoryIndex, selectedPostIndex, selectedCommentIndex, selectedComment)}
            >
              Reply
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );

  function PostUserTag({ post }) {
    return (
      <Row
        ml="5"
        style={{ minWidth: '290px' }}
      >
        <Col md="auto">
          <img
            style={{ height: '50px', width: '50px' }}
            src={post.photo_url}
            alt=""
            onClick={() => setProfileModal({ show: true, userId: post.users_id })}
          />
        </Col>
        <Col>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{formatDate(new Date(post.create_time).toString())}</div>
            <h4>{post.username}</h4>
          </div>
        </Col>
      </Row>
    );
  }

  function CommentUserTag({ comment }) {
    return (
      <Row
        ml="5"
        style={{ minWidth: '250px' }}
      >
        <Col md="auto">
          <img
            style={{ height: '40px', width: '40px' }}
            src={comment.photo_url}
            alt=""
            onClick={() => setProfileModal({ show: true, userId: comment.users_id })}
          />
        </Col>
        <Col>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>{formatDate(new Date(comment.create_time).toString())}</div>
            <h5>{comment.username}</h5>
          </div>
        </Col>
      </Row>
    );
  }

  function ReplyUserTag({ reply }) {
    return (
      <Row
        ml="5"
        style={{ minWidth: '250px' }}
      >
        <Col md="auto">
          <img
            style={{ height: '30px', width: '30px' }}
            src={reply.photo_url}
            alt=""
            onClick={() => setProfileModal({ show: true, userId: reply.users_id })}
          />
        </Col>
        <Col>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>{formatDate(new Date(reply.create_time).toString())}</div>
            <h6>{reply.username}</h6>
          </div>
        </Col>
      </Row>
    );
  }
};
export default Forums;
