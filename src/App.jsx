
import './App.css'
import Navbar from './components/navbar'
import ErrorBoundary from './components/ErrorBoundary.jsx'
function App() {
  return (
    <>
     <ErrorBoundary>
    <Navbar/>
    <h1>hello</h1>

    </ErrorBoundary>
    </>
  )
}

export default App
