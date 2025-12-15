import React from "react";
import "./LearnMore.css";
import { Sword, Sparkles, Skull, Heart, Brain, Zap } from "lucide-react";

const LearnMore = () => {
  return (
    <section className="learn-more">
      <div className="learn-more__content">
        <h2>What is AnimatriX?</h2>

        <p>
          AnimatriX is a curated gateway into anime worlds — characters,
          stories, aesthetics, and culture brought together in one immersive
          experience.
        </p>

        <p>
          From iconic classics to underground gems, AnimatriX helps you explore,
          discover, and connect beyond the surface level.
        </p>

        <div className="anime-icons">
          <div className="anime-icon">
            <Sword />
          </div>
          <div className="anime-icon">
            <Sparkles />
          </div>
          <div className="anime-icon">
            <Zap />
          </div>
          <div className="anime-icon">
            <Skull />
          </div>
          <div className="anime-icon">
            <Heart />
          </div>
          <div className="anime-icon">
            <Brain />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearnMore;
