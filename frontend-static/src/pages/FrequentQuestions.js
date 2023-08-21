import { useState, useEffect, useContext } from 'react';
import { Accordion } from 'react-bootstrap';
import AppContext from '../AppContext.js';

const FrequentQuestions = () => {
  const { server } = useContext(AppContext);
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${server}/faq`);

        if (response.ok) {
          const data = await response.json();
          setFaq(data);
        } else {
          throw new Error(`Error fetching questions. STATUS: ${response.status}`);
        }
      } catch (e) {
        throw new Error(`Error fetching questions. ${e}`);
      }
    };

    try {
      fetchQuestions();
    } catch (e) {
      console.error(`There was an error. ${e}`);
    }
    // fetch(`${server}/faq`)
    //   .then(res => res.json())
    //   .then(data => setFaq(data))
    //   .then(setRefresh(false))
    //   .then(console.log('should have new data'))
    //   .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, [server]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Frequently Asked Questions</h1>
      <Accordion>
        {faq.map((entry, index) => (
          <Accordion.Item
            eventKey={index.toString()}
            className="mt-3"
          >
            <Accordion.Header>
              <h4>{entry.question}</h4>
            </Accordion.Header>
            <Accordion.Body>
              <p>{entry.answer}</p>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default FrequentQuestions;
