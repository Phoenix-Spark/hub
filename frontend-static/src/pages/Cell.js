import React, { useContext } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import HorizontalTeamList from '../components/Cell/HorizontalTeamList.jsx';

import useFetch from './useFetch.js';
import AppContext from '../AppContext.js';

export default function Cell() {
  const { setProfileModal, frontendUrl } = useContext(AppContext);
  const { cellId } = useParams();
  const localCellPath = './cells.json';

  const { data: cellData, isLoading, error } = useFetch(localCellPath);

  if (isLoading) {
    return <p className="my-3">Loading...</p>;
  }

  if (error) {
    return <p className="my-3">Error loading cell data</p>;
  }

  return (
    <>
      <Row>
        <Col>
          <h1 className="my-3">Welcome to {cellData?.cell?.name}!</h1>
          <h4>Located at {cellData?.baseData?.name}</h4>
        </Col>
      </Row>
      <Row className="my-3 row-gap-3">
        <Col
          sm={12}
          lg={4}
          className="order-md-0"
        >
          <Card className="h-100">
            <Card.Header as="h5">Project Proposal</Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center h-100">
              <Button variant="success">Submit New Proposal</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col
          lg={8}
          sm={12}
        >
          <Card className="h-100">
            <Card.Header
              as="h5"
              className="justify-content-between"
            >
              Cell Mission
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
                <Col>{cellData?.cell?.mission || 'No mission yet.'}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col
          lg={4}
          sm={12}
        >
          <Card className="h-100">
            <Card.Header as="h5">Contact the Team</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              {cellData?.cell?.email}
              <br />
              {cellData?.cell?.contactNumbers[0]}
              <br />
              {cellData?.cell?.contactNumbers[1]}
            </Card.Body>
          </Card>
        </Col>
        <Col
          lg={8}
          sm={12}
          className=""
        >
          <Card>
            <Card.Header as="h5">Meet the Team</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              <HorizontalTeamList
                teamList={cellData?.team}
                setProfileModal={setProfileModal}
                frontendUrl={frontendUrl}
              ></HorizontalTeamList>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
