import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import NavBar from "./components/NavBar/NavBar"
import GenrePage from "./pages/GenrePage/GenrePage"
import AnimeInfo from "./pages/AnimeInfo/AnimeInfo"
import AnimeGenres from "./pages/AnimeGenres/AnimeGenres"
import Footer from "./components/Footer/Footer"
import AnimeDetails from "./pages/AnimeDetails/AnimeDetails"

function App() {

  return (
    <>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/genres" element={<AnimeGenres />} /> 
      <Route path="/genre/:genreKey" element={<GenrePage />} /> 
      <Route path="/:malId" element={<AnimeInfo />} /> 
      <Route path="/anime/:id" element={<AnimeDetails />} /> 
    </Routes>
    <Footer />
    </>
  )
}

export default App
