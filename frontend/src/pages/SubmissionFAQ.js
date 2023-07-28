import React, { useState } from 'react';
import { Accordion, Card, Button, Form } from 'react-bootstrap';

const SubmissionFAQ = () => {
  const [question, setQuestion] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleQuestionSubmit = (event) => {
    event.preventDefault();
    if (question.trim() === '') return;
    setQuestionsList([...questionsList, question.trim()]);
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
        {faqData.map((item, index) => (
          <Card key={index}>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey={index.toString()}>
                {item.question}
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={index.toString()}>
              <Card.Body>{item.answer}</Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
      <Form onSubmit={handleQuestionSubmit}>
        <Form.Group controlId="formQuestion">
          <Form.Label>Ask a Question</Form.Label>
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
