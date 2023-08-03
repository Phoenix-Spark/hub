import { Carousel, Image } from 'react-bootstrap';

function PhotoCarousel({ photos }) {
  return (
    <Carousel className="h-100">
      {photos?.map((photo, index) => (
        <Carousel.Item key={index}>
            <Image
              src={photo.url}
              style={{ display: 'block', margin: 'auto', borderRadius: '20px', height: '440px'}}
            /> 
          {/* <Carousel.Caption style={{ color: 'black', fontWeight: "bold" }}> */}
          <div style={{ backgroundColor: "#44444480", textAlign:'center', borderRadius: '20px', marginLeft: '60px',  marginRight: '60px'}} className="p-2 mt-2" >
            <h3>{photo.name}</h3>
            <p>{photo.description}</p>
            <br/>
          </div>
          {/* </Carousel.Caption> */}
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default PhotoCarousel;
