import React from 'react'
import ReactDOM from 'react-dom/client'

import router from './Router.jsx'
import './index.css'

import {
  RouterProvider,
} from "react-router-dom";


ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
 
<RouterProvider router={router}/>
    {/* <App /> */}

  </React.StrictMode>,
)
