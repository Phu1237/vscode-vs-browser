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
  reloadAutoReloadEnabled?: boolean;
  reloadAutoReloadDurationTime?: number;
  columnToShowIn?: string;
  showMessageDialog?: boolean;
  showStatusBarItem?: boolean;
};

export default Data;