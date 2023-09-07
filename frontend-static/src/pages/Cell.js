import React, { useContext } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import HorizontalTeamList from '../components/Cell/HorizontalTeamList.jsx';

import AppContext from '../AppContext.js';
import { useFetchCellData } from '../utils/useFetch.js';

export default function Cell() {
  const { setProfileModal, frontendUrl } = useContext(AppContext);
  const { cellId } = useParams();

  const endpoint = window.location.pathname.split('/');
  const [data, isLoading, error] = useFetchCellData(endpoint[endpoint.length - 1]);

  if (isLoading) {
    return <p className="my-3">Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p className="my-3">Error loading cell data</p>;
  }

  const imgUrl = data.logo_url
    ? data.logo_url.startsWith('https')
      ? data.logo_url
      : `${window.location.origin}/hub${data.logo_url}`
    : `${window.location.origin}/hub/images/placeholder_logo.svg`;

  return (
    <>
      <Row>
        <Col>
          <h1 className="my-3">Welcome to {data?.name}!</h1>
          <h4>Located at {data?.base?.name}</h4>
        </Col>
      </Row>
      <Row className="my-3 row-gap-3">
        <Col
          sm={12}
          lg={4}
          className="order-md-0"
        >
          <Card className="h-100">
            <Card.Header as="h5">Specialties</Card.Header>
            <Card.Body className="h-100 h5">
              {data.competencies?.map(item => (
                <span className="badge rounded-pill text-bg-success my-2 mx-1">{item}</span>
              ))}
              {/*<a*/}
              {/*  className="btn btn-success"*/}
              {/*  href="https://forms.office.com/r/TPv5X54zVA"*/}
              {/*  target="_blank"*/}
              {/*  rel="noreferrer"*/}
              {/*>*/}
              {/*  Submit A New Idea*/}
              {/*</a>*/}
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
                    src={imgUrl}
                    alt=""
                  />
                </Col>
                <Col>{data?.mission || 'No mission yet.'}</Col>
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
              {data?.email}
              <br />
              {data?.contact_number1}
              <br />
              {data?.contact_number2}
              <br />
              <a
                href={data?.external_website}
                target="_blank"
                rel="noreferrer"
              >
                {data?.external_website}
              </a>
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
                teamList={data?.team}
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
