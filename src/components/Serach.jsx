import React from "react";

const Serach = ({ serachItem, setSearchItem }) => {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="search-icon" />
        <input
          type="text"
          placeholder="Search for a movie"
          value={serachItem}
          onChange={(event) => setSearchItem(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Serach;
