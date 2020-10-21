import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useReducer } from "react";
import { dragEventsReducer } from "../src/reducers/dragEventsReducer";
import DragAndDrop from "../src/components/customDnd/DragAndDrop";
import FormatSlider from "../src/components/FormatSlider";
import TransTest from "../src/components/transTest";

function renderSaveToDrive(shareObject) {
  const sitename = location.hostname;
  gapi.savetodrive.render("savetodrive-div", {
    src: shareObject.share_URL,
    filename: shareObject.share_file_name,
    sitename: sitename,
  });
}
export default function Home() {
  //v2
  const [data, dispatch] = useReducer(dragEventsReducer, {
    dropDepth: 0,
    inDropZone: false,
    fileList: [],
    outputFormat: "",
    share: {
      share_file_name: "",
      share_URL: "",
    },
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Compress&Share</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://apis.google.com/js/platform.js" async defer></script>
      </Head>

      {/* Custom dnd TODO: refactor this with memo and useCallback liek premade dnd and add custom css from "vanila with gallery*/}
      <main className={styles.main}>
        {/* SAVE TO DRIVE API: https://developers.google.com/drive/api/v3/savetodrive */}
        {/* TODO : Login w google acc to be able to share to google drive https://developers.google.com/identity/sign-in/web/sign-in  & https://www.youtube.com/watch?v=l9atSDs7-oI&ab_channel=Amarindaz*/}
        {data.share.share_URL && (
          <>
            <a
              href="javascript:void(0)"
              id="render-link"
              onClick={() => renderSaveToDrive(data.share)}
            >
              Render the Save to Drive button
            </a>
            <div id="savetodrive-div"></div>
          </>
        )}
        <FormatSlider dispatch={dispatch} data={data}>
          Format
        </FormatSlider>
        <div style={{ display: "flex" }}>
          <img
            width="35"
            height="35"
            src="/info.svg"
            title="Slide 'Format' to select output image format.&#010;Images are also zipped into compressedImages.zip"
          />
        </div>
        <div>
          <DragAndDrop data={data} dispatch={dispatch} />
          <ol className="dropped-files">
            {data.fileList.map((f) => {
              return <li key={f.name}>{f.name}</li>;
            })}
          </ol>
        </div>
        {/* WORKING R-SPRING EXAMPLE  */}
        {/* <TransTest /> */}
        TODO sync to google driive sync to one drive
        {/* EXAMPLE -REMOVED Because i made custom one (remove this when i finish cusom one)*/}
        {/* <DndProvider backend={HTML5Backend}>
          <Container />
        </DndProvider> */}
      </main>

      <footer className={styles.footer}>
        <h4 style={{ marginRight: "10px" }}> Resources :</h4>
        <a href="https://www.w3schools.com/html/html5_draganddrop.asp">w3schools vanila dnd |</a>
        <a href="https://react-dnd.github.io/react-dnd/about"> react-dnd |</a>
        <a href="https://shopify.github.io/draggable/examples/unique-dropzone.html">
          shopify droppable |
        </a>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API">MDN</a>
      </footer>
    </div>
  );
}
