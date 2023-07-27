import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../AppContext.js';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Form, Image, ListGroup, Navbar, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

export default function Cell() {
  const { server, user } = useContext(AppContext);
  const [cellData, setCellData] = useState([]);
  const { cell_endpoint } = useParams();

  useEffect(() => {
    fetch(`${server}/cell/${cell_endpoint}`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => {
        setCellData(data[0]);
        console.log(data[0]);
      })
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, [server, cell_endpoint]);

  return (
    <>
      <div style={{ color: 'white' }}>
        This is the Cell Component! We should add an error catch JSX if cell fetch doesn't work because cell doesnt exist.
      </div>
      <MissionProposeRow />
      <TeamContactRow />
      <ProjectListRow />
      <StayUpToDateRow />

      {JSON.stringify(cellData)}
    </>
  );

  function CellNavBar() {
    return (
      <Container
        fluid
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <Navbar
          className="bg-body-tertiary w-100"
          data-bs-theme="dark"
        >
          <Form className="w-100">
            <Row className="w-100">
              <Col md="2">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  style={{ marginLeft: '10px' }}
                />
              </Col>
              <Col md="1">
                <Button
                  variant="dark"
                  type="submit"
                >
                  Submit
                </Button>
              </Col>
              <Col md="9">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="dark"
                    id="resource-dropdown"
                    className="w-100"
                  >
                    Resources
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    <Dropdown.Item href="http://localhost:3000/">Proposal Guidelines</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Form>
        </Navbar>
      </Container>
    );
  }

  function MissionProposeRow() {
    return (
      <Container
        fluid
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <Row className="mt-4 align-items-stretch">
          <Col md="8">
            <Card>
              <Card.Body className="d-flex flex-column h-100">
                <Card.Title>Cell Mission</Card.Title>
                <Row>
                  <Col md="auto">
                    <img
                      style={{ height: '64px', width: '64px' }}
                      src="../images/placeholder_logo.svg"
                      alt=""
                    />
                  </Col>
                  <Col>{cellData.cell_mission}</Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column h-100">
                {user && (
                  <>
                    <Card.Title>Project Proposal</Card.Title>
                    <Button
                      variant="primary"
                      as={Link}
                      to={`/cell/${cellData.cell_endpoint}/proposed-projects`}
                    >
                      {user.roles === '' ? 'Your Proposed Projects' : 'Proposed Projects'}
                    </Button>
                    <Button
                      variant="success"
                      as={Link}
                      to={`/cell/${cellData.cell_endpoint}/new-proposal`}
                      className="mt-3"
                    >
                      Submit New Proposal
                    </Button>
                  </>
                )}
                {!user && <p>Please login first to submit a new proposal.</p>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  function TeamContactRow() {
    const [teamList, setTeamList] = useState([]);

    useEffect(() => {
      fetch(`${server}/cell/${cell_endpoint}/team`)
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(data => setTeamList(data))
        .catch(err => console.log(`Fetch failed. Error: ${err}`));
    }, []);

    return (
      <Container
        fluid
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <Row
          className="mt-4 align-items-stretch"
          style={{ maxHeight: '400px' }}
        >
          <Col md="8">
            <Card>
              <Card.Body className="d-flex flex-column h-100">
                <Card.Title>Meet the Team</Card.Title>
                <Row>
                  {teamList.map((member, index) => {
                    const imgUrl = member.photo_url
                      ? member.photo_url.startsWith('https')
                        ? member.photo_url
                        : `http://localhost:3000/uploads/${member.photo_url}`
                      : `../images/placeholder_logo.svg`;
                    return (
                      <Col
                        md="auto"
                        key={`${member}-${index}`}
                      >
                        <Image
                          style={{ height: '64px', width: '64px' }}
                          src={imgUrl}
                          alt="Member Profile"
                          rounded
                        />
                        <br />
                        {member.first_name} {member.last_name}
                      </Col>
                    );
                  })}
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column h-100">
                <Card.Title>Contact the Team</Card.Title>
                {cellData.email}
                <br />
                {cellData.contact_number1}
                <br />
                {cellData.contact_number2}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  function ProjectListRow() {
    const [currentList, setCurrentList] = useState([]);
    const [previousList, setPreviousList] = useState([]);

    useEffect(() => {
      fetch(`${server}/cell/${cell_endpoint}/current_projects`)
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(data => setCurrentList(data))
        .catch(err => console.log(`Fetch failed. Error: ${err}`));
    }, []);

    useEffect(() => {
      fetch(`${server}/cell/${cell_endpoint}/previous_projects`)
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(data => setPreviousList(data))
        .catch(err => console.log(`Fetch failed. Error: ${err}`));
    }, []);

    return (
      <Container
        fluid
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <Row
          className="mt-4 align-items-stretch"
          style={{ maxHeight: '400px' }}
        >
          <Col>
            <Card>
              <Card.Body className="d-flex flex-column h-100">
                <Card.Title>Current Projects</Card.Title>
                <ListGroup style={{ overflowY: 'auto' }}>
                  {currentList.map((item, index) => (
                    <ListGroup.Item
                      action
                      as={Link}
                      to={`/project/${item.id}`}
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
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                            {item.description}
                          </div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body className="d-flex flex-column h-100">
                <Card.Title>Previous Projects</Card.Title>
                <ListGroup style={{ overflowY: 'auto' }}>
                  {previousList.map((item, index) => (
                    <ListGroup.Item
                      action
                      href={`/project/${item.id}`}
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
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                            {item.description}
                          </div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  function StayUpToDateRow() {
    return (
      <Container
        fluid
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <Row
          className="mt-4 align-items-stretch"
          style={{ maxHeight: '400px' }}
        >
          <Col>
            <Card>
              <Card.Body className="d-flex flex-column h-100">
                <Card.Title>Stay up to Date</Card.Title>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
