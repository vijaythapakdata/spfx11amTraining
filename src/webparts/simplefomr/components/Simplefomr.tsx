import * as React from 'react';
// import styles from './Simplefomr.module.scss';
import type { ISimplefomrProps } from './ISimplefomrProps';
import { ISimpleFomrState } from './ISimplefomrState';
import {Web} from "@pnp/sp/presets/all";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import { Dialog } from '@microsoft/sp-dialog';
import { ChoiceGroup, Dropdown, IDropdownOption, PrimaryButton, Slider, TextField, Toggle } from '@fluentui/react';
import {  PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
// import { set } from '@microsoft/sp-lodash-subset';

const Simplefomr:React.FC<ISimplefomrProps>=(props)=>{
  const [formData,setFormdata]=React.useState<ISimpleFomrState>({
    Name:"",
    Email:"",
    FullAddress:"",
    Salary:"",
    Age:"",
    Score:1,
    Permission:false,
    Department:"",
    Gender:"",
    City:"",
    Skills:[],
    Manager:[],
    ManagerId:[],
    Admin:"",
    AdminId:""
  });

  const createItem=async()=>{
try{
let web=Web(props.siteurl); // it will capture the site url
let list=web.lists.getByTitle(props.ListName);
let item=await list.items.add({
Title:formData.Name,
EmailAddress:formData.Email,
Address:formData.FullAddress,
Age:parseInt(formData.Age),//typecasting to number data type
Salary:parseFloat(formData.Salary),
Score:formData.Score,
Permission:formData.Permission,
Gender:formData.Gender,
Department:formData.Department,
CityId:formData.City,
Skills:{results:formData.Skills},
AdminId:formData.AdminId,
ManagerId:{results:formData.ManagerId}
});
Dialog.alert(`Item has been created successfully with ID :${item.data.Id}`);
console.log("Items",item);
setFormdata({
 Name:"",
    Email:"",
    FullAddress:"",
    Salary:"",
    Age:"",
    Score:1,
    Permission:false,
     Department:"",
    Gender:"",
    City:"",
    Skills:[],
     Manager:[],
    ManagerId:[],
    Admin:"",
    AdminId:""
})
}
catch(err){
console.error("Erorr",err);
Dialog.alert(`Erorr while creating the item : ${err}`);
}
  }

  //event handling 
  const FormEvent=(fieldvalue:keyof ISimpleFomrState,value:string|number|boolean)=>{
    // setFormdata(prev=>({...prev,[fieldvalue]:value}))
    setFormdata(prev=>({...prev,[fieldvalue]:value}))
  }
  //on skills change
  const onSkillsChange=(event:React.FormEvent<HTMLInputElement>,options:IDropdownOption):void=>{
    const selectedkey=options.selected?[...formData.Skills,options.key as string]:formData.Skills.
    filter((key)=>key!==options.key);
    setFormdata(prev=>({...prev,Skills:selectedkey}))
  }
  //get admin
  const _getAdminItems=(items: any[])=> {
    if(items.length>0){
    setFormdata(prev=>({...prev,Admin:items[0].text,AdminId:items[0].id}))
    }
    else{
      setFormdata(prev=>({...prev,Admin:"",AdminId:""}))
    }

}
//get manager
const getManagers=(items:any)=>{
  const managerName=items.map((i:any)=>i.text);
   const managerNameId=items.map((i:any)=>i.id);
   setFormdata(prev=>({...prev,Manager:managerName,ManagerId:managerNameId}))
}
  return(
    <>
    <TextField
    label='Name'
    value={formData.Name}
    onChange={(_,value)=>FormEvent("Name",value||"")}
    />
     <TextField
    label='Email Address'
    value={formData.Email}
    onChange={(_,value)=>FormEvent("Email",value||"")}
    iconProps={{iconName:'mail'}}
    />
     <TextField
    label='Age'
    value={formData.Age}
    onChange={(_,value)=>FormEvent("Age",value||"")}
    />
     <TextField
    label='Salary'
    value={formData.Salary}
    onChange={(_,value)=>FormEvent("Salary",value||"")}
    prefix='$'
    suffix='USD'
    />
    <Slider
    label='Score'
    value={formData.Score}
    onChange={(val)=>FormEvent("Score",val||"")}
    min={1}
    max={100}
    />
    {/* Boolean */}
    <Toggle
    label="Permission"
    checked={formData.Permission}
    onChange={(_,val)=>FormEvent("Permission",val??false)}
    onText='YES'
    offText='NO'
    />
    {/* Choices means dropdwon */}
    <Dropdown
    label='Department'
    options={props.DepartmentOptions}
    onChange={(_,options)=>FormEvent("Department",options?.key as string)}
    selectedKey={formData.Department}
    />
     <Dropdown
    label='City'
    options={props.CityOptions}
    onChange={(_,options)=>FormEvent("City",options?.key as string)}
    selectedKey={formData.City}
    />
     <ChoiceGroup
    label='Gender'
    options={props.GenderOptions}
    onChange={(_,options)=>FormEvent("Gender",options?.key as string)}
    selectedKey={formData.Gender}
    />
    <Dropdown
    key={formData.Skills.join(',')}
    options={props.SkillsOptions}
    label='Skills'
    defaultSelectedKeys={formData.Skills}
    onChange={onSkillsChange}
    multiSelect
    />
    <PeoplePicker
    context={props.context as any}
    titleText="Admin"
    personSelectionLimit={1}
    showtooltip={true}
    onChange={_getAdminItems}
    principalTypes={[PrincipalType.User]}
    resolveDelay={1000}
    ensureUser={true}
    defaultSelectedUsers={[formData.Admin?formData.Admin:""]}
    webAbsoluteUrl={props.siteurl}
    />
      <PeoplePicker
    context={props.context as any}
    titleText="Managers"
    personSelectionLimit={3}
    showtooltip={true}
    onChange={getManagers}
    principalTypes={[PrincipalType.User]}
    resolveDelay={1000}
    ensureUser={true}
    defaultSelectedUsers={formData.Manager}
    webAbsoluteUrl={props.siteurl}
    />
     <TextField
    label='Full Address'
    value={formData.FullAddress}
    onChange={(_,value)=>FormEvent("FullAddress",value||"")}
    multiline
    rows={5}
    iconProps={{iconName:'home'}}
    />
    <br/>
    <PrimaryButton text='Save'
    onClick={createItem}
    iconProps={{iconName:'save'}}
    />
    </>
  )
}
export default Simplefomr;