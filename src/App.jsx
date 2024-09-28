
import './App.css'

import ErrorBoundary from './components/ErrorBoundary.jsx'
// import Model from './components/model/model'

function App() {
  return (
    <>
     <ErrorBoundary>
    <div>hello</div>
      {/* <Model/> */}
    </ErrorBoundary>
    </>
  )
}

export default App
