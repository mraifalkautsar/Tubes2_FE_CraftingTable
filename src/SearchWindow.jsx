import React, { useState } from 'react';
import './SearchWindow.css';

// your catalogue of items – swap in your real icon paths
const ITEMS = [
  { id: 1, name: 'Pencil', icon: '/icons/pencil.png' },
  { id: 2, name: 'Book',   icon: '/icons/book.png'   },
  { id: 3, name: 'Moon',   icon: '/icons/moon.png'   },
  // …add as many as you like
];

// little button for each grid‐cell
function GridItem({ item, isSelected, onClick }) {
  return (
    <div
      className={`grid-item${isSelected ? ' selected' : ''}`}
      onClick={() => onClick(item)}
    >
      <img src={item.icon} alt={item.name} />
    </div>
  );
}

export default function SearchWindow({ onSearch }) {
  const [selectedItem, setSelectedItem] = useState(ITEMS[0]);
  const [algorithm,    setAlgorithm]    = useState('dfs');
  const [numRecipes,   setNumRecipes]   = useState(1);

  const handleSearch = () => {
    const payload = { selectedItem, algorithm, numRecipes: Number(numRecipes) };
    console.log('Searching with:', payload);
    if (onSearch) onSearch(payload);
  };

  return (
    <div className="overlay">
      <div className="modal">
        {/* left: scrollable grid */}
        <div className="grid-wrapper">
          <div className="grid">
            {ITEMS.map(item => (
              <GridItem
                key={item.id}
                item={item}
                isSelected={item.id === selectedItem.id}
                onClick={setSelectedItem}
              />
            ))}
          </div>
        </div>

        {/* right: controls */}
        <div className="controls">
          <div className="selected-preview">
            <span className="label">Selected</span>
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
                checked={algorithm === 'dfs'}
                onChange={() => setAlgorithm('dfs')}
              />
              Depth-First Search
            </label>
            <label>
              <input
                type="radio"
                name="algorithm"
                value="bfs"
                checked={algorithm === 'bfs'}
                onChange={() => setAlgorithm('bfs')}
              />
              Breadth-First Search
            </label>
            <label>
              <input
                type="radio"
                name="algorithm"
                value="bidirectional"
                checked={algorithm === 'bidirectional'}
                onChange={() => setAlgorithm('bidirectional')}
              />
              Bidirectional
            </label>
          </div>

          <div className="recipes-input">
            <label>Number of Recipes</label>
            <input
              type="number"
              min="1"
              value={numRecipes}
              onChange={e => setNumRecipes(e.target.value)}
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
    