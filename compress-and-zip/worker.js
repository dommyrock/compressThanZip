//TODO: process and minify /compress passed imgs here
//in main thread anly generate and show thimbnails for UI (OR better is to have another worker to handle thumbnail generation)
addEventListener("message", async (msg) => {
  debugger;
  const files = msg.data.fileBuffers;
  debugger;
  const data = await readFiles(files);
  debugger;
  postMessage(data);
});

async function readFiles(file_list) {
  let promises = [];
  for (let file of file_list) {
    debugger;
    const blob = new Blob(new Uint8Array(file));

    //Validate img
    if (!file.type.startsWith("image/")) {
      continue;
    }

    //event based API (Pro: has access to progress event)
    let filePromise = new Promise((resolve, reject) => {
      let reader = new FileReader();
      // reader.readAsArrayBuffer(file); //like byte array
      reader.readAsDataURL(file); //
      reader.onload = () => {
        try {
          const res = reader.result;
          debugger;
          resolve(reader.result);
        } catch (error) {
          reject(error);
        }
      };
    });
    //or
    // const filePromiseV2 = await new Response(file).arrayBuffer();
    debugger;
    promises.push(filePromise);
  }
  const result = await Promise.all(promises);
  return result;
}
/** progress event provided  by FileReader ... ( TODO : post back progress progress to main thread)
 *   reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`Progress: ${Math.round(percent)}`);
    }
  });
 */

//https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
/**Compression resource
 *
 * Compression libraries
 * https://web.dev/use-imagemin-to-compress-images/
 *
 * HELP
 * https://stackoverflow.com/questions/14672746/how-to-compress-an-image-via-javascript-in-the-browser (has code sample)
 * https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/mozjpeg_enc/example.html (SQUOOSH, get blob from compressed img )
 * https://gist.github.com/benawad/22090ba1fe341f3491fd34d17970beb8
 * Web worker https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
 * https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
 * TO BLOB (save to OS file system ff & Chrome support)
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
 *
 * FileReader vs. window.URL.createObjectURL
 * https://stackoverflow.com/questions/31742072/filereader-vs-window-url-createobjecturl
 *
 * Examples Img resizing (w canvas)
 * https://zocada.com/compress-resize-images-javascript-browser/
 * https://stackoverflow.com/questions/20379027/javascript-reduce-the-size-and-quality-of-image-with-based64-encoded-code
 */

/**NOTE DEBUGGING
 * When debugging worker sources -->top->localhost:3000 -->_N_E ->.-->worker.js (somethimes its not compiled)
 *If its not compiled --> F5 (will resompile ad show debuggable code)
 * Also pressing f8 must be hit in that file separate to rest of the site
 */
