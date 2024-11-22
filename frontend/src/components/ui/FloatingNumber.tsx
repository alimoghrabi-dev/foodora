import React, { useEffect, useState } from "react";

const FloatingNumber: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onAnimationEnd: () => void;
}> = React.memo(({ startX, startY, endX, endY, onAnimationEnd }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const animationDuration = 2000;
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onAnimationEnd();
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  const translateX = endX - startX;
  const translateY = endY - startY;

  return (
    <div
      className={`floating-number ${isAnimating ? "animating" : ""}`}
      style={
        {
          top: `${startY}px`,
          left: `${startX}px`,
          "--translate-x": `${translateX}px`,
          "--translate-y": `${translateY}px`,
        } as React.CSSProperties
      }
    >
      1
    </div>
  );
});

export default FloatingNumber;
