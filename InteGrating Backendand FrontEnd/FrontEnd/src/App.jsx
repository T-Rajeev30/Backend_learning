import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';
  

function App() {
  const [veg, setVeg] = useState([]);

  useEffect(() => {
    axios.get('/api/jokes')
      .then((response) => {
        setVeg(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // Add the dependency array to run this effect only once on mount

  return (
    <>
      <h1>Connection of Backend with FrontEnd</h1>
      <p>Vegetable Count: {veg.length}</p>
      {
        veg.map((vegItem) => (
          <div key={vegItem.id}> 
            <h3>{vegItem.title}</h3>
            <p>{vegItem.price}</p>
          </div>
        ))
      }
    </>
  );
}

export default App;
