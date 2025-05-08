import React, { useMemo, useRef, useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import './Tree.css';

/**
 * Rekursif konversi data recipe Golang ke format react-d3-tree
 * Setiap `recipes` jadi satu dummy node (name: '') dengan children = inputs
 */
function convertTree(node) {
  const treeNode = { name: node.name };
  if (node.recipes?.length) {
    treeNode.children = node.recipes.map(recipe => ({
      name: '',                 // dummy marker
      children: recipe.inputs.map(convertTree),
    }));
  }
  return treeNode;
}

export default function RecipeTree({ data }) {
  const treeData = useMemo(() => convertTree(data), [data]);
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: 50 });
    }
  }, []);

  return (
    <div className="tree-container" ref={containerRef}>
      {translate.x > 0 && (
        <Tree
          data={treeData}
          translate={translate}
          orientation="vertical"
          pathFunc="straight"
          styles={{
            links: { stroke: '#888' },
            nodes: {
              node: { circle: { r: 15, fill: '#fff', stroke: '#000' } },
              leafNode: { circle: { r: 10, fill: '#eee', stroke: '#444' } },
            },
          }}
          nodeSvgShape={{ shape: 'circle', shapeProps: {} }}

          /* render custom node to tag or hide dummy nodes */
          renderCustomNodeElement={rd3tProps => {
            const { nodeDatum, toggleNode, transform } = rd3tProps;
            const isDummy = nodeDatum.name === '';
            return (
              <g
                transform={transform}
                onClick={toggleNode}
                className={isDummy ? 'dummy-node' : undefined}
              >
                <circle
                  r={isDummy ? 0 : 15}
                  fill={isDummy ? 'transparent' : '#fff'}
                  stroke={isDummy ? 'transparent' : '#000'}
                />
                {!isDummy && (
                  <g className="rd3t-label">
                    <text
                      className="rd3t-label__title"
                      textAnchor="start"
                      x={20}
                      dy={4}
                    >
                      {nodeDatum.name}
                    </text>
                  </g>
                )}
              </g>
            );
          }}

          enableLegacyTransitions={false}
          collapsible={false}
        />
      )}
    </div>
  );
}
