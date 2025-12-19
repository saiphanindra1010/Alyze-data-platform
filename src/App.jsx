
import './App.css'
import { RouterProvider } from "react-router-dom";
import Router from "./Router.jsx";
import { ThemeProvider } from "./components/theme-provider";

function App() {

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={Router()} />
    </ThemeProvider>
  )
}

export default App
