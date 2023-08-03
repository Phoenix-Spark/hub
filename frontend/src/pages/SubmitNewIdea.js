import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ProposalForm from '../components/Modals/Proposal/ProposalForm.jsx';
import LoginButton from '../components/Login/LoginButton.jsx';
import AppContext from '../AppContext.js';

const SubmitNewIdea = () => {  
  const { user } = useContext(AppContext);
  // showAlert
  return (
    <>
      {user && (
        <ProposalForm showCellList={true} isModal={false} cellId={user?.cellId}></ProposalForm>
      )}
      {!user && (
        <Container className="mt-3">
          <Row>
            <Col>
              <p className="text-center">To submit an idea to a Spark Cell, please create an account or log in first.</p>
              <p className="text-center"><LoginButton /></p>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default SubmitNewIdea;
