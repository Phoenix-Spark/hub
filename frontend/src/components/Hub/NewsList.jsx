import React, { useState } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/index.js';

function NewsList({ newsList }) {
  const [missionCardHeight, setMissionCardHeight] = useState('300px');

  // useEffect(() => {
  //   function handleResize() {
  //     const height = document.getElementById('mission-card') ? `${document.getElementById('mission-card').clientHeight + 2}px` : '300px';
  //     setMissionCardHeight(height);
  //   }
  //   handleResize();
  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  return (
    <ListGroup
      style={{ overflowY: 'scroll' }}
      className="h-100"
    >
      {newsList.map((item, index) => (
        <ListGroup.Item
          action
          to={'/'}
          as={Link}
          key={index}
        >
          <Row>
            <Col md="auto">
              <img
                style={{ height: '64px', width: '64px' }}
                src="./images/placeholder_logo.svg"
                alt=""
              />
            </Col>
            <Col>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold' }}>{formatDate(new Date(item.date).toString())}</div>
                {item.news}
              </div>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default NewsList;
