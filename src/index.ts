import TogglApi from 'toggl_api';
import Operetions from 'operations';

declare let global: any;

global.TEST = (): void => {
  const workspaceId = 4747380;
  // const res = TogglApi.workspaces.projects.get({workspaceId});
  // console.log(res);

  // 動作確認済み
  // Operetions.refreshClients();

  // まだ delete しかできない
  Operetions.refreshProjects();

  // const clientId = 50332645;
  // const name = 'ぐぴぴぴぴぴっぴいっぴぴ！！';
  // const res = TogglApi.projects.create({ name, workspaceId, clientId });
  // console.log(res);


  // const projectId = 169401675;
  // const res = TogglApi.projects.delete({projectId});
  // console.log(res);
  
};
