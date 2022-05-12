type Config = {
  proxy?: boolean;
  url?: string;
  autoCompleteUrl?: string;
  localProxyServerEnable?: boolean;
  localProxyServerPort?: number;
  reloadEnableAutoReload?: boolean;
  reloadTime?: number;
  columnToShowIn?: string;
  showMessageDialog?: boolean;
  showStatusBarItem?: boolean;
};

export default Config;