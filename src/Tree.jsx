import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import Tree from 'react-d3-tree';
import './Tree.css';

/**
 * Convert dari NodeDTO: 
 *  { name, image_url, children: [ [NodeDTO...] , ... ] }
 * ke format react-d3-tree:
 *  { name, image, children: [...] }
 */
function convertDTO(node) {
  // derive local SVG path from name
  const fileName = node.name.replace(/ /g, '_') + '.svg';
  const treeNode = {
    name:  node.name,
    image: node.name ? `/images/${fileName}` : null,
  };
  if (Array.isArray(node.children) && node.children.length > 0) {
    treeNode.children = node.children.map(group => ({
      name: '',      // dummy grouping node
      image: null,
      children: group.map(convertDTO),
    }));
  }
  return treeNode;
}

export default function RecipeTree({ data }) {
  // wrap root dalam array
  const treeData = useMemo(() => [convertDTO(data)], [data]);

  // untuk auto‐center
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const { width } = containerRef.current.getBoundingClientRect();
    setTranslate({ x: width / 2, y: 60 });
    setReady(true);
  }, []);

  // custom render tiap node: icon + border + label
  const renderNode = ({ nodeDatum, toggleNode, transform }) => {
    const isDummy = nodeDatum.name === '';
    return (
      <g transform={transform} onClick={toggleNode}>
        {/* icon */}
        {!isDummy && nodeDatum.image && (
          <image
            href={nodeDatum.image}
            x={-20} y={-20}
            width={40} height={40}
          />
        )}
        {/* border circle */}
        {!isDummy && (
          <circle
            r={22}
            fill="none"
            stroke="#888"
            strokeWidth={2}
          />
        )}
        {/* label di bawah */}
        {!isDummy && (
          <text textAnchor="middle" y={35} className="node-label">
            {nodeDatum.name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="tree-container" ref={containerRef}>
      {ready && (
        <Tree
          data={treeData}
          translate={translate}
          orientation="vertical"
          pathFunc="straight"
          renderCustomNodeElement={renderNode}
          collapsible={false}
          enableLegacyTransitions={false}
          zoomable={false}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          styles={{ links: { stroke: '#888', strokeWidth: 2 } }}
        />
      )}
    </div>
  );
}