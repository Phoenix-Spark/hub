import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Image, Modal, Row, ListGroup } from 'react-bootstrap';
import AppContext from '../../../AppContext.js';

const AddMemberModal = ({isModalShowing, hideModal, refreshMemberList, server, memberList, projectId}) => {
  const { frontendUrl } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMembers = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append('projectId', projectId);

    console.log(formData);

    const response = await fetch(`${server}/project/${projectId}/team/add`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    //const data = await response.json();

    console.log(response);
    // make fetch
    // Refresh Member List on main page

    if (response.ok) {
      refreshMemberList(prev => prev + 1);
      setIsLoading(false);
      hideModal();
    }
    setIsLoading(false);
  }

  return (
    <Modal
      size="sm"
      centered
      show={isModalShowing}
      onHide={hideModal}
    >
            <Form onSubmit={handleAddMembers}>
      <Modal.Header closeButton>
        <Modal.Title>Pick a Team</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <ListGroup as="ul">
              {Array.from(memberList).map(member => {
                let imgUrl = member.photo
                  ? member.photo.startsWith('https')
                    ? member.photo
                    : `${frontendUrl}/uploads/${member.photo}`
                  : `../images/placeholder_logo.svg`
                return (
                <ListGroup.Item as="li">
                  <input type="checkbox" className="btn-check" name="member" value={member.id} id={`member-${member.id}`}/>
                  <label className="btn btn-outline-secondary w-100 text-start border-0" htmlFor={`member-${member.id}`}>
                    <Image src={imgUrl} width="47" className="me-2 border border-black" />
                    {`${member.firstName} ${member.lastName}`}
                  </label>
                </ListGroup.Item>
              )}
            )}
            </ListGroup>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button
          variant="secondary"
          onClick={hideModal}
        >
          Close
        </Button>
            <Button type="submit" disabled={isLoading}>Add Members</Button>
      </Modal.Footer>
            </Form>
    </Modal>
  );
};

export default AddMemberModal;
