import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import AppContext from '../AppContext.js';
import HorizontalTeamList from '../components/Cell/HorizontalTeamList.jsx';

import cells from './cells.json';
import useFetch from './useFetch.js';

export default function Cell() {
  // const { cellEndpoint } = useParams();
  // const { server } = useContext(AppContext);
  // const [data, setData] = useState({});
  // const navigate = useNavigate();

  // useEffect(() => {
  //   let ignore = false;

  //   const fetchCellData = async () => {
  //     try {
  //       const response = await fetch(`${server}/cell/${cellEndpoint}`);
  //       if (response.ok) {
  //         const data = await response.json();
  //         if (!ignore) setData(data);
  //       } else if (response.status === 404) {
  //         navigate('/');
  //       }
  //     } catch (e) {
  //       console.error(`Fetch failed. Error: ${e}`);
  //     }
  //   };

  //   fetchCellData();

  //   return () => {
  //     ignore = true;
  //   };
  // }, [server, cellEndpoint]);

  const { cellId } = useParams();
  const localCellPath = './cells.json';

  const { data: cellData, isLoading, error } = useFetch(localCellPath);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error loading cell data</div>;
  // }

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
          // className="order-md-first"
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
          // className="order-md-last"
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
              <HorizontalTeamList teamList={cellData?.team}></HorizontalTeamList>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

{
  /* <>
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
        <Button variant="success">Submit New Proposal</Button>
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
</> */
}
