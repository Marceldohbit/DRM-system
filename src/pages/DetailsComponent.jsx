import React from "react";
import im1 from '/images/img1.jpg'
import im2 from '/images/img2.jpg'
import im3 from '/images/img3.jpg'
import im4 from '/images/img4.jpg'
import im5 from '/images/img5.jpg'
import im6 from '/images/img6.jpg'
import im7 from '/images/img7.jpg'
import im8 from '/images/img8.jpg'

const DetailsComponent = () => {
  const places = [
    { id: 1, name: "Manga Hill : Limbe", percent: '50%', description: "Heavy landslide occured on 24th July 2018", image: im1 },
    { id: 2, name: "Lower Motowoh 1 : Limbe", percent: '39%', description: "Known for seasonal landslides.", image: im2},
    { id: 3, name: "Lower Motowoh 2 : Limbe",  percent: '60%', description: "At risk during rainy seasons. recently in 2020", image: im3 },
    { id: 4, name: "Forest Edge",   percent: '40%',description: "Erosion causes frequent landslides.", image: im4 },
    { id: 5, name: "Hilltop Village",  percent: '10%', description: "Prone to heavy landslides.", image: im5 },
    { id: 6, name: "Mountain Ridge",    percent: '34%',description: "Known for seasonal landslides.", image: im6},
    { id: 7, name: "Valley Base",    percent: '10%',description: "At risk during rainy seasons.", image: im7 },
    { id: 8, name: "Forest Edge",    percent: '10%',description: "Erosion causes frequent landslides.", image: im8 },
  ];

  return (
    <div  className="det" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {places.map((place) => (
        <div
          key={place.id}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#f9f9f9",
            width: '100%',
          }}
        >
          <img
            src={place.image}
            alt={place.name}
            style={{ width: "210px", height: "200px", borderRadius: "8px", marginRight: "10px" }}
          />
          <div className="text-info">
            <h4 style={{ margin: "0 0 5px 0" }}>{place.name}</h4>
            <p style={{ margin: 0 }}>{place.description}</p>
            <p>Likely hood of Landslide is <span id = 'emp'>{place.percent}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailsComponent;
