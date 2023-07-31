import { useState, useEffect, useContext } from 'react';
import { Accordion, Card, Button, Form } from 'react-bootstrap';
import AppContext from '../AppContext.js';

const SubmissionFAQ = () => {
  const { server } = useContext(AppContext);
  const [faq, setFaq] = useState([])

  const [question, setQuestion] = useState('');
  const [questionsList, setQuestionsList] = useState([]);


  useEffect(()=>{
    fetch(`${server}/faq`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => setFaq(data))
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  },[])

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (question.trim() === '') return;

    console.log(`User submitted question: ${question.trim()}`);
    setQuestion('');
  };

  const faqData = [
    {
      question: 'What is Spark Hub?',
      answer: 'Spark Hub is a platform for creative individuals to collaborate and share ideas.',
    },
    {
      question: 'How do I join Spark Hub?',
      answer: 'You can join Spark Hub by signing up for an account and becoming a member of our community.',
    },
  ];

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Frequently Asked Questions</h1>
      <Accordion>
        {faq.map((item, index) => (
          <Accordion.Item key={index} eventKey={index}>
            <Accordion.Header>
              <h4>{item.question}</h4>
            </Accordion.Header>
            <Accordion.Body>
              {item.answer}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <br/>
      <br/>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formQuestion">
          <Form.Label><h3>Ask a Question</h3></Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={handleQuestionChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
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