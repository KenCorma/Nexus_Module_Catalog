import initialized from "./initialized";
import theme from "./theme";
import coreInfo from "./coreInfo";
import modules from "./modules";

const {
  libraries: {
    Redux: { combineReducers }
  }
} = NEXUS;

export default function createReducer() {
  return combineReducers({
    initialized,
    theme,
    coreInfo,
    modules
  });
}
