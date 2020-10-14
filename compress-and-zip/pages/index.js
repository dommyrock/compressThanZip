import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useReducer } from "react";
import { dragEventsReducer } from "../src/reducers/dragEventsReducer";
import DragAndDrop from "../src/components/customDnd/DragAndDrop";
import FormatSlider from "../src/components/FormatSlider";
// import { Container } from "../src/components/droppable/DroppableContainer";

export default function Home() {
  //v2
  const [data, dispatch] = useReducer(dragEventsReducer, {
    dropDepth: 0,
    inDropZone: false,
    fileList: [],
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Custom dnd TODO: refactor this with memo and useCallback liek premade dnd and add custom css from "vanila with gallery*/}
        <FormatSlider>Format</FormatSlider>
        <div>
          <DragAndDrop data={data} dispatch={dispatch} />
          <ol className="dropped-files">
            {data.fileList.map((f) => {
              return <li key={f.name}>{f.name}</li>;
            })}
          </ol>
        </div>
        {/* react-dnd Premade compoenent EXAMPLE -REMOVED Because i made custom one (remove this when i finish cusom one)*/}
        {/* <DndProvider backend={HTML5Backend}>
          <Container />
        </DndProvider> */}

        <div style={{ border: "solid" }}>
          <div style={{ margin: "4px", border: "solid" }}>
            <p>Examples of dnd</p>
            <ul>
              <li>
                <a href="https://web.dev/drag-and-drop/">web dev</a>
              </li>
              <li>
                <a href="https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/">
                  Vanila with gallery
                </a>
              </li>
              <li>
                <a href="https://www.digitalocean.com/community/tutorials/js-drag-and-drop-vanilla-js">
                  Vanila js example
                </a>
              </li>
              <li>
                <a href="https://stuk.github.io/jszip/documentation/api_jszip.html">jzip API</a>
              </li>
            </ul>
          </div>
        </div>
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
