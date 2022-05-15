type Data = {
  viewType: string;
  title: string;
  version?: string;
  startServer?: boolean;
  proxyMode?: boolean;
  url?: string;
  autoCompleteUrl?: string;
  localProxyServerEnabled?: boolean;
  localProxyServerPort?: number;
  reloadAutoReloadEnabled?: boolean;
  reloadAutoReloadDurationTime?: number;
  columnToShowIn?: string;
  showMessageDialog?: boolean;
  showStatusBarItem?: boolean;
};

export default Data;