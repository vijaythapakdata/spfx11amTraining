import * as React from 'react';
// import styles from './Simplefomr.module.scss';
import type { ISimplefomrProps } from './ISimplefomrProps';
import { ISimpleFomrState } from './ISimplefomrState';
import {Web} from "@pnp/sp/presets/all";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import { Dialog } from '@microsoft/sp-dialog';

const Simplefomr:React.FC<ISimplefomrProps>=(props)=>{
  const [formData,setFormdata]=React.useState<ISimpleFomrState>({
    Name:""
  });

  const createItem=async()=>{
try{
let web=Web(props.siteurl); // it will capture the site url
let list=web.lists.getByTitle(props.ListName);
let item=await list.items.add({
  Title:formData.Name
});
Dialog.alert(`Item has been created successfully with ID :${item.data.Id}`);
setFormdata({
  Name:""
})
}
catch(err){
console.error("Erorr",err);
Dialog.alert(`Erorr while creating the item : ${err}`);
}
  }
  
  return(
    <></>
  )
}
export default Simplefomr;