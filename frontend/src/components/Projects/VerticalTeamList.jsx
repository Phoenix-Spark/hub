import { Col, ListGroup, Row } from 'react-bootstrap';
import { useContext } from 'react';
import AppContext from '../../AppContext.js';

function VerticalTeamList({ team }) {
    const { frontendUrl, setProfileModal } = useContext(AppContext);

    return (
    <ListGroup style={{ overflowY: 'auto' }}>
      {team?.map((item, index) => {
        const imgUrl = item.photo
          ? item.photo.startsWith('https')
            ? item.photo
            : `${frontendUrl}/uploads/${item.photo}`
          : `../images/placeholder_logo.svg`;
        return (
          <ListGroup.Item
            action
            key={`${item}-${index}`}
          >
            <Row onClick={()=>setProfileModal({show: true, userId: item.id})}>
              <Col md="auto">
                <img
                  style={{ height: '64px', width: '64px' }}
                  src={imgUrl}
                  alt=""
                />
              </Col>
              <Col>
                <div style={{ fontWeight: 'bold' }}>
                  {item.firstName} {item.lastName}
                </div>
              </Col>
            </Row>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}

export default VerticalTeamList;
