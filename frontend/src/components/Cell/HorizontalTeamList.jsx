import { Col, Image } from 'react-bootstrap';
import { useContext } from 'react';
import AppContext from '../../AppContext.js';

function HorizontalTeamList({ teamList }) {
  const { setProfileModal } = useContext(AppContext);

  return (
    <>
      {teamList?.map((member, index) => {
        const imgUrl = member.photo_url
          ? member.photo_url.startsWith('https')
            ? member.photo_url
            : `http://localhost:3000/uploads/${member.photo_url}`
          : `../images/placeholder_logo.svg`;

        return (
          <Col
            md="auto"
            key={`${member}-${index}`}
          >
            <Image
              style={{ height: '64px', width: '64px' }}
              src={imgUrl}
              alt="Member Profile"
              onClick={()=>setProfileModal({show: true, userId: member.id})}
              rounded
            />
            <br />
            {member.first_name} {member.last_name} {member.id}
          </Col>
        );
      })}
    </>
  );
}
export default HorizontalTeamList;
