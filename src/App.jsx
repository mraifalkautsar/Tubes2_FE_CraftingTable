// src/App.jsx

import React, { useState } from "react";
import SearchWindow from "./SearchWindow.jsx";
import RecipeTree from "./Tree.jsx";

function App() {
  const [treeData, setTreeData] = useState(null);
  const [metrics, setMetrics] = useState({
    timeTaken: 0,
    nodesVisited: 0,
    recipesFound: 0,
    methodUsed: "",
  });

  const [loading, setLoading] = useState(false);
  const handleSearch = ({ selectedItem, algorithm, numRecipes }) => {
    setLoading(true);
    // choose path segment based on algorithm
    const path =
      algorithm === "dfs"
        ? "dfs"
        : algorithm === "bfs"
        ? "bfs"
        : "bidirectional";

    // build query string
    const params = new URLSearchParams({
      target: selectedItem.name,
      count: numRecipes,
    });

    // point directly at your Go server on :8080
    fetch(`http://localhost:8080/api/${path}?${params}`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((json) => {
        console.log("🔍 API response:", json);
        // pull out the tree and the metrics
        setTreeData(json.tree);
        setMetrics({
          timeTaken:    json.timeTaken,
          nodesVisited: json.nodesVisited,
          recipesFound: json.recipesFound,
          methodUsed:   json.methodUsed,
        });
      })
      .catch((err) => {
        console.error("Fetch tree error:", err);
        alert("Gagal mengambil data resep: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
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
      {/* loading overlay always rendered last so it sits on top */}
      {loading && (
        <div className="loading-overlay">
          <p>Loading recipes…</p>
        </div>
      )}
    </div>
  );
}

export default App;
