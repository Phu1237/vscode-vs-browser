type Data = {
  viewType: string;
  title: string;
  proxyMode?: boolean;
  url?: string;
  autoCompleteUrl?: string;
  localProxyServerEnabled?: boolean;
  localProxyServerPort?: number;
  localProxyServerCookieDomainRewrite?: boolean;
  localProxyServerForceLocation?: boolean;
  reloadOnSave?: boolean;
  autoReloadDurationEnabled?: boolean;
  autoReloadDurationTime?: number;
  columnToShowIn?: string;
  showMessageDialog?: boolean;
  showStatusBarItem?: boolean;
};

export default Data;
