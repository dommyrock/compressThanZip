export default {
  toCompressedImg(source_img_obj, quality, output_format) {
    let mime_type;
    if (output_format === "png") {
      mime_type = "image/png";
    } else if (output_format === "webp") {
      mime_type = "image/webp";
    } else {
      mime_type = "image/jpeg";
    }
    //#region Downscale
    let downscale = { maxW: 0, maxH: 0 };
    if (source_img_obj.naturalWidth > source_img_obj.naturalHeight) {
      downscale.maxW = 1600;
      downscale.maxH = 1200;
    } else {
      downscale.maxW = 1200;
      downscale.maxH = 1600;
    }
    const aspectRatio = this.calculateAspectRatioFit(
      source_img_obj.naturalWidth,
      source_img_obj.naturalHeight,
      downscale.maxW,
      downscale.maxH
    ); //WhatsApp downscale sizes
    //#endregion Downscale

    let cvs = document.createElement("canvas");
    [cvs.width, cvs.height] = [aspectRatio.width, aspectRatio.height];
    let ctx = cvs.getContext("2d");
    //drawimage:https://devdocs.io/dom/canvasrenderingcontext2d/drawimage
    ctx.drawImage(source_img_obj, 0, 0, aspectRatio.width, aspectRatio.height);
    let newImageData = cvs.toDataURL(mime_type, quality / 100);
    let result_image_obj = new Image();
    result_image_obj.src = newImageData;
    return result_image_obj;
  },
  //resize img if needed
  async returnNewImageAsync(src, width, height) {
    return new Promise((resolve, reject) => {
      let result_image_obj = new Image();

      result_image_obj.onload = () => {
        result_image_obj.width = width;
        result_image_obj.height = height;
        resolve(result_image_obj);
      };
      result_image_obj.onerror = (ev) => reject(ev);
      //trigger onload
      result_image_obj.src = src;
    });
  },

  /**
   * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
   * images to fit into a certain area.
   *
   * @param {Number} srcWidth width of source image
   * @param {Number} srcHeight height of source image
   * @param {Number} maxWidth maximum available width
   * @param {Number} maxHeight maximum available height
   * @return {Object} { width, height }
   */
  calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
  },
  //other options (smooothing ,alpha....)
  //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
};
