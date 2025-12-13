import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import NavBar from "./components/NavBar/NavBar"

function App() {

  return (
    <>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} /> 
    </Routes>
    </>
  )
}

export default App
