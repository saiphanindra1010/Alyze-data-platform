
import './App.css'
import Navbar from './components/navbar/navbar.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Model from './components/model/model'

function App() {
  return (
    <>
     <ErrorBoundary>
       <Navbar/>
    <Model/>
    </ErrorBoundary>
    </>
  )
}

export default App
