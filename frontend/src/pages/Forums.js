import { useEffect, useState, useContext } from 'react';
import { Accordion, Button, Col, Row, ListGroup } from 'react-bootstrap';
import AppContext from '../AppContext.js';
import { formatDate } from '../utils/index.js';

const dummyData = [
  {                       //dummyData[0]
    name: '',//category
    detail: ``,
    posts: [
      {                   //dummyData[0].posts[0]
        users_id: 10,
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
          {               //dummyData[0].posts[0].comments[0]
            post_id: 1,
            users_id: 1,
            body: '',
            is_edited: false,
            edit_time: null,
            username: '',
            photo_url: '',
            replies: [
              {               //dummyData[0].posts[0].comments[0].replies[0]
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

const Forums = () => {
  const { server } = useContext(AppContext);
  const [forumData, setForumData] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${server}/forum`)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(data => {
          const newData = [...data];
          newData.forEach(cat=>{
            cat.posts = [];
          })
          setForumData(newData)
        })
        // .catch(err => console.log(`Fetch failed. Error: ${err}`));
    } catch (e) {
      console.error('There was an error.', e);
    }
  }

  const fetchPosts = async (category_index, category_id) => {
    try {
      const response = await fetch(`${server}/forum/${category_id}`)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(data => {
          const newData = [...forumData];
          const newPosts = data
          newPosts.forEach(post=>{
            post.comments = [];
          })
          newData[category_index].posts.push(...newPosts)
          setForumData(newData)
        })
        // .catch(err => console.log(`Fetch failed. Error: ${err}`));
    } catch (e) {
      console.error('There was an error.', e);
    }
  }

  const fetchComments = async (category_index, post_index, post_id) => {
    try {
      const response = await fetch(`${server}/forum/post/${post_id}/comments`)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(data => {
          const newData = [...forumData];
          const newComments = data;
          newComments.forEach(comment=>{
            comment.replies = [];
          })
          newData[category_index].posts[post_index].comments.push(...newComments)
          setForumData(newData)
        })
        // .catch(err => console.log(`Fetch failed. Error: ${err}`));
    } catch (e) {
      console.error('There was an error.', e);
    }
  }
  // /comment/:commentId/replies
  const fetchReplies = async (category_index, post_index, comment_index, comment_id) => {
    try {
      const response = await fetch(`${server}/forum/comment/${comment_id}/replies`)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(data => {
          const newData = [...forumData];
          // const newReplies = data;
          // newReplies.forEach(comment=>{
          //   comment.replies = [];
          // })
          newData[category_index].posts[post_index].comments[comment_index].replies.push(...data)
          setForumData(newData)
        })
        // .catch(err => console.log(`Fetch failed. Error: ${err}`));
    } catch (e) {
      console.error('There was an error.', e);
    }
  }

  const handleCategoryEnter = (category_index, category_id) =>
  {
    if(forumData[category_index].posts.length===0){
      fetchPosts(category_index, category_id)
    }else{

    }
  }

  const handlePostEnter = (category_index, post_index, post_id) =>
  {
    if(forumData[category_index].posts[post_index].comments.length===0){
      fetchComments(category_index, post_index, post_id)
    }else{

    }
  }

  const handleCommentEnter = (category_index, post_index, comment_index, comment_id) =>
  {
    if(forumData[category_index].posts[post_index].comments[comment_index].replies.length===0){
      fetchReplies(category_index, post_index, comment_index, comment_id)
    }else{

    }
  }

  return(
    <>
    <h1>Forums</h1>
      <Accordion className="mt-5">
        {forumData?.map((category,cat_index)=>
          <Accordion.Item key={cat_index} eventKey={cat_index}>
            <Accordion.Header><h2>{category.name}</h2></Accordion.Header>
            <Accordion.Body onEnter={()=>handleCategoryEnter(cat_index, category.id)}>
              <div className="d-flex justify-content-between"><h4>{category.detail}</h4><Button>Create A Post....</Button></div>
              <Accordion className="mt-5">
                  {forumData[cat_index].posts.map((post,post_index)=>
                    <Accordion.Item key={post_index} eventKey={post_index}>
                      <Accordion.Header>
                        <div className="d-flex w-100 me-4 justify-content-between">
                          <h5>{post.title}</h5>
                          <PostUserTag post={post}/>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body onEnter={()=>handlePostEnter(cat_index, post_index, post.id)}>
                        {post.body}
                        <br/><br/>
                        <div className="d-flex justify-content-between">
                          <h4>{`Comments(${forumData[cat_index].posts[post_index].comments.length}):`}</h4>
                          <Button>Add Comment....</Button>
                        </div>
                        <Accordion className="mt-5">
                          {forumData[cat_index].posts[post_index].comments.map((comment,comment_index)=>
                            <Accordion.Item key={`com-${cat_index}-${comment_index}`} eventKey={comment_index}>
                              <Accordion.Header>
                                <div className="d-flex w-100 me-4 justify-content-between">
                                  <h6>{comment.body.substring(0,63).concat("...")}</h6>
                                  <CommentUserTag comment={comment} />
                                </div>
                              </Accordion.Header>
                              <Accordion.Body onEnter={()=>handleCommentEnter(cat_index, post_index, comment_index, comment.id)}>
                                {comment.body}
                                <br/><br/>




                                <Accordion defaultActiveKey="0">
                                  <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                      <div className="d-flex w-100 me-4 justify-content-between">
                                        <h6>Replies</h6>
                                        <h6>{comment.replies?.length}</h6>
                                      </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                      <ListGroup>
                                        {comment.replies?.map(reply=>
                                          <ListGroup.Item>
                                            <div className="d-flex w-100 me-4 justify-content-between">
                                              <h6>{reply.body}</h6>
                                              <h6><ReplyUserTag reply={reply}/></h6>
                                            </div>
                                          </ListGroup.Item>
                                        )}
                                      </ListGroup>
                                    </Accordion.Body>
                                  </Accordion.Item>
                                </Accordion>












                              </Accordion.Body>
                            </Accordion.Item>
                          )}
                          <br/><br/>
                          <Button disabled={true}>Load More Comments....</Button>
                        </Accordion>
                      </Accordion.Body>
                    </Accordion.Item>
                  )}
                  <br/><br/>
                  <Button disabled={true}>Load More Posts....</Button>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        )}
      </Accordion>
    </>
  )

  function PostUserTag({post}) {
    return(
      <Row>
        <Col md="auto">
          <img
            style={{ height: '48px', width: '48px' }}
            src={post.photo_url}
            alt=""
          />
        </Col>
        <Col>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{formatDate(new Date(post.create_time).toString())}</div>
            <h4>{post.username}</h4>
          </div>
        </Col>
     </Row>
    )
  }

  function CommentUserTag({comment}) {
    return(
      <Row>
        <Col md="auto">
          <img
            style={{ height: '32px', width: '32px' }}
            src={comment.photo_url}
            alt=""
          />
        </Col>
        <Col>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>{formatDate(new Date(comment.create_time).toString())}</div>
            <h5>{comment.username}</h5>
          </div>
        </Col>
      </Row>
    )
  }

  function ReplyUserTag({reply}) {
    return(
      <Row>
        <Col md="auto">
          <img
            style={{ height: '24px', width: '24px' }}
            src={reply.photo_url}
            alt=""
          />
        </Col>
        <Col>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>{formatDate(new Date(reply.create_time).toString())}</div>
            <h6>{reply.username}</h6>
          </div>
        </Col>
      </Row>
    )
  }


  // function Posts({cat_index}) {
  //   return(
  //     <Accordion className="mt-5">
  //       {forumData[cat_index].posts.map((post,post_index)=>
  //         <Accordion.Item key={post_index} eventKey={post_index}>
  //           <Accordion.Header>
  //             <div className="d-flex w-100 me-4 justify-content-between">
  //               <h5>{post.title}</h5>
  //               <PostUserTag post={post}/>
  //             </div>
  //           </Accordion.Header>
  //           <Accordion.Body onEntered={()=>handlePostEnter(cat_index, post_index, post.id)}>
  //             {post.body}
  //             <br/><br/>
  //             <div className="d-flex justify-content-between"><h4>Comments:</h4><Button>Add Comment....</Button></div>
  //             <Comments cat_index={cat_index} post_index={post_index}/>
  //           </Accordion.Body>
  //         </Accordion.Item>
  //       )}
  //       <br/><br/>
  //       <Button>Load More Posts....</Button>
  //     </Accordion>
  //   )
  // }

  // function Comments({cat_index, post_index}) {
  //   return(
  //     <Accordion className="mt-5">
  //       {forumData[cat_index].posts[post_index].comments.map((comment,comment_index)=>
  //         <Accordion.Item key={comment_index} eventKey={comment_index}>
  //           <Accordion.Header>
  //             <div className="d-flex w-100 me-4 justify-content-between">
  //               <h6>{comment.body.substring(0,63).concat("...")}</h6>
  //               <CommentUserTag comment={comment} />
  //             </div>
  //           </Accordion.Header>
  //           <Accordion.Body >
  //             {comment.body}
  //             <br/><br/>
  //           </Accordion.Body>
  //         </Accordion.Item>
  //       )}
  //       <br/><br/>
  //       <Button>Load More Comments....</Button>
  //     </Accordion>
  //   )
  // }






  // const [forumsPost, setForumsPost] = useState([
  //   {
  //     id: 1,
  //     title: 'This is the title of this first post',
  //     content: 'This is the content of this first post.',
  //     comments: [{ id: 1, text: 'This is the comment on this first post.' }],
  //   },
  // ]);

  // const [newPostTitle, setNewPostTitle] = useState('');
  // const [newPostContent, setNewPostContent] = useState('');
  // const [newCommentText, setNewCommentText] = useState('');

  // const handleAddPost = () => {
  //   const newPost = {
  //     id: forumsPost.length + 1,
  //     title: newPostTitle,
  //     content: newPostContent,
  //     comments: [],
  //   };

  //   setForumsPost([...forumsPost, newPost]);
  //   setNewPostTitle('');
  //   setNewPostContent('');
  // };

  // const handleCommentChange = (e) => {
  //   setNewCommentText(e.target.value);
  // };

  // const handleAddComment = (postId) => {
  //   if (newCommentText.trim() !== '') {
  //     const updatedPosts = forumsPost.map((post) => {
  //       if (post.id === postId) {
  //         return {
  //           ...post,
  //           comments: [
  //             ...post.comments,
  //             { id: post.comments.length + 1, text: newCommentText },
  //           ],
  //         };
  //       }
  //       return post;
  //     });
  //     setForumsPost(updatedPosts);
  //     setNewCommentText('');
  //   }
  // };

  // return (
  //   <Container>
  //     <h1>Forums</h1>

  //     <Form>
  //       <Form.Group as={Row} controlId='newPostForm'>
  //         <Col sm={3}>
  //           <Form.Control
  //             type='text'
  //             placeholder='Post Title'
  //             Value={newPostTitle}
  //             onChange={(e) => setNewPostTitle(e.target.value)}
  //           />
  //         </Col>
  //         <Col sm={6}>
  //           <Form.Control
  //             as='textarea'
  //             row={3}
  //             placeholder='Post Content'
  //             Value={newPostContent}
  //             maxLength={500}
  //             onChange={(e) => setNewPostContent(e.target.value)}
  //           />
  //         </Col>
  //         <Col sm={3}>
  //           <Button onClick={handleAddPost}>Add Post</Button>
  //         </Col>
  //       </Form.Group>
  //     </Form>

  //     {forumsPost.map((post) => (
  //       <div key={post.id}>
  //         <h2>{post.title}</h2>
  //         <p>{post.content}</p>

  //         {post.comments.map((comment) => (
  //           <p key={comment.id}>{comment.text}</p>
  //         ))}

  //         <Form>
  //           <Form.Group as={Row} controlId={`addCommentForm_${post.id}`}>
  //             <Col sm={9}>
  //               <Form.Control
  //                 type='text'
  //                 placeholder='Comment here'
  //                 onChange={handleCommentChange}
  //               />
  //             </Col>
  //             <Col sm={3}>
  //               <Button onClick={() => handleAddComment(post.id)}>Add Comment</Button>
  //             </Col>
  //           </Form.Group>
  //         </Form>
  //       </div>
  //     ))}
  //   </Container>
  // );
}
export default Forums;