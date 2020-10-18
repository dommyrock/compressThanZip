export default {
  /**
   *
   * @param {Image} source_img_obj
   * @param {Number} quality
   * @param {String} output_format
   * @param {String} image_Id
   */
  toCompressedImg(source_img_obj, quality, output_format, image_Id) {
    let mime_type;
    if (output_format === "png") {
      mime_type = "image/png"; //since quality arg only suporst jpg,and webp might need to convert this format to one of 2
    } else if (output_format === "webp") {
      mime_type = "image/webp";
    } else {
      mime_type = "image/jpeg";
    }
    //#region Downscale
    let downscale = { maxW: 1600, maxH: 1200 }; //WhatsApp downscale sizes
    if (
      source_img_obj.naturalWidth < downscale.maxW ||
      source_img_obj.naturalHeight < downscale.maxH
    ) {
      //keep original dimensions for smaller pictures
      downscale.maxW = source_img_obj.naturalWidth;
      downscale.maxH = source_img_obj.naturalHeight;
    } else {
      if (source_img_obj.naturalWidth < source_img_obj.naturalHeight) {
        downscale.maxW = 1200;
        downscale.maxH = 1600;
      }
    }
    const aspectRatio = this.calculateAspectRatioFit(
      source_img_obj.naturalWidth,
      source_img_obj.naturalHeight,
      downscale.maxW,
      downscale.maxH
    );
    //#endregion Downscale

    let canvas = document.createElement("canvas");
    [canvas.width, canvas.height] = [aspectRatio.width, aspectRatio.height];
    let ctx = canvas.getContext("2d");
    //drawimage:https://devdocs.io/dom/canvasrenderingcontext2d/drawimage
    ctx.drawImage(source_img_obj, 0, 0, aspectRatio.width, aspectRatio.height);
    let newImageData = canvas.toDataURL(mime_type, quality / 100);

    let result_image_obj = new Image();
    //Get filename/change img extension
    result_image_obj.id = this.changeOutputFileType(image_Id, mime_type);
    result_image_obj.src = newImageData;
    return result_image_obj;
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

  roundUp(num, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
  },
  /**
   * Switch output file type
   * @param {String} file_name
   * @param {String} mime_type
   */
  changeOutputFileType(file_name, mime_type) {
    let indexOfDot = file_name.lastIndexOf(".");
    switch (mime_type) {
      case "image/png":
        return file_name.substr(0, indexOfDot < 0 ? file_name.length : indexOfDot) + ".png";
      case "image/webp":
        return file_name.substr(0, indexOfDot < 0 ? file_name.length : indexOfDot) + ".webp";
      case "image/jpeg":
        return file_name.substr(0, indexOfDot < 0 ? file_name.length : indexOfDot) + ".jpeg";
    }
  },
};
