import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'SimplefomrWebPartStrings';
import Simplefomr from './components/Simplefomr';
import { ISimplefomrProps } from './components/ISimplefomrProps';

export interface ISimplefomrWebPartProps {
  description: string;
  ListName:string
}

export default class SimplefomrWebPart extends BaseClientSideWebPart<ISimplefomrWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public async render(): Promise<void> {
    const cityopt=await this.getLookupValues();
    const element: React.ReactElement<ISimplefomrProps> = React.createElement(
      Simplefomr,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        ListName:this.properties.ListName,
        context:this.context,
        siteurl:this.context.pageContext.web.absoluteUrl,
        DepartmentOptions:await this.getChoiceFieldValues(this.context.pageContext.web.absoluteUrl,this.properties.ListName,"Department"),
        GenderOptions:await this.getChoiceFieldValues(this.context.pageContext.web.absoluteUrl,this.properties.ListName,"Gender"),
        SkillsOptions:await this.getChoiceFieldValues(this.context.pageContext.web.absoluteUrl,this.properties.ListName,"Skills"),
        CityOptions:cityopt

      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('ListName', {
                  label: strings.ListFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
  //Get Choice value
  private async getChoiceFieldValues(siteurl:string,ListName:string,fieldName:string):Promise<any>{
    try{
const response=await fetch(`${siteurl}_api/web/lists/getbytitle('${ListName}')/fields?$filter=EntityPropertyName eq '${fieldName}'`,{
  method:'GET',
  headers:{
    'Accept':'application/json;odata=nometadata'
  }
});
if(!response.ok){
  throw new Error(`Error while reading choice values : ${response.status}`);

}
const data=await response.json();
const choices=data.value[0].Choices;
return choices.map((choice:any)=>({
  key:choice,
  text:choice
}))
    }
    catch(err){
console.error("err",err)
return[];
    }
  }
  //Read lookup

  private async getLookupValues():Promise<any[]>{
    try{
const response=await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Cities')/items?$select=Title,ID`,{
  method:'GET',
  headers:{
    'Accept':'application/json;odata=nometadata' 
  }
});
if(!response.ok){
  throw new Error(`Error while reading lookup values : ${response.status}`);

}
const data=await response.json();
return data.value.map((city:{ID:string,Title:string})=>({
  key:city.ID,
  text:city.Title
}));
    }
    catch(err){
console.error("err",err);
return[];
    }
  }
}
