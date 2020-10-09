import { ADD_FILE_TO_LIST, SET_DROP_DEPTH, SET_IN_DROP_ZONE } from "../../actions";
import { saveAs } from "file-saver";
import { useCallback, useEffect, useRef } from "react";
import util from "../../util";

const DragAndDrop = (props) => {
  const { data, dispatch } = props;
  const workerRef = useRef();
  useEffect(() => {
    workerRef.current = new Worker("../../../worker", { type: "module" });

    //worker.js respose posted here
    workerRef.current.onmessage = async (evt) => {
      debugger;
      console.log(`WebWorker Response =>`);
      console.log(evt.data);
    };

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  //Worker handler
  const handleWork = useCallback(
    async (data) => {
      workerRef.current.postMessage(data);
    },
    [data]
  );

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: SET_DROP_DEPTH, dropDepth: data.dropDepth + 1 });
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: SET_DROP_DEPTH, dropDepth: data.dropDepth - 1 });
    if (data.dropDepth > 0) return;
    dispatch({ type: SET_IN_DROP_ZONE, inDropZone: false });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    e.dataTransfer.dropEffect = "copy";
    dispatch({ type: SET_IN_DROP_ZONE, inDropZone: true });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let files = [...e.dataTransfer.files];

    //#region  Worker-code
    //File blob to Uint8Array (used in fflate npm ---but couldnt make it work w images)
    // const massiveFbuff = new Uint8Array(await files[0].arrayBuffer());
    // let buffers = [];
    // //Read files as array buffers (so i can send Transferrable objects-more effiecient and faster)
    // for (const file of files) {
    //   buffers.push(await file.arrayBuffer());
    // }
    // //post ile buffers to Worker
    // handleWork({ fileBuffers: buffers }, buffers);
    //#endregion Worker-code

    for (const file of files) {
      const fr = new FileReader();
      fr.onload = () => {
        const img = new Image();
        img.src = fr.result;

        img.onload = () => {
          //1024 bytes =1k ,1024 Kb = 1Mb
          const orgSize = img.src.length / (1024 * 1024);
          let compressedImg = util.toCompressedImg(img, 55, "jpeg");
          const shrinked = compressedImg.src.length / (1024 * 1024);
          console.log(`Compressed/downscaled img from ${orgSize}Mb  to  ${shrinked}Mb ...`);
          console.log(`Original w/h: ${img.width}/${img.height}`);
          console.log(`New w/h: ${compressedImg.width}/${compressedImg.height}`);
          debugger;
          //test dom element
          document.getElementById("test2").src = compressedImg.src;
          //TODO: make ui and components so i can load thumbnails into some kind of carrosel
          //and show compression progress if possible !
          /**
           * https://codepen.io/joezimjs/pen/yPWQbd
           * https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
           * and see premade dnd compoenets for react performance optimization and re-enter dragging event
           */
        };
      };
      if (file) {
        //triggers FileReader.onload
        fr.readAsDataURL(file); //this is needed to enter FileReader onload event
      }
    }

    // saveAs(content, "compressedImages.zip");

    if (files && files.length > 0) {
      const existingFiles = data.fileList.map((f) => f.name);
      files = files.filter((f) => !existingFiles.includes(f.name));

      dispatch({ type: ADD_FILE_TO_LIST, files });
      dispatch({ type: SET_DROP_DEPTH, dropDepth: 0 });
      dispatch({ type: SET_IN_DROP_ZONE, inDropZone: false });
    }
  };
  //accept=".jpg, .jpeg, .png"
  return (
    <>
      <div
        className={data.inDropZone ? "drag-drop-zone inside-drag-area" : "drag-drop-zone"}
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        <p>Drag .jpg, .jpeg, .png files here to upload</p>
      </div>
      <img id="test1"></img>
      <img id="test2"></img>
    </>
  );
};

export default DragAndDrop;
