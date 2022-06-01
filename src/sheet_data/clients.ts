import { SHEET_CONSTS } from 'consts';
import { TogglProjectsConfigSheet } from 'sheets';

const clientsSheet: GoogleAppsScript.Spreadsheet.Sheet | null
  = TogglProjectsConfigSheet.
    getSheetByName(SHEET_CONSTS.TOGGL_PROJECTS_CONFIG.TABS.CLIENTS);
const clients: string[] 
  = clientsSheet?.getDataRange().getValues().flat().slice(1) || [];

export default clients;