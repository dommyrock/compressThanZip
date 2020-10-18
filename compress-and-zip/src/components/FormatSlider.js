import { useEffect, useState } from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { useGesture } from "react-with-gesture";
import { SET_OUTPUT_FORMAT } from "../actions";

const FormatSlider = ({ children, dispatch }) => {
  const [bind, { delta, down }] = useGesture();
  const { x, bg, size } = useSpring({
    x: down ? delta[0] : 0,
    bg: `linear-gradient(120deg, ${
      delta[0] < 0 ? "#f093fb 0%, #f5576c" : "#96fbc4 0%, #f9f586"
    } 100%)`,
    size: down ? 1.1 : 1,
    immediate: (name) => down && name === "x",
  });
  const avSize = x.interpolate({
    map: Math.abs,
    range: [50, 300],
    output: ["scale(0.5)", "scale(1)"],
    extrapolate: "clamp",
  });
  //change text as we delta changes(we slide left /,righ)
  let renderText = "";
  if (delta[0] > 180) {
    renderText = "jpeg";
  } else if (delta[0] < -180) {
    renderText = "webp";
  }

  useEffect(() => {
    dispatch({ type: SET_OUTPUT_FORMAT, renderText });
  }, [renderText]);

  return (
    <animated.div {...bind()} className="item" style={{ background: bg }}>
      <animated.div
        className="av"
        style={{ transform: avSize, justifySelf: delta[0] < 0 ? "end" : "start" }}
      />
      <animated.div
        className="fg"
        style={{
          transform: interpolate([x, size], (x, s) => `translate3d(${x}px,0,0) scale(${s})`),
        }}
      >
        {renderText ? renderText : children}
      </animated.div>
    </animated.div>
  );
};

export default FormatSlider;

/**
 * REACT SPRING 
 * It looks like props.number is a number but it's not,
 *  it's an instance of AnimatedValue from react-spring so you can't apply your typical functions to it and what not.
  I'm pretty sure if you wanna format that number value you can just do something like 
  {props.number.interpolate(number => number.toFixed())}
 */
