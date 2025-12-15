import React from "react";
import './Hero.css'
import hero_img from '../../assets/hero-img.jpg'


const Hero = () => {
  return (
    <>
      <section className="hero" style={{ "--hero-img": `url(${hero_img})` }}>
        <div className="hero-content">
          <h1>Enter the Animatri<span className="indigo">X</span></h1>
          <p>
            Explore anime worlds, characters, and culture—powered by indigo
            energy.
          </p>
          <div className="hero-btns">
            <button className="btn-primary">Learn More</button>
            <button className="btn-secondary">Browse</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
