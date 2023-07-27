import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../AppContext.js';
import { useState, useContext } from 'react';
import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button, OverlayTrigger, Tooltip, Card } from "react-bootstrap";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere, Marker } from "react-simple-maps"
import { useNavigate } from 'react-router-dom';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

export default function MapChart() {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const { sparkList } = useContext(AppContext);
  const [toolTipOpen, setToolTipOpen] = useState(false);
  const [zoomFactor, setZoomFactor] = useState(1);
  const navigate = useNavigate();

  function handleZoomIn() {
    if (position.zoom >= 32) return;
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
    <Container className="mt-4 mx-0 w-100" style={{ maxWidth: '100vw', paddingLeft: 0, paddingRight: 0 }}>
      <Card id="map-card">
              <Card.Body style={{ borderRadius: '10px' }}>
              <Card.Title className="d-flex justify-content-between w-100">Map
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
              
              
              
              </Card.Title>
                
      <ComposableMap style={{ height: '500px', width: '100%', border: '3px solid red', borderRadius: "60px", backgroundColor: "black" }}
        projectionConfig={{ 
          center: [0, 0],
          scale: 220,
          height: 500
          }} >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          onMove={({zoom}) =>{setZoomFactor(zoom)}}
        >
          <Sphere stroke="#ff8900" strokeWidth={2} fill="lightblue" />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} />
              ))
            }
          </Geographies>
          {sparkList.map(spark=>
            <MarkerWithTooltip key={spark.id} spark={spark}/>
          )}
        </ZoomableGroup>
      </ComposableMap>
      
      {/* </Row> */}
      </Card.Body>
            </Card>
    </Container>
  );

  function MarkerWithTooltip({spark, onClick}) {
    return (
        <Marker key={spark.id} coordinates={[ spark.lng, spark.lat ]} onClick={()=>navigate(`/cell/${spark.cell_endpoint}`)}>
          <OverlayTrigger
            placement={"top"}
            overlay={
            <Tooltip id={`tooltip-${spark.id}`}>
              <Row>
                <Col md="auto">
                  <img
                    style={{ height: '64px', width: '64px' }}
                    src={spark.logo_url}
                    alt=""
                  />
                </Col>
                <Col className="pl-5">
                  {spark.cell_name} at {spark.base_name}
                </Col>
              </Row>
            </Tooltip>
            }
          >
              <circle r={8/zoomFactor} fill="#F53"/>
          </OverlayTrigger>
        </Marker>
    )
  }
}