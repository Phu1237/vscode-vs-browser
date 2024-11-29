/* eslint-disable @typescript-eslint/naming-convention */
const BASE = {
  BROWSER: {
    viewType: "browser",
    title: "VS Browser",
  },
  PROXY: {
    viewType: "proxy",
    title: "VS Browser - Proxy",
    proxyMode: true,
  },
  WITHOUT_PROXY: {
    viewType: "withoutproxy",
    title: "VS Browser - Without proxy",
    proxyMode: false,
  },
};

export default {
  BASE,
};
