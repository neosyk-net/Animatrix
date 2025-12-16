import React from "react";
import "./AnimeGenres.css";
import LearnMore from "../../components/LearnMore/LearnMore";
import Footer from "../../components/Footer/Footer";
import GenreDisplay from "../../components/GenreDisplay/GenreDisplay";

const AnimeGenres = () => {
  return (
    <>
      <GenreDisplay />
      <LearnMore />
    </>
  );
};

export default AnimeGenres;
