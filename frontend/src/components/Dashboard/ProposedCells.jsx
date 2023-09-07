import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';

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
    fetch(`${server}/cell/list?approved=no`)
      .then(response => response.json())
      .then(cells => {
        // const unapproved = cells.filter(cell => cell.is_approved === 'no');
        setUnapprovedCells(cells);
      })
      .catch(error => {
        console.error('Error fetching cell list:', error);
      });
  };

  const fetchBaseInfo = baseId => {
    fetch(`${server}/base/list`)
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
    const cellToUpdate = unapprovedCells.find(cell => cell.id === cellId);

    if (!cellToUpdate) {
      console.error(`Cell with id ${cellId} not found in unapprovedCells.`);
      return;
    }

    const updates = {
      is_approved: 'yes',
      cell_endpoint: cellToUpdate.cell_endpoint,
    };

    fetch(`${server}/cell/${cellId}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
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
    fetch(`${server}/cell/${cellId}/delete`, {
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
              <Card.Title>{cell?.name}</Card.Title>
              <Card.Text>
                Located at: {baseInfo[cell?.baseId - 1]?.baseName}{' '}
                {/*TODO this will break as we continue messing with the db- make a more robust way to call data*/}
                External website: {cell?.externalWebsite || 'Not Provided'}
                <br />
                Cell mission: {cell?.mission || 'Not Provided'}
                <br />
                Contact number 1: {cell?.contactNumbers[0]}
                <br />
                Contact number 2: {cell?.contactNumbers[1] || 'Not Provided'}
                <br />
                Email: {cell?.email}
                <br />
                Logo URL: {cell?.logoUrl || 'Not Provided'}
              </Card.Text>
              <Form.Group className="mb-3 d-flex align-items-baseline align-middle">
                <Form.Label className="me-3 text-nowrap">Suggested Endpoint: </Form.Label>
                <Form.Control
                  type="text"
                  value={cell?.endpoint}
                  style={{ width: `${Math.max(cell?.endpoint.length * 0.6)}vw`, minWidth: '10vw' }}
                  onChange={e => handleEndpointChange(cell?.id, e.target.value)}
                />
              </Form.Group>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between">
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
            </Card.Footer>
          </Card>
        ))
      )}
    </Container>
  );
}

export default ProposedCells;
