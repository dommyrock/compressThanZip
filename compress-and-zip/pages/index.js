import Head from "next/head";
import styles from "../styles/Home.module.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Container } from "../src/components/droppable/DroppableContainer";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* TODO ..FIND OUT HOW TO CUSTOMIZE REACT DND OR MAKE IT ALL CUSTOM FOR EASYER STYLNG (WEB DEV EXAMPLE) */}
        <DndProvider backend={HTML5Backend}>
          <Container />
        </DndProvider>

        <div style={{ border: "solid" }}>
          <div style={{ margin: "4px", border: "solid" }}>
            <p>Examples of dnd</p>
            <ul>
              <li>
                <a href="https://web.dev/drag-and-drop/">web dev</a>
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
