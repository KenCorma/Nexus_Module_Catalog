import FileSaver from "../deps/FileSaver";

const {
  libraries: {
    React,
    ReactRedux: { connect },
    emotion: { styled }
  },
  components: { GlobalStyles, Panel, Switch, Tooltip, TextField, Button },
  utilities: { color, proxyRequest }
} = NEXUS;

const ThemeButtonContainer = styled.div(({ theme }) => ({
  background: color.darken(theme.background, 0.2),
  border: `1px solid ${color.lighten(theme.background, 0.1)}`,
  borderRadius: "2.5px",
  display: "grid",
  transition: `background ${1}`,
  margin: "0em 0em .5em 0em"
}));

const ContainerTitle = styled.div(({ theme }) => ({
  width: "100%",
  textAlign: "Center",
  color: theme.primary,
  background: color.lighten(theme.background, 0.1)
}));

const ContainerTop = styled.div(({ theme }) => ({
  margin: ".25em 1em .25em 1em",
  display: "grid",
  gridTemplateColumns: "auto auto",
  gridTemplateRows: "auto"
}));

const ContainerBottom = styled.div(({ theme }) => ({
  margin: "1em",
  display: "grid",
  gridTemplateColumns: "auto auto auto",
  gridTemplateRows: "auto",
  gridGap: "0px .25em"
}));

const Line = styled.div(({ theme }) => ({
  background: theme.primary,
  width: "100%",
  height: "2px"
}));

@connect(
  state => ({
    general: state.general
  }),
  {}
)
class ModuleEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloads: [],
      moduleVersion: ""
    };
  }

  componentDidMount() {
    this.getDownloads();
  }

  async getDownloads() {
    try {
      const { Name, Author, Description, Repo } = this.props.data;
      const result = await proxyRequest(
        `https://api.github.com/repos/${Author}/${Repo}/releases/latest`,
        { responseType: "json" }
      );
      const downloadUrls = result.data.assets.map(element => {
        return element.browser_download_url;
      });
      this.setState({
        downloads: downloadUrls,
        moduleVersion: result.data.tag_name
      });
    } catch (e) {
      console.error(e);
    }
  }

  async clickSaveFile(url, assetName) {
    try {
      FileSaver.saveAs(url, assetName);
    } catch (e) {
      console.error(e);
    }
  }

  returnDownloadButtons() {
    return this.state.downloads.map(element => {
      const urlSplit = element.split("/");
      const assetName = urlSplit[urlSplit.length - 1];
      return (
        <Button
          style={{ width: "100%" }}
          onClick={() => this.clickSaveFile(element, assetName)}
        >
          {assetName}
        </Button>
      );
    });
  }

  render() {
    const { Name, Author, Description, Repo } = this.props.data;
    const { moduleVersion } = this.state;

    return (
      <ThemeButtonContainer>
        <ContainerTitle>{Name}</ContainerTitle>
        <ContainerTop>
          <div>
            {`Description: ${Description}`}
            <br />
            {`Author: ${Author}`}
          </div>
          <div style={{ textAlign: "right" }}>
            {`Version: ${moduleVersion}`}
            <br />
            {`Repo: ${Repo}`}
          </div>
        </ContainerTop>
        <Line />
        <ContainerBottom>{this.returnDownloadButtons()}</ContainerBottom>
      </ThemeButtonContainer>
    );
  }
}

export default ModuleEntry;
