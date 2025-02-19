import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Graph from './components/graph2'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Graph></Graph>
    </>
  )
}

export default App
