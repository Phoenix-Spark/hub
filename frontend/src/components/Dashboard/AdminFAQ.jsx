import { useEffect, useState, useContext, useRef } from 'react';
import { Button, Card, Form, Alert } from 'react-bootstrap';
import AppContext from '../../AppContext.js';

function AdminFAQ() {
  const { server, user } = useContext(AppContext);
  const [ newQuestions, setNewQuestions ] = useState([]);
  const [ refresh, setRefresh ] = useState(false);
  const [ showAnsweredAlert, setShowAnsweredAlert ] = useState(false)

  useEffect(()=>{
    fetch(`${server}/faq/new`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => {setNewQuestions(data);console.log(data)})
      .then(setRefresh(false))
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  },[refresh])

  const handleSubmit = (e, faqId) => {
    e.preventDefault();
    console.log(e.currentTarget.formAnswer.value)
    fetch(`${server}/faq/${faqId}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify({answer: e.currentTarget.formAnswer.value, answered_by: user.id})
    })
    .then(res=>console.log("submit", res))
    .then(()=>{
      setShowAnsweredAlert(true);
      setRefresh(true)})//truing this triggers useEffect to fetch again.
  }

  const handleDelete = (faqId) => {
    fetch(`${server}/faq/${faqId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    })
    .then(console.log("delete"))
    .then(setRefresh(true))//truing this triggers useEffect to fetch again.
  }

  return(
    <>
      <h2>Submitted FAQ Questions:</h2>
      <Alert show={showAnsweredAlert} variant="success">
        <Alert.Heading>Thank you!</Alert.Heading>
        <p>
          Thank you for answering a question. This answer will now be displayed on the Proposal FAQ page.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShowAnsweredAlert(false)} variant="outline-success">
            Close
          </Button>
        </div>
      </Alert>
      {newQuestions.map((question, index)=>
          <Card key={`${question.id}`} className="mt-4">
            <Card.Header as="h5" className="d-flex justify-content-between">
              <span>{question.question}</span>
              <span>
                <Button variant="danger" className='me-3' onClick={()=>handleDelete(question.id)}>
                  Delete
                </Button>
                FAQ Id: {question.id}
              </span>
            </Card.Header>
            <Card.Body style={{ borderRadius: '10px' }}>
              <Form onSubmit={(e)=>handleSubmit(e,question.id)}>
                <Form.Group controlId="formAnswer">
                  <Form.Label>
                    <h6>Answer</h6>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your answer"
                    name="formAnswer"
                    // value=''
                    // onChange={handleQuestionChange}
                  />
                </Form.Group>
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
      )}
    </>
  )
}

export default AdminFAQ;