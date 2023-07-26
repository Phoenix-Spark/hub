import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../AppContext.js';
import { Container, Row, Col, Form, Dropdown, Button, Navbar, Card, ListGroup, Carousel } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

export default function Project() {
  const { server } = useContext(AppContext);
  const [projectData, setProjectData] = useState([]);
  const { projectId } = useParams();

  useEffect(() => {
    fetch(`${server}/project/${projectId}`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => setProjectData(data[0]))
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, [server, projectId]);

  return (
    <>
      <div style={{color: "white"}}>This is the Project Component! We should add an error catch JSX if project fetch doesn't work because project doesnt exist.</div>
        <ProjectOverviewRow />
        <TeamAndPhotosRow />
        <BudgetAsksTasksRow />
      {JSON.stringify(projectData)}
    </>
  )

  function ProjectOverviewRow () {
    return (
        <Container
          fluid
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Body className="d-flex flex-column h-100">
                  <Card.Title>{projectData.name} Overview</Card.Title>
                  {projectData.description}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
    )
  }

  function TeamAndPhotosRow () {
    const [teamList, setTeamList] = useState([]);
    const [photoList, setPhotoList] = useState([]);

    useEffect(() => {
      fetch(`${server}/project/${projectId}/team`)
      .then(res => {
          console.log(res);
          return res.json();
      })
      .then(data => setTeamList(data))
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, []);

    useEffect(() => {
        fetch(`${server}/project/${projectId}/photos`)
        .then(res => {
            console.log(res);
            return res.json();
        })
        .then(data => setPhotoList(data))
        .catch(err => console.log(`Fetch failed. Error: ${err}`));
    }, []);

    return (
        <Container
          fluid
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Row className="mt-4 align-items-stretch" style={{ maxHeight: '400px' }}>
            <Col md="3">
              <Card>
                <Card.Body className="d-flex flex-column h-100">
                  <Card.Title>Team</Card.Title>
                  <ListGroup style={{ overflowY: 'auto' }}>
                    {teamList.map((item, index) => (
                      <ListGroup.Item
                        action
                        key={index}
                      >
                        <Row>
                          <Col md="auto">
                            <img
                              style={{ height: '64px', width: '64px' }}
                              src="../images/placeholder_logo.svg"
                              alt=""
                            />
                          </Col>
                          <Col>
                            <div style={{ fontWeight: "bold" }}>{item.first_name} {item.last_name}</div>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              {/* <Card className="h-100">
                <Card.Body className="d-flex flex-column h-100">
                  <Card.Title>Photos</Card.Title> */}
                  <Carousel className="h-100">
                    {photoList.map(photo=>{
                      <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src="../images/placeholder_logo.svg"
                        alt=""
                        />
                        <Carousel.Caption>
                          <h3>Photo label</h3>
                          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                      </Carousel.Item>
                    })}
                  </Carousel>
                {/* </Card.Body>
              </Card> */}
            </Col>
          </Row>
        </Container>
    )
  }

  function BudgetAsksTasksRow () {
    return (
        <Container
          fluid
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Body className="d-flex flex-column h-100">
                  <Card.Title>Budget / Asks / Tasks</Card.Title>
                  ${projectData.budget}<br/>
                  {projectData.asks_tasks}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
    )
  }
}
