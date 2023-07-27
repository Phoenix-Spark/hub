import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import AppContext from '../AppContext.js';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Tooltip, OverlayTrigger } from 'react-bootstrap'

const ProposedProjects = () => {
  const { server } = useContext(AppContext);
  const [proposedList, setProposedList] = useState([]);
  const { cell_endpoint } = useParams();

  const proposedProjects = [
    { id: 1, title: 'Project 1', description: 'Description for Project 1' },
    { id: 2, title: 'Project 2', description: 'Description for Project 2' },
    { id: 3, title: 'Project 3', description: 'Description for Project 3' },
    { id: 4, title: 'Project 4', description: 'Description for Project 4' },
  ];

  useEffect(() => {
    fetch(`${server}/cell/${cell_endpoint}/proposed_projects`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => setProposedList(data))
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, []);

  const renderTooltip = () => (
    <Tooltip id='tooltip'>The review proces may take up to five business days</Tooltip>
  )

  return (
    <Container>
      <div style={{color: "white"}}>{JSON.stringify(proposedList)}</div> {/*data from server*/}

      {proposedProjects.map((project) => (  //hard-coded data
        <OverlayTrigger
          key={project.id}
          placement="top"
          overlay={renderTooltip()}
        >
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{project.title}</Card.Title>
              <Card.Text>{project.description}</Card.Text>
              <div className="d-flex justify-content-between">
                <Button variant="success">Approve</Button>
                <Button variant="danger">Deny</Button>
              </div>
            </Card.Body>
          </Card>
        </OverlayTrigger>
      ))}
      <Link to="/new-proposal" className="btn btn-primary">Create New Proposal</Link>
    </Container>
  );
};

export default ProposedProjects;
