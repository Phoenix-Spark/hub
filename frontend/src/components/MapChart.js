import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../AppContext.js';
import { useState, useContext } from 'react';
import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button } from "react-bootstrap";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

export default function MapChart() {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  };

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  };

  function handleMoveEnd(position) {
    setPosition(position);
  };
  return (
    <Container style={{paddingLeft: 0, paddingRight: 0}}>
      <Row style={{paddingLeft: 0, paddingRight: 0}}>
      <ComposableMap style={{ height: '90vh', width: '100vw' }}  projectionConfig={{ center: [20, 40] }} >
        <ZoomableGroup
          zoom={1}
          //{position.zoom}
          center={[0, 0]}
          //{position.coordinates}
          onMoveEnd={handleMoveEnd}
        >
          <Sphere stroke="#FF5533" strokeWidth={2} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} />
              ))
            }
          </Geographies>
          <Marker coordinates={[ -121.94443455546879, 38.273198309851736]}>
            <circle r={2} fill="#F53" />
          </Marker>
        </ZoomableGroup>
      </ComposableMap>
      <div className="controls">
        <button onClick={handleZoomIn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button onClick={handleZoomOut}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
      </Row>
    </Container>
  );
};