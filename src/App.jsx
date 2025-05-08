import React, { useState } from 'react';
import SearchWindow from './SearchWindow.jsx';
import RecipeTree from './Tree.jsx';

// sample data JSON sesuai struktur yang kamu punya
const sampleTreeData = {
  name: 'Brick',
  recipes: [
    {
      inputs: [
        {
          name: 'Clay',
          recipes: [
            {
              inputs: [
                {
                  
                  name: 'Mud',
                  recipes: [
                    { inputs: [{ name: 'Water' }, { name: 'Earth' }] },
                  ],
                },
                { name: 'Sand' },
              ],
            },
          ],
        },
        { name: 'Stone' },
      ],
    },
    {
      inputs: [
        {
          name: 'Mud',
          recipes: [
            { inputs: [{ name: 'Water' }, { name: 'Earth' }] },
          ],
        },
        { name: 'Fire' },
      ],
    },
  ],
};

function App() {
  const [showTree, setShowTree] = useState(false);

  const handleSearch = params => {
    // nanti di sini fetch dari backend
    console.log('Search!', params);
    setShowTree(true);
  };

  return (
    <div className="App">
      {!showTree && <SearchWindow onSearch={handleSearch} />}
      {showTree && <RecipeTree data={sampleTreeData} />}
    </div>
  );
}

export default App;