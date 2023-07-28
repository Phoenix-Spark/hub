import { Carousel, Image } from 'react-bootstrap';

function PhotoCarousel({ photos }) {
  return (
    <Carousel className="h-100">
      {photos?.map((photo, index) => (
        <Carousel.Item key={index}>
          <Image
            src={photo.url}
            style={{ display: 'block', height: '200px', margin: 'auto' }}
          />
          {/* <Carousel.Caption style={{ color: 'black', fontWeight: "bold" }}> */}
            <h3 style={{ backgroundColor: "#44444480"}}>{photo.name}</h3>
            <p style={{ backgroundColor: "#44444480"}}>{photo.description}</p>
          {/* </Carousel.Caption> */}
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default PhotoCarousel;
