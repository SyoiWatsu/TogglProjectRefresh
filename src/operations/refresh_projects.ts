import TogglApi from 'toggl_api';
import { SHEET_CONSTS } from 'consts';
import { TogglProjectsConfigSheet } from 'sheets';
import SheetData from 'sheet_data';
import { User, Client, Project } from 'interfaces';
import { ApiToken } from 'store';

const refreshProjects = (): void => {
  const activeUsers = SheetData.users.filter(user => 
    user.status == 'active' && !user.done
  );
  const clients = SheetData.clients;

  let count = 0; //仮
  for(let user of activeUsers){
    if(user.done) continue;

    count++; //仮
    if(count > 3) break; //仮

    console.log('Target user : ', user.administrator);
    ApiToken.set(user.apiToken);
    deleteProjects(user); //できた！
    
    // 作りたい project の一覧を作る
    // {name, wid, cid} の配列
    // 　↓
    // 作る 
  }
};

// 引数に渡されたユーザーの Project を全て削除
const deleteProjects = (user: User) => {
  const projects: Project[] = TogglApi.workspaces.projects.
    get({workspaceId: user.workspaceId}).body || [];
  if(!projects.length){
    console.warn('No projects ...');
    return;
  }
  for(let project of projects){
    try{
      TogglApi.projects.delete({projectId: project.id});
      console.log('deleted: ', project);
    }
    catch(error) {
      console.warn('⚠️ Catched error when deleting : ', project);
      console.warn(error);
    }
    finally{
      // API の呼び出し制限回避のため 1秒 待つ
      Utilities.sleep(1000);
    }
  }
};

export default refreshProjects;