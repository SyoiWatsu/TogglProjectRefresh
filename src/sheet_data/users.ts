import { SHEET_CONSTS } from 'consts';
import { TogglProjectsConfigSheet } from 'sheets';
import { User } from 'interfaces';

const usersSheet: GoogleAppsScript.Spreadsheet.Sheet | null 
  = TogglProjectsConfigSheet.
    getSheetByName(SHEET_CONSTS.TOGGL_PROJECTS_CONFIG.TABS.USERS);

let users: User[] 
  = usersSheet?.getDataRange().getValues().
    slice(1).filter(row => row[0]).
    map(row => {
      const user: User = {
        administrator: row[0],
        apiToken: row[1],
        userAgent: row[2],
        workspaceId: row[3],
        status: row[4],
        done: row[6],
      };
      return user;
    }) || [];

export default users;