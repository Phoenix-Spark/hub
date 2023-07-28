import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import AppContext from '../AppContext.js';
import PhotoCarousel from '../components/Projects/PhotoCarousel.jsx';
import VerticalTeamList from '../components/Projects/VerticalTeamList.jsx';

export default function Project() {
  const { server } = useContext(AppContext);
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const response = await fetch(`${server}/project/${projectId}/all`);
        if (response.ok) {
          const data = await response.json();
          if (!ignore) setProjectData(data)
        }
      } catch (e) {
        throw new Error(`There was an error. ${e}`);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <div style={{ color: 'white' }}>
        This is the Project Component! We should add an error catch JSX if project fetch doesn't work because project doesnt exist.
      </div>
      <Row className="my-3">
        <Col>
          <Card>
            <Card.Header as="h5">{projectData?.name} Overview</Card.Header>
            <Card.Body className="d-flex flex-column h-100">{projectData?.description}</Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={3}>
          <Card>
            <Card.Header>Team</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              <VerticalTeamList team={projectData?.team}></VerticalTeamList>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card
            className="h-100"
            style={{ maxHeight: '400px' }}
          >
            <Card.Header>Photos</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              <PhotoCarousel photos={projectData?.photos}></PhotoCarousel>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Header>Budget / Asks / Tasks</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              <p>${projectData?.budget}</p>
              <p>{projectData?.asks_tasks}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {JSON.stringify(projectData)}
    </>
  );
}
