
import './App.css'
import Navbar from './components/navbar/navbar.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Model from './components/model/model'
import { GoogleOAuthProvider } from "@react-oauth/google";
function App() {
 const GooAuthWrapper=()=>
  {

   return(
    <GoogleOAuthProvider>

      <GoogleLogin></GoogleLogin>
    </GoogleOAuthProvider>
   )
  } 
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
