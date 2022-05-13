type Data = {
  viewType: string;
  title: string;
  proxy?: boolean;
  url?: string;
  autoCompleteUrl?: string;
  localProxyServerEnabled?: boolean;
  localProxyServerPort?: number;
  reloadAutoReloadEnabled?: boolean;
  reloadAutoReloadDurationTime?: number;
  columnToShowIn?: string;
  showMessageDialog?: boolean;
  showStatusBarItem?: boolean;
  version?: string;
  startServer?: boolean;
};

export default Data;