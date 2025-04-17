import React from "react";

const Search = (props) => {
  // <Search searchTerm={isinya} setSearchTerm={isinya} />
  // kita destructuring, ambil nama yg di passing nya bahwa mereka adalah props
  const { searchTerm, setSearchTerm } = props;

  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />

        <input
          type="text"
          placeholder="Search Movies"
          value={searchTerm} // kalo belum di destructuring, maka jadi props.searchTerm
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
