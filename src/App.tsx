import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import BeautifulModal from './components/BeautifulModal'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex my-2 items-center justify-center">
        <Button variant={'outline'} onClick={() => setCount((count) => count + 1)}>
          Click me {count}
        </Button>
      </div>

      <BeautifulModal />
      
    </>
  )
}

export default App
