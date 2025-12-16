import React from "react";
import "./GenreBanner.css";

const GenreBanner = ({ title, image }) => {
  return (
    <section
      className="genre-banner"
      style={{ backgroundImage: `url(${image})` }}
      >
      <div className="genre-banner__overlay" />
      <h1 className="genre-banner__title">{title}</h1>
    </section>
  );
};

export default GenreBanner;
