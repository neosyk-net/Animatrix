import React, { useEffect, useState } from "react";
import "./Hero.css";
import hero_img from "../../assets/hero-img.jpg";
import { Link } from "react-router-dom";

const SHUFFLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const Hero = () => {
  const titleTarget = "Enter the AnimatriX";
  const descTarget =
    "Explore anime worlds, characters, and culture—powered by indigo energy.";

  const [titleText, setTitleText] = useState(titleTarget);
  const [descText, setDescText] = useState(descTarget);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    animateShuffle(titleTarget, setTitleText, 28, 35, () => {
      animateShuffle(descTarget, setDescText, 22, 25, () => {
        setShowButtons(true);
      });
    });
  }, []);

  const animateShuffle = (target, setter, frames, speed, onComplete) => {
    let frame = 0;

    const interval = setInterval(() => {
      frame++;

      const progress = frame / frames;
      const revealCount = Math.floor(progress * target.length);

      const nextText = target
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealCount) return target[index];
          return SHUFFLE_CHARS[
            Math.floor(Math.random() * SHUFFLE_CHARS.length)
          ];
        })
        .join("");

      setter(nextText);

      if (frame >= frames) {
        setter(target);
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
  };

  return (
    <section
      className="hero gloss-animate"
      style={{ "--hero-img": `url(${hero_img})` }}
    >
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>
          {titleText.replace("X", "")}
          <span className="indigo">X</span>
        </h1>

        <p>{descText}</p>

        <div className={`hero-btns ${showButtons ? "show" : ""}`}>
          <Link to="/genres">
            <button className="btn-primary">Genres</button>
          </Link>
          <Link to="/search">
            <button className="btn-secondary">Browse</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
