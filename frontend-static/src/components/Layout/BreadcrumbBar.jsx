import React, {useEffect, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Col, Row, Container, Breadcrumb} from 'react-bootstrap';


const BreadcrumbBar = () => {
  const location = useLocation();
  const [items, setItems] = useState(new Set());

  useEffect(() => {
    setItems(new Set());
    console.log('new path', location.pathname)
    const path = location.pathname.slice(1).toLowerCase();
    console.log(path);
    switch (path) {
      case 'submissionfaq':
        setItems(items.add('Submission FAQ'))
        break;
    
      default:
        break;
    }
  }, [location.pathname])

  return (
    <Row>
      <Col>
        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{to: "/"}}>Home</Breadcrumb.Item>
          {Array.from(items)?.map(item => <Breadcrumb.Item active>{item}</Breadcrumb.Item>)}
        </Breadcrumb>
      </Col>
    </Row>
  )
}

export default BreadcrumbBar;