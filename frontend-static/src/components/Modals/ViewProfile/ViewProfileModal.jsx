import { useContext, useEffect, useState } from 'react';
import { Button, Col, Image, Modal, Row, Spinner } from 'react-bootstrap';
import AppContext from '../../../AppContext.js';
import { useFetchUser } from '../../../utils/useFetch.js';

const ViewProfileModal = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const { profileModal, setProfileModal } = useContext(AppContext);
  const [profileImage, setProfileImage] = useState('');
  const [cellLogo, setCellLogo] = useState('');

  let data, isLoading, error;
  [data, isLoading, error] = useFetchUser(profileModal);

  useEffect(() => {
    setProfileImage(
      data?.photo_url
        ? data.photo_url.startsWith('https')
          ? data.photo_url
          : `${window.location.origin}/hub${data.photo_url}`
        : `${window.location.origin}/hub/images/placeholder_logo.svg`
    );
    setCellLogo(
      data?.cell.logo_url
        ? data.cell.logo_url.startsWith('https')
          ? data.cell.logo_url
          : `${window.location.origin}/hub${data.cell.logo_url}`
        : `${window.location.origin}/hub/images/placeholder_logo.svg`
    );
  }, [data]);

  if (error) console.error(error);

  return (
    <Modal
      size="lg"
      centered
      show={profileModal.show}
      onHide={() => setProfileModal({ show: false, userId: 0 })}
    >
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && (
          <Row>
            <Col className="text-center">
              <Spinner />
            </Col>
          </Row>
        )}
        {!isLoading && (
          <>
            <Row>
              <Col
                md="auto"
                className="mx-4"
              >
                <Image
                  src={profileImage}
                  rounded
                  style={{ height: '300px', width: '300px' }}
                />
              </Col>
              <Col className="d-flex flex-column align-items-center justify-content-around">
                <Row className="d-flex align-items-center">
                  <Col md="auto">
                    <Image
                      src={cellLogo}
                      style={{ height: '75px', width: '75px' }}
                    />
                  </Col>
                  <Col>
                    <h4>{data.cell.name}</h4>
                  </Col>
                </Row>
                <Row>
                  <h1>
                    {data.first_name} {data.last_name}
                  </h1>
                </Row>
                <Row>
                  <h2>@{data.username}</h2>
                </Row>
                <Row>
                  <Col className="text-center">
                    <a href={`mailto:${data.email}`}>{decodeURIComponent(data.email)}</a>
                    <br />
                    <a href={`tel:${data.contact_number1}`}>{data?.contact_number1}</a>
                    <br />
                    <a href={`tel:${data.contact_number2}`}>{data?.contact_number2}</a>
                    <br />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="m-4">
              <Col>
                <p className="text-break">{data.bio}</p>
              </Col>
            </Row>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setProfileModal({ show: false, userId: 0 })}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewProfileModal;
