import { memo } from "react";

const ProgressBar = memo((props) => {
  const { completed } = props;

  const containerStyles = {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 50,
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundImage: `linear-gradient(
        to right,
        rgb(41, 115, 226),
        rgb(221, 180, 153),
        rgb(34, 235, 174)
      )`,
    borderRadius: "5px",
    // borderRadius: "inherit",
    textAlign: "right",
    transition: "width 1s ease-in-out",
  };

  const labelStyles = {
    padding: 5,
    color: "white",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
});

export default ProgressBar;
