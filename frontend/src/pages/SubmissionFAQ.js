import { useState, useEffect, useContext } from 'react';
import { Accordion, Card, Button, Form } from 'react-bootstrap';
import AppContext from '../AppContext.js';

const SubmissionFAQ = () => {
  const { server, user } = useContext(AppContext);
  const [faq, setFaq] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [ refresh, setRefresh ] = useState(false);

  useEffect(() => {
    fetch(`${server}/faq`)
      .then((res) => res.json())
      .then((data) => setFaq(data))
      .then(setRefresh(false))
      .catch((err) => console.log(`Fetch failed. Error: ${err}`));
  }, [server, refresh]);

  const handleQuestionChange = (event) => {
    console.log(event.target.value)
    setQuestion(event.target.value);
  };

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleNewQuestionChange = (event) => {
    console.log(event.target.value)
    setNewQuestion(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newQuestion.trim() === '') return;
    
    const response = fetch(`${server}/faq`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ 
        question: newQuestion.trim(),
        asked_by: user.id 
      }),
    });
    console.log(`User submitted question: ${newQuestion.trim()}`);
    setRefresh(true)
  };

  const handleEdit = (index) => {
    console.log(`User clicked "Edit" on FAQ item ${index}`);
    setQuestion(faq[index].question);
    setAnswer(faq[index].answer)
    setIsEditing(index);
  };

  const handleSave = (faqId) => {
    console.log(`User clicked "Save" on FAQ item ${faqId}`);
    fetch(`${server}/faq/${faqId}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify({answer: answer, question: question, answered_by: user.id})
    })
    setIsEditing(false);
    setRefresh(true)
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // const faqData = [
  //   {
  //     question: 'What is Spark Hub?',
  //     answer: 'Spark Hub is a platform for creative individuals to collaborate and share ideas.',
  //   },
  //   {
  //     question: 'How do I join Spark Hub?',
  //     answer: 'You can join Spark Hub by signing up for an account and becoming a member of our community.',
  //   },
  // ];

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Frequently Asked Questions</h1>
      <Accordion>
        {faq.map((entry, index)=> // This part isnt returning the jsx it needs to be surronded in () or { return () } kk
          (
            <Accordion.Item eventKey={index.toString()} className="mt-3">
              <Accordion.Header>
                <h4>{entry.question}</h4>
              </Accordion.Header>
              {(isEditing === index) ? 
                (
                  <Accordion.Body>
                    <Form >
                      <Form.Group controlId="formQuestion">
                        <Form.Control
                          type="text"
                          value={question}
                          onChange={handleQuestionChange}
                        />
                        <Form.Control
                          type="text"
                          value={answer}
                          onChange={handleAnswerChange}
                        />
                        <Button variant="primary" onClick={() => handleSave(entry.id)}>
                          Save
                        </Button>
                        <Button variant="danger" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </Form.Group>
                    </Form>
                  </Accordion.Body>
                )
                :(
                  <Accordion.Body>
                    <p>{entry.answer}</p>
                    {user?.roles === 'site' &&(
                      <button variant = "secondary" onClick={() => handleEdit(index)} className="ms-2">
                      Edit
                      </button>  
                    )}
                  </Accordion.Body>
                )
              }
            </Accordion.Item>
          )
        )}    
      </Accordion>

      <Form onSubmit={handleSubmit} className="mt-5">
        <Form.Group controlId="formQuestion">
          <Form.Label>
            <h3>Ask a Question</h3>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your question"
            value={newQuestion}
            onChange={handleNewQuestionChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" align="right">
          Submit
        </Button>
      </Form>

      <Accordion className="mt-4">
        {questionsList.map((q, index) => (
          <Card key={index}>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey={index.toString()}>
                Question {index + 1}
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={index.toString()}>
              <Card.Body>{q}</Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default SubmissionFAQ;