import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../AppContext.js';
import { useState, useContext } from 'react';
import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button } from "react-bootstrap";
import { DropdownSubmenu, NavDropdownMenu} from "react-bootstrap-submenu";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import MapChart from './MapChart.js';

function Hub() {
  const { sparkList } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropSelection, setDropSelection] = useState();

  const handleSearchInputChange = event => {
    setSearchQuery(event.target.value);
  };
  
  const handleDropdownSelect = (itemName) => {
    setDropSelection(itemName);
  };

  const filteredSparkList = sparkList.filter(spark => spark.base_name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Spark Hub!</h3>

      <Row className="mb-3">
      <Col className="my-1">
        <button className="searchButton" type='button'>Search</button>
          <input
            type="text"
            className="form-control"
            placeholder="Search for..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </Col>
        <Col className="my-1">
          <NavDropdownMenu title='Resources'>
            <NavDropdown.Item href="http://localhost:3000/">Proposal Guidelines</NavDropdown.Item>
          </NavDropdownMenu>
        </Col>
        <Col className="my-1">
          <Button href="http://localhost:3000/">Forum</Button>
        </Col>
        <Col className="my-1">
          <Button href="http://localhost:3000/">Don't see your cell?</Button>
        </Col>
        <Col className="my-1">
        <Button href="http://localhost:3000/">Login/Register</Button>
        </Col>
      </Row>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Spark List</h5>
              <ul className="list-group">
                {filteredSparkList.map((spark, index) => (
                  <li
                    className="list-group-item"
                    key={index}
                  >
                    <img style={{ height: '64px', width: '64px' }} src={spark.logo_url} alt="" />{spark.cell_name} at {spark.base_name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      This is where I'd put my map...<br />IF I HAD ONE
      <MapChart />
    </div>
  )

  





};

export default Hub;