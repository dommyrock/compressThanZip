import { ADD_FILE_TO_LIST, SET_DROP_DEPTH, SET_IN_DROP_ZONE, SET_SHARE_URL } from "../../actions";
import { useState } from "react";
import util from "../../util";
import ProgressBar from "../ProgressBar";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useSpring, useTransition, animated } from "react-spring";
//OPTIMIZATION NOTE
//memo is not enough here since also pasing dispatch , i would also need to wrap dispatch in useCallback
const DragAndDrop = (props) => {
  const { data, dispatch } = props;

  const [totalCompressed, setTotalCompressed] = useState({
    origionalSize: 0,
    compressedSize: 0,
    sizeAfterZip: 0,
  });
  const [sizeAfterZip, setSizeAfterZip] = useState(0);
  const [percent, setPercent] = useState(0);

  //update spring props on compression size capture
  const beforeCompression_props = useSpring({
    to: { number: totalCompressed.origionalSize, opacity: 1, color: "red" },
    from: { number: 0, opacity: 0, color: "#ccc" },
    config: { duration: 1400 },
  });
  const afterCompression_props = useSpring({
    to: { number: totalCompressed.compressedSize, opacity: 1, color: "#E5A46F" },
    from: { number: 0, opacity: 0, color: "#ccc" },
    config: { duration: 1600 },
  });
  const afterZip_props = useSpring({
    to: { number: sizeAfterZip, opacity: 1, color: "lightgreen" },
    from: { number: 0, opacity: 0, color: "#ccc" },
    config: { duration: 1700 },
  });
  //transition img div container onLoad image
  // const [galleryImages, setGalleryImage] = useState([]);

  // const transitions = useTransition(galleryImages, (img) => img.key, {
  //   from: { transform: "translate3d(0,-40px,0)" },
  //   enter: { transform: "translate3d(0,0px,0)" },
  // });

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
  /**
   * https://codepen.io/joezimjs/pen/yPWQbd
   * https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
   * see https://www.youtube.com/watch?v=5QCYBiANRYs&ab_channel=ReactEurope (react-spring)
   * 2+ offload work with workers where posible ( zipping should be moved first )
   * 3+ add sharing to google drive,one drive,dropbox ... (use their api's,auth...)
   * 4+ add ML (image tagging/classification w ML models...)
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
            let compressedImg = util.toCompressedImg(img, 65, data.outputFormat, file.name);
            //ADD TO GALLERY
            document.getElementById("gallery").appendChild(compressedImg);

            // REACT-SPRING ON IMAGE LOAD
            // setGalleryImage((state) =>
            //   state.concat({ src: compressedImg.src, key: compressedImg.id, width: 150 })
            // );

            //#region Calc toal compression
            const shrinked = compressedImg.src.length / (1024 * 1024);
            const sumBeforeCompression = (totalCompressed.origionalSize += orgSize);
            const sumAfterCompression = (totalCompressed.compressedSize += shrinked);
            const roundedSumBefore = util.roundUp(sumBeforeCompression, 2); //or.toFixed(2)
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
      //NOTE: when usign fetch.blob() mime-type is lost
      const response = await (await fetch(img.src)).blob();

      blobs.push({ blob: response, name: img.id });
    }
    const blobsToZip = await Promise.all(blobs);

    //#region JSZip
    let zip = new JSZip();
    for (let index = 0; index < blobsToZip.length; index++) {
      const fileName = blobsToZip[index].name;
      zip.file(fileName, blobsToZip[index].blob);
    }
    zip.generateAsync({ type: "blob", compression: "STORE" }).then((content) => {
      const shareData = {
        share_URL: URL.createObjectURL(content).replace("blob:", ""),
        share_file_name: "compressedImages.zip",
      };
      const zippedSize = content.size / (1024 * 1024);
      setSizeAfterZip(zippedSize);

      dispatch({ type: SET_SHARE_URL, share: shareData });
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
      <div className="stats_container">
        <h4>
          Before compression{" "}
          {beforeCompression_props && (
            <animated.b style={beforeCompression_props}>
              {beforeCompression_props.number.interpolate((number) => number.toFixed(2))}
            </animated.b>
          )}{" "}
          Mb
        </h4>
        <h4>
          After compression{" "}
          {afterCompression_props && (
            <animated.b style={afterCompression_props}>
              {afterCompression_props.number.interpolate((number) => number.toFixed(2))}
            </animated.b>
          )}{" "}
          Mb
        </h4>
        <h4>
          After zip{" "}
          {afterZip_props && (
            <animated.b style={afterZip_props}>
              {afterZip_props.number.interpolate((number) => number.toFixed(2))}
            </animated.b>
          )}{" "}
          Mb
        </h4>
      </div>
      <div
        id="drop-zone"
        className={data.inDropZone ? "drag-drop-zone inside-drag-area" : "drag-drop-zone"}
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        <p>Drop .jpg, .png, .webp files here to compress</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ProgressBar key="progress-bar" completed={percent} />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div id="gallery">
          {/* THIS DIDNT WORK OUT (NEED TO RESEARCH HOW TO ANIMTE IMAGE CONTAINER DIV ON IMG LOAD) */}
          {/* {transitions.map(({ item, props, key }) => {
            <animated.div key={key} style={props}>
              <img src={item.src} width={item.width} alt="gallery-img" />;
            </animated.div>;
          })} */}
        </div>
      </div>
    </>
  );
};

export default DragAndDrop;
