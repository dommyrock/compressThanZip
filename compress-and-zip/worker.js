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

/**NOTE DEBUGGING
 * When debugging worker sources -->top->localhost:3000 -->_N_E ->.-->worker.js (somethimes its not compiled)
 *If worker code is not compiled --> F5 (will resompile and show debuggable code)
 * Also pressing f8 must be hit in that file separate to rest of the site
 */
