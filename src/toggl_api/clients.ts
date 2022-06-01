import request from "./request";
import { Client } from "interfaces";

export default {
  // 動作確認済み！
  create: ({name, workspaceId}: {
    name: string, 
    workspaceId: number
  }): {
    status: number,
    body: Client,
  } => {
    const path = `clients`;
    const payload = {
      client: {
        name,
        wid: workspaceId,
      },
    };
    return request.post({ path, payload });
  },

  // 動作確認済み！
  delete: ({clientId}: {
    clientId: number
  }): {
    status: number,
    body: any,
  } => {
    const path = `clients/${clientId}`;
    return request.delete({ path });
  },
}