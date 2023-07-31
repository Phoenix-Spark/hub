import { useState, useEffect } from 'react';

const KylesCorner = () => {
  const [images, setImages] = useState([]);

  useEffect(()=>{
    const data = [];
    for(let i = 0; i < 30; i+=1){
      data.push(`https://loremflickr.com/200/200/foot,toe/all?random=${i}`)
    }
    setImages(data)
  },[])

  return (
    <div className="f-flex m-5">
      THIS IS FOR KYLE ONLY!!!<br/>
      {images.map((pic, index)=>
        <img
          key={index}
          style={{ height: '200px', width: '200px', margin: '20px', border: '2px solid black', borderRadius: '10px' }}
          src={pic}
          alt=""
        />
      )}
    </div>
  );
};

export default KylesCorner;