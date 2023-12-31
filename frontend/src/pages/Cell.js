import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

import AppContext from '../AppContext.js';
import HorizontalTeamList from '../components/Cell/HorizontalTeamList.jsx';
import ProjectList from '../components/Cell/ProjectList.jsx';
import AddProposalModal from '../components/Modals/Proposal/AddProposalModal.jsx';
import { NewsList } from '../components/index.js';

export default function Cell() {
  const { cell_endpoint } = useParams();
  const { server, user } = useContext(AppContext);
  const [data, setData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newsList, setNewsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    const fetchCellData = async () => {
      try {
        const response = await fetch(`${server}/cell/${cell_endpoint}`);
        if (response.ok) {
          const data = await response.json();
          if (!ignore) setData(data);
        } else if (response.status === 404) {
          navigate('/');
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
          <h1 className="my-3">Welcome to {data.cell?.name}!</h1>
          <h4>Located at {data.baseData?.name}</h4>
        </Col>
      </Row>
      <Row className="my-3">
        <Col md={8}>
          <Card className="h-100">
            <Card.Header
              as="h5"
              className="justify-content-between"
            >
              Cell Mission
              {(user?.roles === 'cell' || user?.roles === 'site') && parseInt(user?.cellId, 10) === data.cell?.id && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigate('/dashboard/cell-details');
                  }}
                >
                  Edit
                </Button>
              )}
            </Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              <Row>
                <Col md="auto">
                  <img
                    style={{ height: '64px', width: '64px' }}
                    src="../images/placeholder_logo.svg"
                    alt=""
                  />
                </Col>
                <Col>{data.cell?.mission || 'No mission yet.'}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Header as="h5">Project Proposal</Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center h-100">
              {user && (
                <>
                  {parseInt(user.cellId, 10) === data.cell?.id && (
                    <Button
                      variant="primary"
                      className="mb-3"
                      as={Link}
                      to={`/dashboard/projects`}
                    >
                      {user.roles === '' ? 'Your Proposed Projects' : 'View Proposed Projects'}
                    </Button>
                  )}
                  <Button
                    variant="success"
                    onClick={showProposalModal}
                  >
                    Submit New Proposal
                  </Button>
                  <AddProposalModal
                    show={showModal}
                    onHide={hideProposalModal}
                    cellId={data.cell?.id}
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
              <HorizontalTeamList teamList={data?.team}></HorizontalTeamList>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Header as="h5">Contact the Team</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              {data.cell?.email}
              <br />
              {data.cell?.contactNumbers[0]}
              <br />
              {data.cell?.contactNumbers[1]}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col style={{ maxHeight: '300px' }}>
          <Card className="h-100">
            <Card.Header as="h5">Current Projects</Card.Header>
            <Card.Body className="d-flex flex-column h-100 overflow-y-auto">
              <ProjectList projects={data.currentProjects} />
            </Card.Body>
          </Card>
        </Col>
        <Col style={{ maxHeight: '300px' }}>
          <Card className="h-100">
            <Card.Header as="h5">Previous Projects</Card.Header>
            <Card.Body className="d-flex flex-column h-100 overflow-y-auto">
              <ProjectList projects={data.previousProjects} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ maxHeight: '415px' }}>
            <Card.Header as="h5">Recent News</Card.Header>
            <Card.Body className="d-flex flex-column h-100 overflow-y-auto">
              <NewsList newsList={newsList}></NewsList>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
