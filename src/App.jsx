// src/App.jsx

import React, { useState } from "react";
import SearchWindow from "./SearchWindow.jsx";
import RecipeTree from "./Tree.jsx";

// your sample data, exactly as you pasted
const sampleTreeData = {
  name: "Brick",
  recipes: [
    {
      inputs: [
        {
          name: "Clay",
          recipes: [
            {
              inputs: [
                {
                  name: "Mud",
                  recipes: [{ inputs: [{ name: "Water" }, { name: "Earth" }] }],
                },
                { name: "Sand" },
              ],
            },
          ],
        },
        { name: "Stone" },
      ],
    },
    {
      inputs: [
        {
          name: "Mud",
          recipes: [{ inputs: [{ name: "Water" }, { name: "Earth" }] }],
        },
        { name: "Fire" },
      ],
    },
  ],
};

function App() {
  const [treeData, setTreeData] = useState(null);
  const [metrics, setMetrics] = useState({
    timeTaken: 0,
    nodesVisited: 0,
    recipesFound: 0,
    methodUsed: "",
  });

  const handleSearch = ({ selectedItem, algorithm, numRecipes }) => {
    // ----- OLD fetch logic, now commented out -----
    /*
    const endpoint =
      algorithm === 'dfs' ? '/api/dfs'
      : algorithm === 'bfs' ? '/api/bfs'
      :                       '/api/bidirectional';

    const params = new URLSearchParams({
      target: selectedItem.name,
      count: numRecipes,
    });

    fetch(`${endpoint}?${params}`, { headers: { 'Accept': 'application/json' } })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then(dto => setTreeData(dto))
      .catch(err => {
        console.error('Fetch tree error:', err)
        alert('Gagal mengambil data resep: ' + err.message)
      })
    */

    // ----- NEW test version: always show sampleTreeData -----
    setTreeData(sampleTreeData);
  };

  return (
    <div className="App">
      {!treeData ? (
        <SearchWindow onSearch={handleSearch} />
      ) : (
        <RecipeTree
          data={treeData}
          {...metrics}
          onBack={() => setTreeData(null)}
        />
      )}
    </div>
  );
}

export default App;
