import { useState } from "react";
import { useTransition, animated } from "react-spring";

const transTest = () => {
  const [items, set] = useState([]);

  const transitions = useTransition(items, (item) => item.key, {
    from: { transform: "translate3d(0,-40px,0)" },
    enter: { transform: "translate3d(0,0px,0)" },
    leave: { transform: "translate3d(0,-40px,0)" },
  });

  const handleClick = () => {
    const rndNum = Math.floor(Math.random() * 100);
    const obj = {
      value: rndNum,
      key: `${rndNum}-uniqueKey`,
    };
    set((items) => items.concat(obj));
  };
  const handleRemoveItem = () => {
    const oneLess = items.slice(0, -1);
    set(oneLess);
  };

  return (
    <>
      <button style={{ padding: "10px", backgroundColor: "green" }} onClick={handleClick}>
        Add
      </button>
      <button style={{ padding: "10px", backgroundColor: "red" }} onClick={handleRemoveItem}>
        Kill
      </button>
      {transitions.map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
          {item.value}
        </animated.div>
      ))}
    </>
  );
};
export default transTest;
