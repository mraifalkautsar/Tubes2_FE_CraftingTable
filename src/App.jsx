// src/App.jsx

import React, { useState } from 'react';
import SearchWindow from './SearchWindow.jsx';
import RecipeTree from './Tree.jsx';

// sample data JSON sesuai struktur yang kamu punya
function App() {
  const [treeData, setTreeData] = useState(null);

  const handleSearch = async ({ selectedItem, algorithm, numRecipes }) => {
    // Tentukan endpoint berdasarkan algoritma
    const endpoint =
      algorithm === 'dfs' ? '/api/dfs'
    : algorithm === 'bfs' ? '/api/bfs'
    :                       '/api/bidirectional';  // will return 501

    const params = new URLSearchParams({
      target: selectedItem.name,
      count: numRecipes,
    });

    try {
      const res = await fetch(`${endpoint}?${params}`, {
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error(await res.text());
      const dto = await res.json();
      setTreeData(dto);
    } catch (err) {
      console.error('Fetch tree error:', err);
      alert('Gagal mengambil data resep: ' + err.message);
    }
  };

  return (
    <div className="App">
      {!treeData ? (
        <SearchWindow onSearch={handleSearch} />
      ) : (
        <RecipeTree data={treeData} />
      )}
    </div>
  );
}

export default App;