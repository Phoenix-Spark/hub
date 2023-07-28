import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import AppContext from '../AppContext.js';
import HorizontalTeamList from '../components/Cell/HorizontalTeamList.jsx';
import ProjectList from '../components/Cell/ProjectList.jsx';

export default function Cell() {
  const { cell_endpoint } = useParams();
  const { server, user } = useContext(AppContext);
  const [cellData, setCellData] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [previousList, setPreviousList] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    fetch(`${server}/cell/${cell_endpoint}/team`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => setTeamList(data))
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, []);

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
    <>
      <div style={{ color: 'white' }}>
        This is the Cell Component! We should add an error catch JSX if cell fetch doesn't work because cell doesnt exist.
      </div>
      <Row className="mb-3">
        <Col md={8}>
          <Card className="h-100">
            <Card.Header as="h5">Cell Mission</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
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
        <Col md={4}>
          <Card className="h-100">
            <Card.Header as="h5">Project Proposal</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              {user && (
                <>
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
      <Row className="mb-3">
        <Col md={8}>
          <Card>
            <Card.Header as="h5">Meet the Team</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              <Row>
                <HorizontalTeamList teamList={teamList}></HorizontalTeamList>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Header as="h5">Contact the Team</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              {cellData.email}
              <br />
              {cellData.contact_number1}
              <br />
              {cellData.contact_number2}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col style={{ 'max-height': '300px' }}>
          <Card className="h-100">
            <Card.Header as="h5">Current Projects</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              <ProjectList projects={currentList} />
            </Card.Body>
          </Card>
        </Col>
        <Col style={{ 'max-height': '300px' }}>
          <Card className="h-100">
            <Card.Header as="h5">Previous Projects</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              <ProjectList projects={previousList} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header as="h5">Recent News</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {JSON.stringify(cellData)}
    </>
  );
}
