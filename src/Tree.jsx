import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
import Tree from "react-d3-tree";
import "./Tree.css";

function convertDTO(node) {
  const fileName = node.name.replace(/ /g, "_") + ".svg";
  const treeNode = {
    name: node.name,
    image: node.name ? `/images/${fileName}` : null,
  };

  if (Array.isArray(node.recipes)) {
    const childrenGroups = node.recipes.reduce((groups, recipe) => {
      if (Array.isArray(recipe.inputs)) {
        const inputs = recipe.inputs.map(convertDTO);
        groups.push({ name: "", image: null, children: inputs });
      }
      return groups;
    }, []);

    if (childrenGroups.length > 0) {
      treeNode.children = childrenGroups;
    }
  }

  return treeNode;
}

export default function RecipeTree({
  data,
  timeTaken,
  nodesVisited,
  recipesFound,
  methodUsed,
  onBack,
}) {
  const treeData = useMemo(() => [convertDTO(data)], [data]);
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const { width } = containerRef.current.getBoundingClientRect();
    setTranslate({ x: width / 2, y: 60 });
    setReady(true);
  }, []);

  const renderNode = ({ nodeDatum, transform }) => {
    const isDummy = nodeDatum.name === "";
    const cls = isDummy
      ? "dummy-node"
      : nodeDatum.children
      ? "branch-node"
      : "leaf-node";

    return (
      <g className={cls} transform={transform}>
        {!isDummy && nodeDatum.image && (
          <image className="node-icon" href={nodeDatum.image} />
        )}
        {!isDummy && (
          <rect
            className="node-rect"
            x={-26}
            y={-26}
            width={52}
            height={52}
          />
        )}
        {!isDummy && <text className="node-label">{nodeDatum.name}</text>}
      </g>
    );
  };

  return (
    <div className="tree-container" ref={containerRef}>
      {ready && (
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: "rotate(180deg)",
          }}
        >
          <Tree
            data={treeData}
            translate={translate}
            orientation="vertical"
            pathFunc="straight"
            renderCustomNodeElement={renderNode}
            collapsible={false}
            enableLegacyTransitions={false}
            zoomable={true}
            zoom={1}
            separation={{ siblings: 1.5, nonSiblings: 2 }}
            rootOrientation="bottom"
          />
        </div>
      )}

      <div className="info-box">
        <h4>Search Info</h4>
        <p>
          <strong>Time taken:</strong> {(timeTaken / 1000).toFixed(3)} ms
        </p>
        <p>
          <strong>Nodes visited:</strong> {nodesVisited}
        </p>
        <p>
          <strong>Recipes found:</strong> {recipesFound}
        </p>
        <p>
          <strong>Method used:</strong> {methodUsed}
        </p>
        <button className="back-button" onClick={onBack}>
          ← New Search
        </button>
      </div>
    </div>
  );
}
