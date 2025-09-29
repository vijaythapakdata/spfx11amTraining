import * as React from 'react';
// import styles from './FirstWebpart.module.scss';
import type { IFirstWebpartProps } from './IFirstWebpartProps';
import { TextField,Dropdown ,ComboBox, ChoiceGroup,Slider,Toggle,Rating,  Checkbox, PrimaryButton, DefaultButton, SearchBox} from '@fluentui/react';

const FirstWebpart:React.FC<IFirstWebpartProps>=(props)=>{
  return(
    <>
    <p> I am learning <strong>spfx</strong></p>
    <hr/>
    <h4>NEW FORM</h4>
    <hr/>
    <form>
      <SearchBox
      placeholder='search here.....'
      iconProps={{iconName:'Search'}}
      />
      <br/>
<TextField
label='Name'
placeholder='Enter value here'

/>
      <TextField
      label='Email'
      type='email'
      placeholder='Enter email here'
      iconProps={{iconName:'mail'}}
      />
      <TextField
label='Password'
// placeholder='Enter value here'
type='password'
canRevealPassword={true}

/>
<TextField
label='Upload File'
// placeholder='Enter value here'
type='file'


/>
<TextField
label='Salary'
// placeholder='Enter value here'
prefix='$'
suffix='USD'

/>
<Dropdown
label='Department'
options={[
  {key:'HR',text:'HR'},
  {key:'IT',text:'IT'},
  {key:'Finance',text:'Finance'},
]}
placeholder='--select--'
multiSelect
/>
<ComboBox
label='Skills'
options={[
  {key:'javascript',text:'JavaScript'},
  {key:'reactjs',text:'ReactJS'},
  {key:'angular',text:'Angular'},
  {key:'vuejs',text:'VueJS'},
]}
allowFreeform
autoComplete='on'
multiSelect
/>
<ChoiceGroup
label='Gender'
options={[
  {key:'Male',text:'Male'},
  {key:'Female',text:'Female'}
]}
/>
<Slider
label='Score'
min={1}
max={100}
step={1}
/>
<Toggle
label='Yes/No'
/>
<Rating
    max={5}
        // size={L}
        defaultRating={1}
        ariaLabel="Large stars"
        ariaLabelFormat="{0} of {1} stars"
/>
<TextField
label='Comments'
multiline
rows={5}
iconProps={{iconName:'comment'}}
/>
<Checkbox
label='I accept terms and conditions'
/>
<br/>
<PrimaryButton
text='Save' iconProps={{iconName:'Save'}}
/>
&nbsp; &nbsp;&nbsp; &nbsp;
<DefaultButton
text='Cancel' iconProps={{iconName:'Cancel'}}
/>
{/* html vs fluent ui  */}

<input title='HTML textfiled ' type='text'/>
<br/>
<button>Button</button>
<select>
  <option label='HR'>HR</option>
    <option label='IT'>IT</option>
</select>
    </form>
    </>
  )
}
export default FirstWebpart;
