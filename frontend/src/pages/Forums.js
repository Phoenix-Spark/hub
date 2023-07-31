import { useEffect, useState, useContext } from 'react';
import { Accordion, Button, Col, Row, ListGroup } from 'react-bootstrap';
import AppContext from '../AppContext.js';
import { formatDate } from '../utils/index.js';

const dataStructure = [   //this demonstrates the format of the forumData state variable below
  {                       //dummyData[0] (Category)
    name: '',
    detail: ``,
    posts: [
      {                   //dummyData[0].posts[0]
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
          {               //dummyData[0].posts[0].comments[0]
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
              {               //dummyData[0].posts[0].comments[0].replies[0]
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

const Forums = () => {
  const { server, setProfileModal } = useContext(AppContext);
  const [forumData, setForumData] = useState([]);

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
          newData.forEach(cat=>{
            cat.posts = [];
          })
          setForumData(newData)
        })
    } catch (e) {
      console.error('There was an error.', e);
    }
  }

  const fetchPosts = async (category_index, category_id) => {
    try {
      await fetch(`${server}/forum/${category_id}`)
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
    } catch (e) {
      console.error('There was an error.', e);
    }
  }

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
          newComments.forEach(comment=>{
            comment.replies = [];
          })
          newData[category_index].posts[post_index].comments.push(...newComments)
          setForumData(newData)
        })
    } catch (e) {
      console.error('There was an error.', e);
    }
  }

  const fetchReplies = async (category_index, post_index, comment_index, comment_id) => {
    try {
      await fetch(`${server}/forum/comment/${comment_id}/replies`)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(data => {
          const newData = [...forumData];
          newData[category_index].posts[post_index].comments[comment_index].replies.push(...data)
          setForumData(newData)
        })
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
    <><br/>
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
                                      {comment.replies.map(reply=>
                                        <ListGroup.Item>
                                          <div className="d-flex w-100 me-4 justify-content-between">
                                            <h6 className="me-5">{reply.body}</h6>
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
      {/* <TheForum/> */}
    </>
  )

  function PostUserTag({post}) {
    return(
      <Row>
        <Col md="auto">
          <img
            style={{ height: '50px', width: '50px' }}
            src={post.photo_url}
            alt=""
            onClick={()=>setProfileModal({show: true, userId: post.users_id})}
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
            style={{ height: '40px', width: '40px' }}
            src={comment.photo_url}
            alt=""
            onClick={()=>setProfileModal({show: true, userId: comment.users_id})}
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
      <Row ml="5" style={{ minWidth: '250px' }}>
        <Col md="auto">
          <img
            style={{ height: '30px', width: '30px' }}
            src={reply.photo_url}
            alt=""
            onClick={()=>setProfileModal({show: true, userId: reply.users_id})}
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

  // function TheForum() {
  //   return(
  //     <><br/><br/><br/><br/><br/>
  //       <h1>Forums</h1>
  //       <Accordion className="mt-5">
  //         {forumData?.map((category,cat_index)=>
  //           <Accordion.Item key={cat_index} eventKey={cat_index}>
  //             <Accordion.Header><h2>{category.name}</h2></Accordion.Header>
  //             <Accordion.Body onEnter={()=>handleCategoryEnter(cat_index, category.id)}>
  //               <div className="d-flex justify-content-between"><h4>{category.detail}</h4><Button>Create A Post....</Button></div>
  //               <Posts cat_index={cat_index}/>
  //               </Accordion.Body>
  //           </Accordion.Item>
  //         )}
  //       </Accordion>
  //     </>
  //   )
  // }

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
  //           <Accordion.Body onEnter={()=>handleCommentEnter(cat_index, post_index, comment_index, comment.id)}>
  //             {comment.body}
  //             <br/><br/>
  //             <Replies comment={comment}/>
  //           </Accordion.Body>
  //         </Accordion.Item>
  //       )}
  //       <br/><br/>
  //       <Button>Load More Comments....</Button>
  //     </Accordion>
  //   )
  // }

  // function Replies({comment}) {
  //   return(
  //     <Accordion>
  //       <Accordion.Item eventKey="0">
  //         <Accordion.Header>
  //           <div className="d-flex w-100 me-4 justify-content-between">
  //               <h6>Replies</h6>
  //               <h6>{comment.replies.length}</h6>
  //           </div>
  //         </Accordion.Header>
  //         <Accordion.Body>
  //           <ListGroup>
  //               {comment.replies.map(reply=>
  //               <ListGroup.Item>
  //                   <div className="d-flex w-100 me-4 justify-content-between">
  //                   <h6 className="me-5">{reply.body}</h6>
  //                   <h6><ReplyUserTag reply={reply}/></h6>
  //                   </div>
  //               </ListGroup.Item>
  //               )}
  //           </ListGroup>
  //         </Accordion.Body>
  //       </Accordion.Item>
  //     </Accordion>
  //   )
  // }
}
export default Forums;