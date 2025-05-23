// src/SearchWindow.jsx
import React, { useState, useEffect } from "react";
import "./SearchWindow.css";

export default function SearchWindow({ onSearch }) {
  const [items, setItems] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [algorithm, setAlgorithm] = useState("dfs");
  const [numRecipes, setNumRecipes] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [liveUpdate, setLiveUpdate] = useState(false);

  useEffect(() => {
    // ambil daftar elemen + image_url dari backend
    console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recipes`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        // data: [{ element, image_url, recipes }, ...]
        const mapped = data.map((el, idx) => {
          // build local path: spaces → underscores
          const fileName = el.element.replace(/ /g /*spasi*/, "_") + ".svg";
          return {
            id: idx,
            name: el.element,
            icon: `/images/${fileName}`,
          };
        });
        setItems(mapped);
        setSelectedItem(mapped[0]);
      })
      .catch((err) => {
        console.error("Load recipes.json failed:", err);
        alert("Gagal load daftar elemen dari server");
      });
  }, []);

  if (!items)
    return (
      <div className="loading-overlay">
        <p>Loading elements…</p>
      </div>
    );

  const filtered = items.filter((it) =>
    it.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    onSearch({ selectedItem, algorithm, numRecipes: Number(numRecipes), liveUpdate });
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="grid-wrapper">
          <div className="grid">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`grid-item${
                  item.id === selectedItem.id ? " selected" : ""
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <img src={item.icon} alt={item.name} />
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="no-results">No elements found</p>
            )}
          </div>
        </div>
        <div className="controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search elements…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>      

          <br/>
          <div className="selected-preview">
            <span className="label"><u>Selected</u></span>
            <div className="preview-box">
              <img src={selectedItem.icon} alt={selectedItem.name} />
            </div>
            <div className="item-name">{selectedItem.name}</div>
          </div>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="algorithm"
                value="dfs"
                checked={algorithm === "dfs"}
                onChange={() => setAlgorithm("dfs")}
              />
              DFS
            </label>
            <label>
              <input
                type="radio"
                name="algorithm"
                value="bfs"
                checked={algorithm === "bfs"}
                onChange={() => setAlgorithm("bfs")}
              />
              BFS
            </label>
            <div className="live-update-toggle">
            <label>
             <input
               type="checkbox"
               checked={liveUpdate}
               onChange={(e) => setLiveUpdate(e.target.checked)}
             />{" "}
             Live Update
            </label>
            </div>
          </div>
          <div className="recipes-input">
            <label>Number of Recipes</label>
            <input
              type="number"
              min="1"
              value={numRecipes}
              onChange={(e) => setNumRecipes(e.target.value)}
            />
          </div>
          <button className="search-button" onClick={handleSearch}>
            SEARCH
          </button>
        </div>
      </div>
    </div>
  );
}
