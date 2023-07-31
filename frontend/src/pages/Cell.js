import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

import AppContext from '../AppContext.js';
import HorizontalTeamList from '../components/Cell/HorizontalTeamList.jsx';
import ProjectList from '../components/Cell/ProjectList.jsx';
import ProposalModal from '../components/Cell/ProposalModal.jsx';
import { NewsList } from '../components/index.js';

export default function Cell() {
  const { cell_endpoint } = useParams();
  const { server, user } = useContext(AppContext);
  const [cellAllData, setCellAllData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newsList, setNewsList] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    const fetchCellData = async () => {
      try {
        const response = await fetch(`${server}/cell/${cell_endpoint}/all`);
        if (response.ok) {
          const data = await response.json();
          if (!ignore) setCellAllData(data);
        } else if (response.status === 404) {
          Navigate('/');
        }
      } catch (e) {
        console.error(`Fetch failed. Error: ${e}`);
      }
    };

    const fetchCellNews = async () => {
      try {
        const response = await fetch(`${server}/cell/${cell_endpoint}/news`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (!ignore) setNewsList(data);
        }
      } catch (e) {
        console.error(`There was an error. ${e}`);
      }
    };

    fetchCellData();
    fetchCellNews();

    return () => {
      ignore = true;
    };
  }, [server, cell_endpoint]);

  const showProposalModal = () => setShowModal(true);
  const hideProposalModal = () => setShowModal(false);

  return (
    <>
      <Row>
        <Col>
          <h1 className="my-3">Welcome to, {cellAllData.cell_name}!</h1>
          <h4>Located at {cellAllData.baseData?.base_name}</h4>
        </Col>
      </Row>
      <Row className="my-3">
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
                <Col>{cellAllData?.cell_mission}</Col>
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
                  {parseInt(user.cellId, 10) === cellAllData.id && (
                    <Button
                      variant="primary"
                      as={Link}
                      to={`/dashboard/projects`}
                    >
                      {user.roles === '' ? 'Your Proposed Projects' : 'View Proposed Projects'}
                    </Button>
                  )}
                  <Button
                    variant="success"
                    onClick={showProposalModal}
                    className="mt-3"
                  >
                    Submit New Proposal
                  </Button>
                  <ProposalModal
                    show={showModal}
                    onHide={hideProposalModal}
                  />
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
              <HorizontalTeamList teamList={cellAllData?.team}></HorizontalTeamList>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Header as="h5">Contact the Team</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              {cellAllData.email}
              <br />
              {cellAllData.contact_number1}
              <br />
              {cellAllData.contact_number2}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col style={{ maxHeight: '300px' }}>
          <Card className="h-100">
            <Card.Header as="h5">Current Projects</Card.Header>
            <Card.Body className="d-flex flex-column h-100 overflow-scroll">
              <ProjectList projects={cellAllData.current_projects} />
            </Card.Body>
          </Card>
        </Col>
        <Col style={{ maxHeight: '300px' }}>
          <Card className="h-100">
            <Card.Header as="h5">Previous Projects</Card.Header>
            <Card.Body className="d-flex flex-column h-100 overflow-scroll">
              <ProjectList projects={cellAllData.previous_projects} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ maxHeight: '415px' }}>
            <Card.Header as="h5">Recent News</Card.Header>
            <Card.Body className="d-flex flex-column h-100 overflow-scroll">
              <NewsList newsList={newsList}></NewsList>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
