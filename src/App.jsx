import './App.css'
import * as d3 from "d3";
import { useEffect, useState } from 'react';
import { Chart } from './Chart';


function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    d3.csv('/data/forests.csv',  d3.autoType)
      .then((loadedData) => {
        console.log('Data loaded:', loadedData);
        setData(loadedData);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
      });
  }, []);

  console.log(data, "APP data")

  return (
    <div>
     {data?<Chart data={data} />:<div> Loading data... </div>}
    </div>
  );
}

export default App;