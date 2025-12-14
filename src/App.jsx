import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import NavBar from "./components/NavBar/NavBar"
import AnimeMenu from "./pages/AnimeMenu/AnimeMenu"
import AnimeInfo from "./pages/AnimeInfo/AnimeInfo"

function App() {

  return (
    <>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/menu" element={<AnimeMenu />} /> 
      <Route path="/info" element={<AnimeInfo />} /> 
    </Routes>
    </>
  )
}

export default App
