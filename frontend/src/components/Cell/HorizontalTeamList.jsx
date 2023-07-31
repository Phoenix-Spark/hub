import { Col, Image, Row } from 'react-bootstrap';
import { useContext } from 'react';
import AppContext from '../../AppContext.js';

import './HorizontalTeamList.scss';

function HorizontalTeamList({ teamList }) {
  const { setProfileModal } = useContext(AppContext);

  return (
    <Row
      className="justify-content-around"
      id="horizontal-team-list"
    >
      {teamList?.map((member, index) => {
        const imgUrl = member.photo_url
          ? member.photo_url.startsWith('https')
            ? member.photo_url
            : `http://localhost:3000/uploads/${member.photo_url}`
          : `../images/placeholder_logo.svg`;

        return (
          <Col
            xs="auto"
            key={`${member}-${index}`}
            className="d-flex flex-column align-items-center"
          >
            <Image
              style={{ height: '64px', width: '64px' }}
              src={imgUrl}
              alt="Member Profile"
              onClick={() => {
                console.log(member.id);
                setProfileModal({ show: true, userId: member.id });
              }}
              rounded
              className="mb-1 mx-auto"
            />
            <p className="m-0 text-center lh-1">{member.first_name}</p>
            <p className="m-0 text-center lh-1 mb-2">{member.last_name}</p>
          </Col>
        );
      })}
    </Row>
  );
}
export default HorizontalTeamList;
