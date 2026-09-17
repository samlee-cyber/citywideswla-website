import { createHmac, randomUUID } from 'node:crypto';
import { validateFields, MAX_BODY_BYTES } from './fields.mjs';
export const NEXT_STEP='A City Wide representative will review the request.';
export const RATE_LIMIT=10, RATE_WINDOW=900, RETRY_TTL=86400;
export const configured=(env=process.env)=>['INTAKE_SIGNING_KEY','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','RESEND_API_KEY','LEAD_TO_EMAIL','LEAD_FROM_EMAIL'].every(k=>Boolean(env[k]))&&env.INTAKE_SIGNING_KEY.length>=32;
export const fingerprint=(value,secret)=>createHmac('sha256',secret).update(value).digest('hex');
export class IntakeError extends Error { constructor(status,code,message,fields={},retryAfter){super(message);Object.assign(this,{status,code,fields,retryAfter});} }
export const unavailable=()=>new IntakeError(503,'intake_unavailable','Online requests are unavailable. Your request has not been confirmed. Please call (562) 473-3136.');
export const RATE_SCRIPT=`local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n`;
// Reserve the request and matching-content key atomically. Records contain no form text.
export const RESERVE_SCRIPT=`
local existing=redis.call('GET',KEYS[1]); local r=nil
if existing then r=cjson.decode(existing); if r.fingerprint~=ARGV[1] then return cjson.encode({state='conflict'}) end end
if not r then local same=redis.call('GET',KEYS[2]); if same then r=cjson.decode(same) end end
local now=tonumber(ARGV[3]); local ttl=tonumber(ARGV[4])
if r then
 if r.status=='received' then redis.call('SET',KEYS[1],cjson.encode(r),'EX',math.max(1,ttl-(now-r.created))); return cjson.encode({state='received',record=r}) end
 if now-r.created>=82800 then return cjson.encode({state='expired'}) end
 if r.status=='pending' and now-r.attempt<30 then return cjson.encode({state='pending'}) end
else r={request_id=ARGV[2],fingerprint=ARGV[1],created=now} end
r.status='pending'; r.attempt=now; r.lease=ARGV[5]
local encoded=cjson.encode(r); local remaining=math.max(1,ttl-(now-r.created))
redis.call('SET',KEYS[1],encoded,'EX',remaining); redis.call('SET',KEYS[2],encoded,'EX',remaining)
return cjson.encode({state='reserved',record=r})`;
export const FINISH_SCRIPT=`
local value=redis.call('GET',KEYS[2]); if not value then return 0 end
local r=cjson.decode(value); if r.lease~=ARGV[1] then return 0 end
r.status=ARGV[2]; local ttl=math.max(1,tonumber(ARGV[4])-(tonumber(ARGV[3])-r.created)); local encoded=cjson.encode(r)
redis.call('SET',KEYS[1],encoded,'EX',ttl); redis.call('SET',KEYS[2],encoded,'EX',ttl); return 1`;
export function redisStore(env=process.env,fetcher=fetch){
 const command=async args=>{const response=await fetcher(env.UPSTASH_REDIS_REST_URL,{method:'POST',headers:{Authorization:`Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(7000)});if(!response.ok)throw unavailable();const value=await response.json();if(value.error||!Object.hasOwn(value,'result'))throw unavailable();return value.result;};
 return {
  rate:key=>command(['EVAL',RATE_SCRIPT,'1',key,String(RATE_WINDOW)]),
  reserve:async (keys,hash,id,now,lease)=>JSON.parse(await command(['EVAL',RESERVE_SCRIPT,'2',...keys,hash,id,String(now),String(RETRY_TTL),lease])),
  finish:(keys,lease,status,now)=>command(['EVAL',FINISH_SCRIPT,'2',...keys,lease,status,String(now),String(RETRY_TTL)]),
 };
}
export function emailSender(env=process.env,fetcher=fetch){return async (data,id)=>{
 const result=await fetcher('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`cw-walkthrough/${id}`},body:JSON.stringify({from:env.LEAD_FROM_EMAIL,to:[env.LEAD_TO_EMAIL],reply_to:data.work_email,subject:'City Wide SWLA: facility walkthrough request',text:['Facility walkthrough request',`Reference: ${id}`,'',...Object.entries(data).map(([key,value])=>`${key}: ${value||'(not provided)'}`),'','Source: https://www.gocitywideswla.com/'].join('\n')}),signal:AbortSignal.timeout(10000)});
 if(!result.ok)throw new IntakeError(502,'handoff_unconfirmed','We could not confirm your request. Please retry with the same details or call (562) 473-3136.');
 const receipt=await result.json();if(!receipt.id)throw unavailable();return receipt.id;
};}
export async function acceptRequest(input,{idempotencyKey,ip='unknown',env=process.env,store,send,now=Math.floor(Date.now()/1000)}={}){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new IntakeError(400,'invalid_body','Send a JSON object or the website form.');
 if(Buffer.byteLength(JSON.stringify(input))>MAX_BODY_BYTES)throw new IntakeError(413,'body_too_large','Request exceeds the 16 KB limit.');
 if(!configured(env)){
  const checked=validateFields(input);if(Object.keys(checked.errors).length)throw new IntakeError(422,'validation_failed','Please check your details.',checked.errors);
  throw unavailable();
 }
 store||=redisStore(env);send||=emailSender(env);
 try{const count=await store.rate('cw:rate:'+fingerprint(ip,env.INTAKE_SIGNING_KEY));if(count>RATE_LIMIT)throw new IntakeError(429,'rate_limited','Too many requests. Please wait before trying again, or call (562) 473-3136.',{},RATE_WINDOW);}catch(error){if(error instanceof IntakeError)throw error;throw unavailable();}
 if(input.website)throw new IntakeError(422,'request_rejected','We could not accept this request. Please call (562) 473-3136.');
 const {data,errors}=validateFields(input);if(Object.keys(errors).length)throw new IntakeError(422,'validation_failed','Please check your details.',errors);
 if(!/^[A-Za-z0-9_-]{16,128}$/.test(idempotencyKey||''))throw new IntakeError(400,'invalid_idempotency_key','Provide an Idempotency-Key of 16–128 letters, digits, underscores, or hyphens.');
 const hash=fingerprint(JSON.stringify(data),env.INTAKE_SIGNING_KEY);
 const keys=['cw:request:'+fingerprint(idempotencyKey,env.INTAKE_SIGNING_KEY),'cw:content:'+hash];const lease=randomUUID();let reservation;
 try{reservation=await store.reserve(keys,hash,randomUUID(),now,lease);}catch{throw unavailable();}
 if(reservation.state==='conflict')throw new IntakeError(409,'idempotency_conflict','This key was used with different details. Use a new key for a different request.');
 if(reservation.state==='pending')throw new IntakeError(429,'request_in_progress','This request is being processed. Retry with the same key and details.',{},30);
 if(reservation.state==='expired')throw new IntakeError(503,'confirmation_required','Please call (562) 473-3136 to check this earlier request before submitting again.');
 if(!['received','reserved'].includes(reservation.state)||!reservation.record?.request_id)throw unavailable();
 const id=reservation.record.request_id;
 if(reservation.state==='reserved'){
  try{await send(data,id);}catch(error){try{await store.finish(keys,lease,'retryable',now);}catch{}throw error instanceof IntakeError?error:new IntakeError(502,'handoff_unconfirmed','We could not confirm delivery. Retry with the same key and details, or call (562) 473-3136.');}
  try{if(await store.finish(keys,lease,'received',now)!==1)throw unavailable();}catch{throw unavailable();}
 }
 return {status:'received',request_id:id,next_step:NEXT_STEP};
}
