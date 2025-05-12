// src/App.jsx
import React, { useState, useRef } from "react";   // ← import useRef!
import SearchWindow from "./SearchWindow.jsx";
import RecipeTree   from "./Tree.jsx";

function App() {
  const [treeData, setTreeData] = useState(null);
  const [metrics, setMetrics]   = useState({
    timeTaken: 0,
    nodesVisited: 0,
    recipesFound: 0,
    methodUsed: "",
  });
  const sourceRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [useLiveUpdate, setUseLiveUpdate] = useState(false);

  const handleSearch = ({
    selectedItem,
    algorithm,
    numRecipes,
    liveUpdate,
  }) => {
    setUseLiveUpdate(liveUpdate);
    setLoading(true);

    // close any existing SSE
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }

    const path =
      algorithm === "dfs"
        ? "dfs"
        : algorithm === "bfs"
        ? "bfs"
        : "bidirectional";

    const params = new URLSearchParams({
      target: selectedItem.name,
      count:  numRecipes,
      stream: liveUpdate ? "1" : "0",
    });

    const url = `${import.meta.env.VITE_API_BASE_URL}/api/${path}?${params}`;

    if (liveUpdate) {
      // SSE mode
      const es = new EventSource(url);
      sourceRef.current = es;

      es.onmessage = (e) => {
        const { tree, timeTaken, nodesVisited, recipesFound, methodUsed } =
          JSON.parse(e.data);
        setTreeData(tree);
        setMetrics({ timeTaken, nodesVisited, recipesFound, methodUsed });
      };

      es.onerror = (err) => {
        console.error("SSE error:", err);
        es.close();
      };
    } else {
      // one-shot fetch
      fetch(url, { headers: { Accept: "application/json" } })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then(({ tree, timeTaken, nodesVisited, recipesFound, methodUsed }) => {
          setTreeData(tree);
          setMetrics({ timeTaken, nodesVisited, recipesFound, methodUsed });
        })
        .catch((err) => {
          console.error("Fetch tree error:", err);
          alert("Gagal mengambil data resep: " + err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };  // ← closes handleSearch

  const handleBack = () => {
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
    setTreeData(null);
  };

  return (
    <div className="App">
      {!treeData ? (
        <SearchWindow onSearch={handleSearch} />
      ) : (
        <RecipeTree
          data={treeData}
          {...metrics}
          onBack={handleBack}
        />
      )}
      {loading && !useLiveUpdate&& (
        <div className="loading-overlay">
          <p>Loading recipes…</p>
        </div>
      )}
    </div>
  );
}

export default App;
