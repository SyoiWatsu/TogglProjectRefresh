import TogglApi from 'toggl_api';
import { SHEET_CONSTS } from 'consts';
import { TogglProjectsConfigSheet } from 'sheets';
import SheetData from 'sheet_data';
import { User, Client } from 'interfaces';
import { ApiToken } from 'store';

const refreshClients = (): void => {
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
    deleteClients(user);
    createClients(clients, user);
    markAsDone(user);
  }
};

// 引数に渡されたユーザーの Client を全て削除
const deleteClients = (user: User): void => {
  const clients: Client[] = TogglApi.workspaces.clients.
    get({workspaceId: user.workspaceId}).body;
  for(let client of clients){
    try {
      TogglApi.clients.delete({clientId: client.id});
      console.log('deleted: ', client.name);
    }
    catch(error) {
      console.warn('⚠️ Catched error when deleting : ', client);
      console.warn(error);
    }
    finally {
      // API の呼び出し制限回避のため 1秒 待つ
      Utilities.sleep(1000);
    }
  }
};

// 引数に渡されたユーザーの Client を新規作成
const createClients = (clients: string[], user: User): void => {
  for(let client of clients){
    try {
      const res = TogglApi.clients.create({
        name: client,
        workspaceId: user.workspaceId,
      });
      console.log('created :', res.body);
    }
    catch(error) {
      console.warn('⚠️ Catched error when creating: ', client);
      console.warn(error);
    }
    finally {
      // API の呼び出し制限回避のため 1秒 待つ
      Utilities.sleep(1000);
    }
  }
};

// 引数に渡されたユーザーの done 列にチェック
const markAsDone = (user: User): void => {
  const index = SheetData.users.findIndex(u => u.apiToken == user.apiToken);
  if(index < 0){
    console.warn('No match index for', user);
    return;
  }
  TogglProjectsConfigSheet.
    getSheetByName(SHEET_CONSTS.TOGGL_PROJECTS_CONFIG.TABS.USERS)?.
    getRange(`G${index + 2}`).
    setValue(true);
};

export default refreshClients;