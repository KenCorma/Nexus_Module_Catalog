import { setAvailableModules } from "actions/actionCreators";

import ModuleEntry from "./ModuleEntry";

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

const ModuleList = styled.div({
  padding: "0.5rem 1rem 0rem 1rem",
  flexGrow: 1,
  flexBasis: "35em",
  overflow: "auto"
});

@connect(
  state => ({
    coreInfo: state.coreInfo,
    availableModules: state.modules.availableModules
  }),
  { setAvailableModules }
)
class Main extends React.Component {
  componentDidMount() {
    this.getModuleList();
  }

  async getModuleList() {
    try {
      const result = await proxyRequest(
        "https://api.github.com/repos/KenCorma/Nexus_Module_Catalog/contents/ModuleList.json",
        { responseType: "json" }
      );
      const resultData = JSON.parse(atob(result.data.content));
      this.props.setAvailableModules(resultData.Modules);
    } catch (e) {
      console.error(e);
    }
  }

  returnButtons() {
    const modules = this.props.availableModules.map(Element => {
      return <ModuleEntry data={Element} />;
    });
    return <ModuleList>{modules}</ModuleList>;
  }

  render() {
    const { coreInfo, availableModules } = this.props;
    return (
      <Panel title="Wallet Theme List" icon={{ url: "logo.svg", id: "icon" }}>
        <GlobalStyles />
        {this.returnButtons()}
      </Panel>
    );
  }
}

export default Main;
