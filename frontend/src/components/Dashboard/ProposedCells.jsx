import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Form, Row } from 'react-bootstrap';

import AppContext from '../../AppContext.js';

function ProposedCells() {
  const [unapprovedCells, setUnapprovedCells] = useState([]);
  const [baseInfo, setBaseInfo] = useState([]);

  const { server } = useContext(AppContext);

  useEffect(() => {
    fetchUnapprovedCells();
    fetchBaseInfo();
  }, []);

  const fetchUnapprovedCells = () => {
    fetch(`${server}/cell_list`)
      .then(response => response.json())
      .then(cells => {
        const unapproved = cells.filter(cell => cell.is_approved === 'no');
        setUnapprovedCells(unapproved);
      })
      .catch(error => {
        console.error('Error fetching cell list:', error);
      });
  };

  const fetchBaseInfo = (baseId) => {
    fetch(`${server}/base_list`)
      .then(response => response.json())
      .then(data => {
        console.log('fetch base', data);
        setBaseInfo(data);
      })
      .catch(error => {
        console.error('Error fetching base information:', error);
      });
  };

  const handleEndpointChange = (cellId, newValue) => {
    const updatedCells = unapprovedCells.map(cell => {
      if (cell.id === cellId) {
        return { ...cell, cell_endpoint: newValue };
      }
      return cell;
    });

    setUnapprovedCells(updatedCells);
  };

  const handleApproval = cellId => {
    fetch(`${server}/cell_list/${cellId}`, {
      method: 'PATCH',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        fetchUnapprovedCells();
      })
      .catch(error => {
        console.error('Error approving cell:', error);
      });
  };

  const handleDenial = cellId => {
    fetch(`${server}/cell_list/${cellId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        fetchUnapprovedCells();
      })
      .catch(error => {
        console.error('Error deleting cell:', error);
      });
  };

  return (
    <Container>
      <h4>Cells awaiting approval:</h4>
      {unapprovedCells.length === 0 ? (
        <h5>No cells currently awaiting approval</h5>
      ) : (
        unapprovedCells.map(cell => (
          <Card
            key={cell.id}
            className="mb-3"
          >
            <Card.Body>
              <Card.Title>{cell?.cell_name}</Card.Title>
              <Card.Text>
                Located at: {baseInfo[cell?.base_id - 1]?.base_name} {/*TODO this will break as we continue messing with the db- make a more robust way to call data*/}
              <Form.Group className="mb-0 d-flex align-items-center">
                <Form.Label className="me-3 text-nowrap">Suggested Endpoint: </Form.Label>
                <Form.Control
                  type="text"
                  value={cell?.cell_endpoint}
                  style={{ width: `${Math.max(cell?.cell_endpoint.length * .6)}vw`, minWidth: '10vw' }}
                  onChange={(e) => handleEndpointChange(cell?.id, e.target.value)}
                />
              </Form.Group>
                External website: {cell?.external_website ? cell.external_website : 'Not Provided'}
                <br />
                Cell mission: {cell?.cell_mission ? cell.cell_mission : 'Not Provided'}
                <br />
                Contact number 1: {cell?.contact_number1}
                <br />
                Contact number 2: {cell?.contact_number2 ? cell.contact_number2 : 'Not Provided'}
                <br />
                Email: {cell?.email}
                <br />
                Logo URL: {cell?.logo_url ? cell.logo_url : 'Not Provided'}
              </Card.Text>
              <Button
                variant="success"
                onClick={() => handleApproval(cell?.id)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                className="ms-3"
                onClick={() => handleDenial(cell?.id)}
              >
                Deny
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default ProposedCells;
