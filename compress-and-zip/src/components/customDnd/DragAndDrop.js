import { ADD_FILE_TO_LIST, SET_DROP_DEPTH, SET_IN_DROP_ZONE } from "../../actions";
import { useCallback, useEffect, useRef, useState } from "react";
import util from "../../util";
import ProgressBar from "../ProgressBar";
import { saveAs } from "file-saver";
import JSZip from "jszip";
//Convert loaded imgs to blobs (so we can zip/save)
//TODO: zip.js docs https://gildas-lormeau.github.io/zip.js/core-api.html

const DragAndDrop = (props) => {
  const { data, dispatch } = props;

  const [totalCompressed, setTotalCompressed] = useState({
    origionalSize: 0,
    compressedSize: 0,
  });
  const [percent, setPercent] = useState(0);

  // const workerRef = useRef(); Currently not used
  // useEffect(() => {
  //   workerRef.current = new Worker("../../../worker", { type: "module" });

  //   //worker.js respose posted here
  //   workerRef.current.onmessage = async (evt) => {
  //     debugger;
  //     console.log(`WebWorker Response =>`);
  //     console.log(evt.data);
  //   };

  //   return () => {
  //     workerRef.current.terminate();
  //   };
  // }, []);

  // //Worker handler
  // const handleWork = useCallback(
  //   async (data) => {
  //     workerRef.current.postMessage(data);
  //   },
  //   [data]
  // );

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

    // e.currentTarget.style.background = "white"; example handler for firefox
    // e.target.classList.remove("inside-drag-area"); didnt work
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    e.dataTransfer.dropEffect = "copy";
    dispatch({ type: SET_IN_DROP_ZONE, inDropZone: true });
  };
  //TODO: make ui and components so i can load thumbnails into some kind of carrosel,
  //TODO 2 use react-tree-fiber +/- spring for some cool animations as img's are being loaded to DOM
  /**
   * https://codepen.io/joezimjs/pen/yPWQbd
   * https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
   * and see premade dnd compoenets for react performance optimization and re-enter dragging event
   *  + offload work with workers where posible ( zipping should be moved first )
   * + add react-tree fiber or spring for cool animations (for example as thumbs render drop down to carrosell animation )
   */
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let files = [...e.dataTransfer.files];

    //#region  Worker-code
    // let buffers = [];
    // //Read files as array buffers (so i can send Transferrable objects-more effiecient and faster)
    // for (const file of files) {
    //   buffers.push(await file.arrayBuffer());
    // }
    // //post file buffers to Worker
    // handleWork({ fileBuffers: buffers }, buffers);
    //#endregion Worker-code
    const percentageIndex = 100 / files.length;
    let percentSum = 0;
    let promises = [];
    for (const file of files) {
      const fr = new FileReader();

      if (file) {
        //triggers FileReader.onload
        fr.readAsDataURL(file); //this is needed to enter FileReader onload event
      }

      let filePromise = new Promise((resolve, reject) => {
        fr.onload = () => {
          const img = new Image();
          img.src = fr.result;

          img.onload = () => {
            //1024 bytes =1k ,1024 Kb = 1Mb
            const orgSize = img.src.length / (1024 * 1024);
            let compressedImg = util.toCompressedImg(img, 65, "jpeg", file.name);

            document.getElementById("gallery").appendChild(compressedImg);
            //#region Calc toal compression
            const shrinked = compressedImg.src.length / (1024 * 1024);
            const sumBeforeCompression = (totalCompressed.origionalSize += orgSize);
            const sumAfterCompression = (totalCompressed.compressedSize += shrinked);
            const roundedSumBefore = util.roundUp(sumBeforeCompression, 2);
            const roundedSumAfter = util.roundUp(sumAfterCompression, 2);
            //#endregion

            //Update progress percentage ( NOTE: when debugging one by one it renders properly , IRL style width lags behind)
            percentSum += percentageIndex;
            let rounded = util.roundUp(percentSum, 2);
            if (percentSum > 100) {
              rounded = 100;
            }
            setPercent(rounded);
            console.log(`Process currently @ ${rounded}%`);
            setTotalCompressed({
              origionalSize: roundedSumBefore,
              compressedSize: roundedSumAfter,
            });
            resolve(compressedImg);
          };
        };
        fr.onerror = () => {
          reject(fr.error);
        };
      });

      //didnt work as intended
      // fr.onprogress = (event) => {
      //   if (event.loaded && event.total) {
      //     const percent = (event.loaded / event.total) * 100;
      //     let progress = document.getElementById("progress-bar");
      //     progress.value = percent;
      //     console.log(`Progress: ${Math.round(percent)}`);
      //   }
      // };
      promises.push(filePromise);
    }
    const processedImages = await Promise.all(promises);

    let blobs = [];
    for (const img of processedImages) {
      const response = await fetch(img.src);
      blobs.push({ blob: response.blob(), name: img.id });
    }
    const blobsToZip = await Promise.all(blobs);

    //#region JSZip
    let zip = new JSZip();
    for (let index = 0; index < blobsToZip.length; index++) {
      const fileName = blobsToZip[index].name;
      debugger;
      zip.file(fileName, blobsToZip[index].blob); //3rd param is options {}
    }
    zip.generateAsync({ type: "blob", compression: "STORE" }).then((content) => {
      debugger;
      saveAs(content, "compressedImages");
    });
    //#endregion

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
      <h4>
        Size before compression <b style={{ color: "red" }}>{totalCompressed.origionalSize}</b> Mb
      </h4>
      <h4>
        Size after compression{" "}
        <b style={{ color: "lightgreen" }}>{totalCompressed.compressedSize}</b> Mb
      </h4>
      <div
        id="drop-zone"
        className={data.inDropZone ? "drag-drop-zone inside-drag-area" : "drag-drop-zone"}
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        <p>Drag .jpg, .jpeg, .png files here to upload</p>
      </div>
      {/* <progress id="progress-bar" max={100} value={0}></progress> html5 variant*/}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ProgressBar key="progress-bar" completed={percent} />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div id="gallery"></div>
      </div>
    </>
  );
};

export default DragAndDrop;
