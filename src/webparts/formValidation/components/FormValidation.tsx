import * as React from 'react';
import styles from './FormValidation.module.scss';
import type { IFormValidationProps } from './IFormValidationProps';
import { FormikClass } from '../../../FormikServices/FormikService';
import {sp} from "@pnp/sp/presets/all";
 import * as Yup from 'yup';
  import { Formik,FormikProps ,Form} from 'formik';
import { Dialog } from '@microsoft/sp-dialog';
import { DatePicker, Dropdown, Label, PrimaryButton, Stack, TextField } from '@fluentui/react';
import {  PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
const stackTokens={childrenGap:20};
const FormValidation:React.FC<IFormValidationProps>=(props)=>{
  const [service,setService]=React.useState<FormikClass|null>(null);

  React.useEffect(()=>{
    sp.setup({
      spfxContext:props.context as any
    });
    setService(new FormikClass(props.siteurl))
  },[props.context,props.siteurl]);

const SignupSchema=Yup.object().shape({
  name: Yup.string()
     .min(10, 'Too Short!')
     .max(50, 'Too Long!')
     .required('Task Name is required'),
     details:Yup.string().min(20,'Minimum 20 character are required').required('Task details are required'),
     startDate:Yup.date().required('Start Date is required'),
     endDate:Yup.date().required('End Date is required'),
     phoneNumber:Yup.string().required('Phone Number is required').matches(/^[0-9]{10}$/,'Phone number is not valid'),
     emailAddress:Yup.string().email('Invalid email').required('Email Address is Required'),
     projectName:Yup.string().required('Project Name is required')

});

//event handling
const getFieldProps=(formik:FormikProps<any>,field:string)=>({
  ...formik.getFieldProps(field),errorMessgae:formik.errors[field] as string
});
const createRecord=async(record:any)=>{
  try{
const item=await service?.createItems(props.ListName,{
  Title:record.name,
  TaskDetails:record.details,
  StartDate:record.startDate,
  EndDate:record.endDate,
  PhoneNumber:record.phoneNumber,
  EmailAddress:record.emailAddress,
  ProjectName:record.projectName
});
console.log("Item created:",item);
Dialog.alert("Item created successfully");
  }
  catch(err){
console.log("Error in creating item:",err);
  }
}
  return(
    <>
     <Formik
       initialValues={{
        name:'',
        details:'',
        startDate:null,
        endDate:null,
        phoneNumber:'',
        emailAddress:'',
        projectName:''
       }}
       validationSchema={SignupSchema}
       onSubmit={(values,helpers)=>{
        createRecord(values).then(()=>helpers.resetForm())
       }}
     >

{(formik:FormikProps<any>)=>(
  <Form onSubmit={formik.handleSubmit}>
<div className={styles.formValidation}>
  <Stack tokens={stackTokens}>
<Label className={styles.lbl}>User Name</Label>
 <PeoplePicker
    context={props.context as any}
  
    personSelectionLimit={1}
    showtooltip={true}
disabled={true}
    principalTypes={[PrincipalType.User]}
    resolveDelay={1000}
    ensureUser={true}
    defaultSelectedUsers={[props.context.pageContext.user.displayName as any]}
    webAbsoluteUrl={props.siteurl}
    />
    <Label className={styles.lbl}>Task Name</Label>
    <TextField
    {...getFieldProps(formik,'name')}/>
      <Label className={styles.lbl}>Email Address</Label>
    <TextField
    {...getFieldProps(formik,'emailAddress')}/>
      <Label className={styles.lbl}>Phone Number</Label>
    <TextField
    {...getFieldProps(formik,'phoneNumber')}/>
      <Label className={styles.lbl}>Project Name</Label>
      <Dropdown
      options={[
        {key:'Project A',text:'Project A'},
        {key:'Project B',text:'Project B'},
        {key:'Project C',text:'Project C'}
      ]}
   selectedKey={formik.values.projectName}
    onChange={(_,options)=>formik.setFieldValue('projectName',options?.key)}
    errorMessage={formik.errors.projectName as string}
      />
        <Label className={styles.lbl}>Start Date</Label>
        <DatePicker
        id="startDate"
        value={formik.values.startDate}
        textField={{...getFieldProps(formik,'startDate')}}
        onSelectDate={(date)=>formik.setFieldValue('startDate',date)}
        />
          <Label className={styles.lbl}>End Date</Label>
        <DatePicker
        id="endDate"
        value={formik.values.endDate}
        textField={{...getFieldProps(formik,'endDate')}}
        onSelectDate={(date)=>formik.setFieldValue('endDate',date)}
        />
         <Label className={styles.lbl}>Task Details</Label>
    <TextField
    {...getFieldProps(formik,'taskDetails')}
    multiline
    rows={5}
    />
  </Stack>
  <PrimaryButton
  type='submit'
  className={styles.btn}
  text='Submit'
  iconProps={{iconName:'save'}}
  />
<PrimaryButton
text='Cancel'
iconProps={{iconName:'cancel'}}
onClick={formik.handleReset as any}
className={styles.btn}
/>
</div>
  </Form>
)}
     </Formik>
    
    </>
  )
}
export default FormValidation;