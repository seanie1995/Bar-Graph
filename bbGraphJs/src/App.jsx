import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Graph from './components/graph'


function App() {
  
  const [data, setData] = useState([])

  window.graphData = []

  function getData(data) {
    let newData = JSON.parse(data)
    window.dataToApp = newData
  }
 
  return (
    <>
     <Graph></Graph>
    </>
  )
}

export default App
