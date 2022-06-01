export {
  User,
  Client,
  Project,
}

interface User {
  administrator: string;
  apiToken: string;
  userAgent: string;
  workspaceId: number;
  status: string;
  done: boolean;
};

interface Client {
  id: number,
  wid: number,
  name: string,
  at: string,
  notes?: string,
  hrate?: number,
  cur?: string,
}

interface Project {
  id: number,
  wid: number,
  cid: number,
  name: string,
  billable: boolean,
  is_private: boolean,
  active: boolean,
  at: string,
};