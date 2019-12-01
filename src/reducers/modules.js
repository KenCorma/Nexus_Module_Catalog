import * as TYPE from "actions/types";

const initialState = {
  availableModules: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_AVAILABLE_MODULES:
      return {
        ...state,
        availableModules: action.payload
      };

    default:
      return state;
  }
};
