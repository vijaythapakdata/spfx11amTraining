import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISimplefomrProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context:WebPartContext;
  siteurl:string;
  ListName:string;
  DepartmentOptions:any;//Single selected dropdwon
  GenderOptions:any;//radio button
  SkillsOptions:any;//mulitselected dropddwon
  CityOptions:any;//lookup
}
