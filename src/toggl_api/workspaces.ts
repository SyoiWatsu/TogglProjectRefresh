import request from "./request";
import { Client, Project } from "interfaces";
import { getUrl } from "utils";

export default {
  clients: {
    // 動作確認済み！
    get: ({ workspaceId }: {
      workspaceId: number,
    }): {
      status: number,
      body: Client[],
    } => {
      const path = `workspaces/${workspaceId}/clients`;
      return request.get({
        path: path,
      });
    },
  },

  projects: {
    // 動作確認済み！
    get: ({ workspaceId }: {
      workspaceId: number,
    }): {
      status: number,
      body: Project[],
    } => {
      const path = `workspaces/${workspaceId}/projects`;
      return request.get({
        path: path,
      });
    },
  },
}

