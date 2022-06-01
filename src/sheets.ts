import { SHEET_CONSTS } from 'consts';

export const TogglProjectsConfigSheet: 
  GoogleAppsScript.Spreadsheet.Spreadsheet = 
  SpreadsheetApp.openById(SHEET_CONSTS.TOGGL_PROJECTS_CONFIG.SSID);
