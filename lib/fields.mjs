import { serviceCatalogue, industryCatalogue } from '../content/pages.mjs';
export const fields = {
 contact_name:{label:'Name',required:true,max:100,autocomplete:'name'},
 work_email:{label:'Work Email',required:true,max:254,type:'email',autocomplete:'email'},
 company:{label:'Company',required:true,max:150,autocomplete:'organization'},
 phone:{label:'Phone',max:40,type:'tel',autocomplete:'tel'},
 facility_city:{label:'Facility City',required:true,max:100,autocomplete:'address-level2'},
 facility_type:{label:'Facility Type',max:100,options:[...industryCatalogue.map(s=>s[1]),'Other / not sure yet']},
 service_needed:{label:'Service Needed',required:true,max:100,options:[...serviceCatalogue.map(s=>s[1]),'Multiple services / not sure yet']},
 facility_size_sqft:{label:'Approximate Square Footage',max:12,type:'number'},
 service_frequency:{label:'Desired Frequency',max:100,options:['Daily','Several times a week','Weekly','Monthly','One-time project','Not sure yet']},
 facility_details:{label:'Facility Details',max:3000,type:'textarea'},
};
export const MAX_BODY_BYTES=16384;
export function validateFields(input) {
 const data={},errors={};
 if(!input||typeof input!=='object'||Array.isArray(input))return {data,errors:{_form:'Send an object containing the form fields.'}};
 for(const [name,f] of Object.entries(fields)){
  const raw=input[name];
  if(raw!==undefined&&typeof raw!=='string'){errors[name]='Use a text value.';data[name]='';continue;}
  const value=(raw||'').trim();data[name]=value;
  if(f.required&&!value)errors[name]=`${f.label} is required.`;
  else if(value.length>f.max)errors[name]=`Use no more than ${f.max} characters.`;
  else if((f.type!=='textarea'&&/[\r\n]/.test(value))||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value))errors[name]='Remove unsupported control characters.';
  else if(value&&name==='work_email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))errors[name]='Enter a valid email address.';
  else if(value&&f.options&&!f.options.includes(value))errors[name]='Choose an available option.';
  else if(value&&name==='facility_size_sqft'&&!/^[1-9]\d{0,11}$/.test(value))errors[name]='Enter a positive whole number or leave this blank.';
 }
 return {data,errors};
}
