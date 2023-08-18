import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
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
    fetch(`${server}/base/list`)
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

  const generateSuggestedEndpoint = baseName => {
    const exclusions = [
      'Depot',
      'Arsenal',
      'Camp',
      'Reserve',
      'AFB',
      'Proving',
      'Ground',
      'Maneuver',
      'Coast',
      'Guard',
      'Ocean',
      'Terminal',
      'Naval',
      'Depot',
      'SFB',
      'SFS',
      'Air',
      'Force',
      'Base',
      'Space',
      'Station',
      'Base',
      'Army',
      'Airfield',
      'Barracks',
      'Support',
      'Center',
      'Training',
      'Center',
      'ANGB',
      'Military',
      'Post',
      'Marine',
      'Corps',
      'MCAS',
      'MCRD',
      'MCB',
      'Hall',
      'MCLB',
      'Field',
    ];

    let words = baseName.split(' ');
    const filteredWords = words.filter(word => !exclusions.some(exclusion => word.includes(exclusion)));

    let endpoint = '';
    if (words[0] === 'Joint' && words[1] === 'Base') {
      let abbreviation = '';
      if (words[2].includes('-')) {
        const hyphenatedParts = words[2].split('-');
        abbreviation = hyphenatedParts.map(word => word[0].toLowerCase()).join('');
      } else {
        abbreviation = words
          .slice(2)
          .map(word => word[0].toLowerCase())
          .join('');
      }
      endpoint = 'jb' + abbreviation;
    } else {
      endpoint = filteredWords
        .map(word => {
          if (word.includes('-')) {
            const hyphenatedParts = word.split('-');
            return hyphenatedParts.map(part => part[0].toLowerCase() + part.slice(1)).join('-');
          }
          return word.toLowerCase();
        })
        .join('-');
    }
    return endpoint;
  };

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

  return isSubmitted ? (
    <h5 className="mt-5">
      Thank you for submitting {formData.cell_name} to Spark Hub! Please allow 3-5 business days for administrator review.
    </h5>
  ) : (
    <Form
      className="mt-4 mb-0 ms-5 me-5"
      onSubmit={handleSubmit}
    >
      <h2>Cell Add Request</h2>
      <hr />
      <Row>
        <Col>
          <Form.Group controlId="baseName">
            <Form.Label className="mt-1">Base Name</Form.Label>
            <Form.Select
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
            </Form.Select>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="cellName">
            <Form.Label className="mt-1">Cell Name</Form.Label>
            <Form.Control
              type="text"
              name="cell_name"
              placeholder="Something Spark"
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
            <Form.Label className="mt-3">External Website (optional)</Form.Label>
            <Form.Control
              type="url"
              name="external_website"
              placeholder="your-site.mil"
              value={formData.external_website}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="cellMission">
        <Form.Label className="mt-3">Cell Mission (optional)</Form.Label>
        <Form.Control
          as="textarea"
          name="cell_mission"
          placeholder="Tell your users what your primary mission is!"
          value={formData.cell_mission}
          onChange={handleChange}
        />
      </Form.Group>

      <Row>
        <Col>
          <Form.Group controlId="contactNumber1">
            <Form.Label className="mt-3">Contact Number 1</Form.Label>
            <Form.Control
              type="tel"
              name="contact_number1"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="555-555-5555"
              value={formData.contact_number1}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="contactNumber2">
            <Form.Label className="mt-3">Contact Number 2 (optional)</Form.Label>
            <Form.Control
              type="tel"
              name="contact_number2"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="555-555-5555"
              value={formData.contact_number2}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="email">
        <Form.Label className="mt-3">Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="cell-org-box@us.af.mil"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group
        className="mb-3"
        controlId="logoUrl"
      >
        <Form.Label className="mt-3">Logo (optional)</Form.Label>
        <Form.Control
          type="file"
          accept=".jpg, .png"
          onChange={handleLogoChange}
        />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        className="mt-4"
      >
        Submit
      </Button>
    </Form>
  );
}
