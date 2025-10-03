import * as React from 'react';
// import styles from './Simplefomr.module.scss';
import type { ISimplefomrProps } from './ISimplefomrProps';
import { ISimpleFomrState } from './ISimplefomrState';
import {Web} from "@pnp/sp/presets/all";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import { Dialog } from '@microsoft/sp-dialog';
import { ChoiceGroup, Dropdown, PrimaryButton, Slider, TextField, Toggle } from '@fluentui/react';

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
    City:""
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
CityId:formData.City
});
Dialog.alert(`Item has been created successfully with ID :${item.data.Id}`);
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
    City:""
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