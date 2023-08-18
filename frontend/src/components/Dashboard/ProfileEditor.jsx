import React, { useContext, useEffect, useState } from 'react';
import * as jose from 'jose';
import { Button, Col, Form, Row } from 'react-bootstrap';
import AppContext from '../../AppContext.js';

export default function ProfileEditor() {
  const { server, user, setUser } = useContext(AppContext);
  const [validated, setValidated] = useState(false);
  const [baseList, setBaseList] = useState([]);
  const [cellList, setCellList] = useState([]);
  const [userData, setUserData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    photo: '',
    contactNumber1: '',
    contactNumber2: '',
    bio: '',
    baseId: user?.baseId ?? '',
    cellId: user?.cellId ?? '',
  });

  useEffect(() => {
    fetch(`${server}/base/list`)
      .then(response => response.json())
      .then(data => setBaseList(data))
      .catch(error => console.error('Error fetching base list:', error));

    fetch(`${server}/cell/list`)
      .then(response => response.json())
      .then(data => setCellList(data))
      .catch(error => console.error('Error fetching cell list:', error));
  }, []);

  useEffect(() => {
    if (user) {
      // WHY ARE THESE CHAINED!! (╯°□°)╯︵ ┻━┻
      fetch(`${server}/user/${user?.username}/profile`)
        .then(res => res.json())
        .then(data => {
          console.log('profile', data);
          return setUserData(data);
        })
        .catch(err => console.log(`Fetch failed. Error: ${err}`));
    }
  }, [server, user]);

  // TODO: Move validation to input changes
  async function handleUpdate(e) {
    e.preventDefault();
    /** @type {HTMLFormElement} */
    const form = e.currentTarget;

    const formIsValid = form.checkValidity();
    if (formIsValid === false) {
      e.stopPropagation();
    }
    setValidated(true);

    if (formIsValid) {
      e.stopPropagation();
      try {
        const formData = new FormData(form);

        const response = await fetch(`${server}/user/update`, {
          method: 'PATCH',
          credentials: 'include',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const secret = process.env.REACT_APP_SECRET || 'secret';
          const secretUInt = new TextEncoder().encode(secret);
          const { payload } = await jose.jwtVerify(data.token, secretUInt, {
            issuer: 'capstone',
          });

          for (let key of Object.keys(payload.user)) {
            payload.user[key] = decodeURIComponent(payload.user[key]);
          }

          console.log(payload);

          payload.user.contactNumber1 = payload.user.contactNumbers[0];
          payload.user.contactNumber2 = payload.user.contactNumbers[1];
          setUserData(payload.user);
          setUser(payload.user);
        }
      } catch (e) {
        console.error('There was an error.', e);
      }
    }
  }

  const handleChange = event => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  return (
    <div className="m-3">
      <>
        <h3>Profile Editor</h3>
        <hr />
        <Form
          noValidate
          validated={validated}
          onSubmit={handleUpdate}
        >
          <input
            type="hidden"
            id="username"
            name="username"
            value={user?.username}
          />
          <Row>
            <Form.Group
              as={Col}
              className="mb-3"
              controlId="firstName"
              name="username"
            >
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                type="text"
                value={`${userData?.firstName}`}
                name="firstName"
                onChange={handleChange}
              ></Form.Control>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Please enter your first name.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              className="mb-3"
              controlId="lastName"
            >
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                required
                type="text"
                value={`${userData?.lastName}`}
                name="lastName"
                onChange={handleChange}
              ></Form.Control>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Please enter your last name.</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group
            className="mb-3"
            controlId="email"
          >
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              value={`${userData?.email}`}
              name="email"
              onChange={handleChange}
            ></Form.Control>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
          </Form.Group>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              controlId="contactNumber1"
            >
              <Form.Label>Phone Number 1</Form.Label>
              <Form.Control
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                value={`${userData?.contactNumbers[0]}`}
                name="contactNumber1"
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="contactNumber2"
            >
              <Form.Label>Phone Number 2</Form.Label>
              <Form.Control
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                value={`${userData?.contactNumbers[1]}`}
                name="contactNumber2"
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
          </Row>
          <Form.Group
            className="mb-3"
            controlId="photo"
          >
            <Form.Label>Photo</Form.Label>
            <Form.Control
              type="file"
              name="photo"
            ></Form.Control>
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="bio"
          >
            <Form.Label>Biography</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={`${userData?.bio}`}
              name="bio"
              onChange={handleChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="baseId"
          >
            <Form.Label>Base</Form.Label>
            <Form.Select
              name="baseId"
              value={userData.baseId}
              onChange={handleChange}
              required
            >
              <option value="">Select a Base Name</option>
              {baseList.map(base => (
                <option
                  key={base.id}
                  value={base.id}
                >
                  {base.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group
            className="mb-4"
            controlId="cellId"
          >
            <Form.Label>Spark Cell</Form.Label>
            <Form.Select
              value={userData.cellId}
              onChange={handleChange}
              required
              name="cellId"
            >
              <option value="">Select a Cell Name</option>
              {cellList.map(cell => (
                <option
                  key={cell.id}
                  value={cell.id}
                >
                  {cell.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="mb-3"
            >
              Update Account
            </Button>
          </Form.Group>
        </Form>
      </>
    </div>
  );
}
