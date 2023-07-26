import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../AppContext.js';
import { useState, useContext } from 'react';
import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
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
      <ComposableMap /*style={{ height: '90vh', width: '100vw' }}*/
        projectionConfig={{ 
          center: [0, -20],
          scale: 148
          }} >
        <ZoomableGroup
          //zoom={1}
          //{position.zoom}
          //center={[0, 0]}
          //{position.coordinates}
          //onMoveEnd={()=>handleMoveEnd}
          onMove={({zoom}) =>{setZoomFactor(zoom)}}
        >
          <Sphere stroke="#ff8900" strokeWidth={2} />
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

  function MarkerWithTooltip({spark, onClick}) {
    return (
        <Marker key={spark.id} coordinates={[ spark.lng, spark.lat ]} onClick={()=>navigate(`/cell/${spark.id}`)}>
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
              <circle r={4/zoomFactor} fill="#F53"/>
          </OverlayTrigger>
        </Marker>
    )
  }
}