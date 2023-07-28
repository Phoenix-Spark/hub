import React, { useContext, useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { DashLg, PlusLg } from 'react-bootstrap-icons';
import { ComposableMap, Geographies, Geography, Marker, Sphere, ZoomableGroup } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';

import AppContext from '../../AppContext.js';

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

export default function MapChart() {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const { sparkList } = useContext(AppContext);
  const navigate = useNavigate();

  let delayFunction;

  useEffect(() => {
    return () => clearTimeout(delayFunction);
  }, []);

  function handleZoomIn() {
    if (position.zoom >= 32) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 2 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  function handleMoveEnd(position) {
    delayFunction = setTimeout(() => setPosition(position), 10);
  }

  return (
    //<Container className="mt-4 mx-0 w-100 mb-5" style={{ maxWidth: '100vw', paddingLeft: 0, paddingRight: 0 }}>
    <Card id="map-card">
      <Card.Header
        as="h5"
        className="justify-content-between"
      >
        Spark Cells Around the World
        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={handleZoomIn}
            className="p-0"
          >
            <PlusLg size={32} />
          </Button>
          <Button
            variant="secondary"
            onClick={handleZoomOut}
            className="p-0"
          >
            <DashLg size={32} />
          </Button>
        </ButtonGroup>
      </Card.Header>
      <Card.Body style={{ borderRadius: '10px' }}>
        <ComposableMap
          //style={{ border: '3px solid #495057', borderRadius: "60px", backgroundColor: "black" }}
          style={{
            border: '3px solid #495057',
            borderRadius: '60px',
            backgroundImage: `url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20baseFrequency%3D%22.2%22%2F%3E%3CfeColorMatrix%20values%3D%220%200%200%209%20-4%200%200%200%209%20-4%200%200%200%209%20-4%200%200%200%200%201%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23a)%22%2F%3E%3C%2Fsvg%3E')`,
          }}
          width={1800}
          height={600}
          projectionConfig={{
            center: [0, 0],
            scale: 220,
          }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            maxZoom={64}
          >
            <Sphere
              stroke="#fff"
              strokeWidth={2}
              fill="lightblue"
            />
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                  />
                ))
              }
            </Geographies>
            {sparkList.map(spark => (
              <MarkerWithTooltip
                key={spark.id}
                spark={spark}
              />
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </Card.Body>
    </Card>
  );

  function MarkerWithTooltip({ spark, onClick }) {
    return (
      <Marker
        key={spark.id}
        coordinates={[spark.lng, spark.lat]}
        onClick={() => navigate(`/cell/${spark.cell_endpoint}`)}
      >
        <OverlayTrigger
          placement={'top'}
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
          <circle
            r={8 / position.zoom}
            fill="#F53"
          />
        </OverlayTrigger>
      </Marker>
    );
  }
}
