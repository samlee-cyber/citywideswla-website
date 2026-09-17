import { acceptRequest, IntakeError } from '../../lib/intake.mjs';
import { fields } from '../../lib/fields.mjs';
import { commonHeaders, readBody, checkOrigin, clientIp, failure, json } from '../../lib/http.mjs';
export function createHandler({env=process.env,accept=acceptRequest}={}){return async(req,res)=>{commonHeaders(res);if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,405,{status:'error',code:'method_not_allowed',message:'Use POST.'});}
 try{checkOrigin(req,{env});const body=await readBody(req,'application/json');if(Object.keys(body).some(k=>!Object.hasOwn(fields,k)&&k!=='website'))throw new IntakeError(422,'validation_failed','Please use the documented fields.',{_form:'Unexpected field in request.'});const result=await accept(body,{idempotencyKey:req.headers['idempotency-key'],ip:clientIp(req,env),env});return json(res,201,result);}
 catch(error){const err=failure(error);if(err.retryAfter)res.setHeader('Retry-After',String(err.retryAfter));return json(res,err.status,{status:'error',code:err.code,message:err.message,...(Object.keys(err.fields).length?{field_errors:err.fields}:{})});}
 };}
export default createHandler();
