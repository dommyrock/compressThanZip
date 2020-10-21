import {
  ADD_FILE_TO_LIST,
  SET_DROP_DEPTH,
  SET_IN_DROP_ZONE,
  SET_OUTPUT_FORMAT,
  SET_SHARE_URL,
} from "../actions";

export const dragEventsReducer = (state, action) => {
  switch (action.type) {
    case SET_DROP_DEPTH:
      return { ...state, dropDepth: action.dropDepth };
    case SET_IN_DROP_ZONE:
      return { ...state, inDropZone: action.inDropZone };
    case ADD_FILE_TO_LIST:
      return { ...state, fileList: state.fileList.concat(action.files) };
    case SET_OUTPUT_FORMAT:
      return { ...state, outputFormat: action.renderText };
    case SET_SHARE_URL:
      return { ...state, share: action.share };
    default:
      return state;
  }
};
