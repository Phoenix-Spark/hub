import { Carousel, Image } from 'react-bootstrap';

function PhotoCarousel({ photos }) {
  return (
    <Carousel className="h-100">
      {photos.map((photo, index) => (
        <Carousel.Item key={index}>
          <Image
            src="../logo512.png"
            style={{ display: 'block', maxHeight: '300px', margin: 'auto' }}
          />
          <Carousel.Caption style={{ color: 'black' }}>
            <h3>Photo label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default PhotoCarousel;
