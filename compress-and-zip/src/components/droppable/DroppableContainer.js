import { useState, useCallback } from "react";
import { TargetBox } from "./TargetBox";
import { FileList } from "./FileList";

export const Container = () => {
  const [droppedFiles, setDroppedFiles] = useState([]);

  const handleFileDrop = useCallback((item, monitor) => {
    if (monitor) {
      const files = monitor.getItem().files;
      setDroppedFiles(files);
      console.log(files);
    }
  }, []);
  return (
    <>
      <TargetBox onDrop={handleFileDrop} />
      <FileList files={droppedFiles} />
    </>
  );
};
