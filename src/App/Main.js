import {
  showConnections,
  hideConnections,
  updateInput,
  setAvailableModules
} from "actions/actionCreators";

import ModuleEntry from "./ModuleEntry";
import Popup from "./Popup";

const {
  libraries: {
    React,
    ReactRedux: { connect },
    emotion: { styled }
  },
  components: { GlobalStyles, Panel, Switch, Tooltip, TextField, Button },
  utilities: {
    confirm,
    rpcCall,
    onceRpcReturn,
    showErrorDialog,
    showSuccessDialog,
    proxyRequest
  }
} = NEXUS;

const ThemeList = styled.div({
  padding: "0.5rem 1rem 0rem 1rem",
  flexGrow: 1,
  flexBasis: "35em",
  overflow: "auto"
});

@connect(
  state => ({
    coreInfo: state.coreInfo,
    showingConnections: state.settings.showingConnections,
    inputValue: state.ui.inputValue,
    availableModules: state.modules.availableModules
  }),
  { showConnections, hideConnections, updateInput, setAvailableModules }
)
class Main extends React.Component {
  componentDidMount() {
    this.test();
  }

  handleChange = e => {
    this.props.updateInput(e.target.value);
  };

  async test() {
    try {
      const result = await proxyRequest(
        "https://api.github.com/repos/KenCorma/Nexus_Module_Catalog/contents/ModuleList.json",
        { responseType: "json" }
      );
      console.error(result);

      const aaaaa = JSON.parse(atob(result.data.content));
      console.log(aaaaa.Modules);
      //console.log(asdgh);
      this.props.setAvailableModules(aaaaa.Modules);
    } catch (e) {
      console.error(e);
    }
  }

  returnButtons() {
    //return;
    const buttons = this.props.availableModules.map(Element => {
      return <ModuleEntry data={Element} />;
    });
    console.log(buttons);
    return <ThemeList>{buttons}</ThemeList>;
  }

  render() {
    const {
      coreInfo,
      showingConnections,
      inputValue,
      availableModules
    } = this.props;
    console.log(availableModules);
    return (
      <Panel title="Wallet Theme List" icon={{ url: "react.svg", id: "icon" }}>
        <GlobalStyles />
        {this.props.openPreview ? (
          <Popup incomingTheme={this.props.selectedTheme} />
        ) : null}
        {this.returnButtons()}
      </Panel>
    );
  }
}

export default Main;
