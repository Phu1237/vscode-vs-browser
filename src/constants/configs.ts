import { StatusBarAlignment } from "vscode";

/* eslint-disable @typescript-eslint/naming-convention */
const FAVOURITES_SAVING_PROFILE = {
  NAME: {
    AUTO: "auto",
    GLOBAL: "global",
    WORKSPACE: "workspace",
  },
  DEFAULT: "global",
};

const STATUS_BAR_ITEM = {
  ALIGNMENT: StatusBarAlignment.Right,
  PRIORITY: 100,
};

export default {
  FAVOURITES_SAVING_PROFILE,
  STATUS_BAR_ITEM,
};
