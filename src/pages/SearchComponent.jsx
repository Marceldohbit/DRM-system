import React, { useState } from "react";
import "./styles/SearchComponent.css"; // Link the CSS file

const SearchComponent = ({ onSetLocation }) => {
  const regions = {
    Northwest: [5.9601, 10.1591],
    Southwest: [4.1591, 9.2318],
  };

  const [selectedRegion, setSelectedRegion] = useState("Northwest");

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    onSetLocation(regions[region]);
  };

  return (
    <div className="select-container">
      <label htmlFor="region">Select Region:</label>
      <select
        id="region"
        className="select-dropdown"
        value={selectedRegion}
        onChange={handleRegionChange}
      >
        {Object.keys(regions).map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchComponent;
