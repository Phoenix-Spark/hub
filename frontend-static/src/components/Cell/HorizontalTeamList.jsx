import { Col, Image, Row } from 'react-bootstrap';

import './HorizontalTeamList.scss';

function HorizontalTeamList({ teamList, setProfileModal, frontendUrl }) {
  return (
    <Row
      className="justify-content-around"
      id="horizontal-team-list"
    >
      {teamList?.length === 0 && (
        <Col>
          <p>No team members yet.</p>
        </Col>
      )}
      {teamList?.map((member, index) => {
        const imgUrl = member.photo_url
          ? member.photo_url.startsWith('https')
            ? member.photo_url
            : `${frontendUrl}/uploads/${member.photo_url}`
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
              // onClick={() => {
              //   setProfileModal({ show: true, userId: member.id });
              // }}
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
