import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';

import AppContext from '../AppContext.js';

const ProposedProjects = ({ cell }) => {
  const { server, user } = useContext(AppContext);
  const [proposedList, setProposedList] = useState([]);
  const { cell_endpoint } = useParams();

  /*   const ProposedProjects = [
    { id: 1, title: 'Project 1', description: 'Description for Project 1' },
    { id: 2, title: 'Project 2', description: 'Description for Project 2' },
    { id: 3, title: 'Project 3', description: 'Description for Project 3' },
    { id: 4, title: 'Project 4', description: 'Description for Project 4' },
  ]; */

  useEffect(() => {
    let ignore = false;
    const getProposedProjects = async () => {
      try {
        const response = await fetch(`${server}/cell/${cell}/proposed_projects`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (!ignore) setProposedList(data);
        } else if (response.status === 401) {
          if (!ignore) setProposedList([]);
        }
      } catch (e) {
        console.error(`There was an error: ${e}`);
      }
    };
    if (user) {
      getProposedProjects();
    } 
    return () => (ignore = true);
    //
    //   .then(res => {
    //     conso  le.log(res);
    //     return res.json();
    //   })
    //   .then(data => setProposedList(data))
    //   .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, [user]);

  const renderTooltip = () => <Tooltip id="tooltip">The review process may take up to five business days</Tooltip>;

  return (
    <Container>
      {proposedList.map(
        (
          project //hard-coded data
        ) => (
          <OverlayTrigger
            key={project.id}
            placement="top"
            overlay={renderTooltip()}
          >
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{project.name}</Card.Title>
                <Card.Text>{project.description}</Card.Text>
                {(user?.roles === 'site' || user?.roles === 'cell') && (
                  <div className="d-flex justify-content-between">
                    <Button variant="success">Approve</Button>
                    <Button variant="danger">Deny</Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </OverlayTrigger>
        )
      )}
     </Container>
  );
};

export default ProposedProjects;
