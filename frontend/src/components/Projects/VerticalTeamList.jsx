import { Col, ListGroup, Row } from 'react-bootstrap';

function VerticalTeamList({ team }) {
  return (
    <ListGroup style={{ overflowY: 'auto' }}>
      {team.map((item, index) => (
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
              <div style={{ fontWeight: 'bold' }}>
                {item.first_name} {item.last_name}
              </div>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default VerticalTeamList;
