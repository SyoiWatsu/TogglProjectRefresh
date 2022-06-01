import request from "./request";
import { Project } from "interfaces";

export default {
  // 動作確認済み！
  create: ({name, workspaceId, clientId}: {
    name: string,
    workspaceId: number,
    clientId?: number,
  }): {
    status: number,
    body: Project,
  } => {
    const path = `projects`;
    const payload = {
      project: {
        name,
        wid: workspaceId,
        cid: clientId,
      },
    };
    return request.post({ path, payload });
  },

  // 動作確認済み！
  delete: ({projectId}: {
    projectId: number,
  }): {
    status: number,
    body: any,
  } => {
    const path = `projects/${projectId}`;
    return request.delete({ path });
  },
}