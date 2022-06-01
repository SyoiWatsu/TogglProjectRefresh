import serializer from "./serializer";
import { TOGGL_CONSTS } from "consts";
import { getUrl } from "utils";
import { ApiToken } from "store";

export default {
  // TODO: parameters を受け取って url のお尻にいい感じにくっつけられるように
  get: ({path, params}: {
    path: string, 
    params?: Object,
  }): {
    status: number,
    body: any,
  } => {
    const url: string = getUrl(TOGGL_CONSTS.BASE_URL, path);
    const headers = {
      "Authorization" : "Basic " + Utilities.base64Encode(ApiToken.get() + ":" + "api_token"),
    };
    const res = UrlFetchApp.fetch(url, {
      method: "get",
      headers: headers,
      // muteHttpExceptions: false,
    });
    return serializer({res});
  },
  
  post: ({path, payload}: {
    path: string, 
    payload?: Object,
  }): {
    status: number,
    body: any,
  } => {
    const url: string = getUrl(TOGGL_CONSTS.BASE_URL, path);
    const headers = {
      "Authorization" : "Basic " + Utilities.base64Encode(ApiToken.get() + ":" + "api_token"),
    };
    const res = UrlFetchApp.fetch(url, {
      method: "post",
      headers: headers,
      contentType: "application/json",
      payload: JSON.stringify(payload),
    });
    return serializer({res});
  },

  delete: ({path, payload}: {
    path: string,
    payload?: Object,
  }): {
    status: number,
    body: any,
  } => {
    const url: string = getUrl(TOGGL_CONSTS.BASE_URL, path);
    const headers = {
      "Authorization" : "Basic " + Utilities.base64Encode(ApiToken.get() + ":" + "api_token"),
    };
    const res = UrlFetchApp.fetch(url, {
      method: "delete",
      headers: headers,
      contentType: "application/json",
      payload: JSON.stringify(payload),
    });
    return serializer({res});
  },
}