// Lotte files
import Lottie from "lottie-react";

import animationData1 from "../animations/hero-bike.json";
import animationData2 from "../animations/hero-next.json";
import animationData3 from "../animations/hero-line.json";
import React from "react";

function HeroAnimation() {
  const animationData =
    Math.random() < 0.33
      ? animationData1
      : Math.random() < 0.5
      ? animationData2
      : animationData3;

  return (
    <div className="hero-animation-container max-h-[400px]">
      <Lottie animationData={animationData} />
    </div>
  );
}

export default HeroAnimation;
