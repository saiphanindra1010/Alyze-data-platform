
import './App.css'

import ErrorBoundary from './pages/ErrorBoundary.jsx'
// import Model from './components/model/model'
import { RouterProvider } from "react-router-dom";
import router from "./Router.jsx";
function App() {
  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App
