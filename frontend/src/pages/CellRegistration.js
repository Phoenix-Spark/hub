import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
// import multer from 'multer';
import AppContext from '../AppContext.js';

export default function CellRegistration() {
  const { server } = useContext(AppContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [baseList, setBaseList] = useState([]);
  const [formData, setFormData] = useState({
    base_name: '',
    cell_name: '',
    external_website: '',
    cell_mission: '',
    contact_number1: '',
    contact_number2: '',
    email: '',
    logo_url: null,
    is_approved: 'no',
  });

  useEffect(() => {
    fetch(`${server}/base_list`)
      .then(response => response.json())
      .then(data => setBaseList(data))
      .catch(error => console.error('Error fetching base list:', error));
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogoChange = event => {
    const file = event.target.files[0];
    setFormData({
      ...formData,
      logo: file,
    });
  };

  const generateSuggestedEndpoint = (baseName) => {
    const exclusions = [
      "Army Depot", "Arsenal", "Fort", "Camp", "Air Reserve Base", 
      "AFB", "Proving Ground", "Maneuver Training Center", "Coast Guard Air Station", 
      "Joint Forces Training Base", "Military Ocean Terminal", "Naval Air Station", 
      "Reserve Forces Training Area", "Presidio of", "Depot", "SFB", "SFS", 
      "Air Force Base", "Space Force Base", "Ft", "Ft.", "Space Force Station", 
      "Air Base", "Army Airfield", "Barracks", "Support Center", "Training Center", 
      "Joint Training Center", "Proving Ground", "Air National Guard Base", 
      "Military Post", "Joint National Guard Base", "Marine Corps Air Station", 
      "MCAS", "MCRD", "MCB", "Hall", "MCLB", "Naval Base", "Field", 
      "Joint Expeditionary Base", "Naval Weapons Station", "Naval Station"
    ];
  
    const words = baseName.toLowerCase().split(' ');
  
    const filteredWords = words.filter(word => !exclusions.some(exclusion => word.includes(exclusion.toLowerCase())));
  
    let endpoint = '';
    if (baseName.includes("Joint Base") || baseName.includes("Academy")) {
      endpoint = filteredWords.map(word => word[0]).join('');
    } else {
      endpoint = filteredWords.join('');
    }
  
    return endpoint;
  }

  const handleSubmit = event => {
    event.preventDefault();

    const selectedBase = baseList.find(base => base.base_name === formData.base_name);
    const selectedBaseId = selectedBase ? selectedBase.id : null;

    const cellObject = {
      base_id: selectedBaseId,
      cell_name: formData.cell_name,
      cell_endpoint: generateSuggestedEndpoint(selectedBase.base_name),
      external_website: formData.external_website,
      cell_mission: formData.cell_mission,
      contact_number1: formData.contact_number1,
      contact_number2: formData.contact_number2,
      email: formData.email,
      logo_url: formData.logo_url,
      is_approved: 'no',
    };
    console.log(cellObject);
    fetch(`${server}/cell_list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cellObject),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Cell object submitted:', data);
        setIsSubmitted(true);
      })
      .catch(error => {
        console.error('Error submitting cell object:', error);
      });
  };

  return (
    isSubmitted ? <h5 className="mt-5">Thank you for submitting {formData.cell_name} to Spark Hub! Please allow 3-5 business days for administrator review.</h5> : 
    <Form onSubmit={handleSubmit}>
      <h2>Cell Add Request</h2><hr />
      <Row>
        <Col>
          <Form.Group controlId="baseName">
            <Form.Label>Base Name</Form.Label>
            <Form.Control
              as="select"
              name="base_name"
              value={formData.base_name}
              onChange={handleChange}
              required
            >
              <option value="">Select a Base Name</option>
              {baseList.map(base => (
                <option
                  key={base.id}
                  value={base.base_name}
                >
                  {base.base_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="cellName">
            <Form.Label>Cell Name</Form.Label>
            <Form.Control
              type="text"
              name="cell_name"
              placeholder='Something Spark'
              value={formData.cell_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="externalWebsite">
            <Form.Label>External Website (optional)</Form.Label>
            <Form.Control
              type="url"
              name="external_website"
              placeholder='your-site.mil'
              value={formData.external_website}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="cellMission">
        <Form.Label>Cell Mission (optional)</Form.Label>
        <Form.Control
          as="textarea"
          name="cell_mission"
          placeholder='Tell your users what your primary mission is!'
          value={formData.cell_mission}
          onChange={handleChange}
        />
      </Form.Group>

      <Row>
        <Col>
          <Form.Group controlId="contactNumber1">
            <Form.Label>Contact Number 1</Form.Label>
            <Form.Control
              type="tel"
              name="contact_number1"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder='555-555-5555'
              value={formData.contact_number1}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="contactNumber2">
            <Form.Label>Contact Number 2 (optional)</Form.Label>
            <Form.Control
              type="tel"
              name="contact_number2"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder='555-555-5555'
              value={formData.contact_number2}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder='cell-org-box@us.af.mil'
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="logoUrl">
        <Form.Label>Logo (optional)</Form.Label>
        <Form.Control type="file" accept=".jpg, .png" onChange={handleLogoChange} />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        className='mt-3'
      >
        Submit
      </Button>
    </Form>
  );
};
