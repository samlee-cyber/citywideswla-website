import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { business } from '../content/business.mjs';
import { IntakeError } from './intake.mjs';
import { MAX_BODY_BYTES } from './fields.mjs';
export function sign(value,secret){const body=Buffer.from(JSON.stringify(value)).toString('base64url');return body+'.'+createHmac('sha256',secret).update(body).digest('base64url');}
export function verify(token,secret){try{const [body,mac,extra]=String(token).split('.');if(extra||!mac||!body||!secret)return null;const expected=createHmac('sha256',secret).update(body).digest();const actual=Buffer.from(mac,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;const value=JSON.parse(Buffer.from(body,'base64url').toString('utf8'));if(!Number.isFinite(value.exp)||value.exp<Date.now()/1000)return null;return value;}catch{return null;}}
export function cookies(req){const result={};for(const part of String(req.headers.cookie||'').split(';')){const i=part.indexOf('=');if(i>0)result[part.slice(0,i).trim()]=part.slice(i+1).trim();}return result;}
export function setCookie(res,name,value,seconds,env=process.env){const previous=res.getHeader('Set-Cookie')||[];res.setHeader('Set-Cookie',[...(Array.isArray(previous)?previous:[previous]),`${name}=${value}; Path=/; Max-Age=${seconds}; HttpOnly; SameSite=Lax${env.VERCEL?' ; Secure':''}`]);}
export function freshForm(req,res,env=process.env){const secret=env.INTAKE_SIGNING_KEY;if(!secret||secret.length<32)return '';let session=verify(cookies(req).cw_session,secret);if(!session?.id){session={id:randomUUID(),exp:Math.floor(Date.now()/1000)+86400};setCookie(res,'cw_session',sign(session,secret),86400,env);}return sign({session:session.id,nonce:randomUUID(),exp:Math.floor(Date.now()/1000)+86400},secret);}
export function checkFormToken(req,token,env=process.env){const value=verify(token,env.INTAKE_SIGNING_KEY);const session=verify(cookies(req).cw_session,env.INTAKE_SIGNING_KEY);if(!value?.nonce||!session?.id||value.session!==session.id)throw new IntakeError(403,'form_expired','This form expired. Your details are preserved below. Please submit again.');return value.nonce;}
export function checkOrigin(req,{required=false,env=process.env}={}){
 const origin=req.headers.origin;const hosts=[new URL(business.url).host,env.VERCEL_URL,env.VERCEL_BRANCH_URL].filter(Boolean);
 if(!env.VERCEL)hosts.push('127.0.0.1:4174','localhost:4174');
 if(!origin&&!required)return;
 try{const u=new URL(origin);if(!hosts.includes(u.host)||(u.protocol!=='https:'&&!(u.protocol==='http:'&&!env.VERCEL&&['127.0.0.1','localhost'].includes(u.hostname))))throw Error();}catch{throw new IntakeError(403,'origin_rejected','Please send this request from the website form.');}
}
export const clientIp=(req,env=process.env)=>env.VERCEL?String(req.headers['x-vercel-forwarded-for']||'unknown').split(',')[0].trim():req.socket?.remoteAddress||'local';
export async function readBody(req,type){
 if(Number(req.headers['content-length']||0)>MAX_BODY_BYTES)throw new IntakeError(413,'body_too_large','Request exceeds the 16 KB limit.');
 const ct=String(req.headers['content-type']||'').split(';')[0].trim().toLowerCase();if(ct!==type)throw new IntakeError(415,'unsupported_media_type',`Use ${type}.`);
 let body=req.body;
 if(body===undefined){let size=0,chunks=[];for await(const chunk of req){const buf=Buffer.from(chunk);size+=buf.length;if(size>MAX_BODY_BYTES)throw new IntakeError(413,'body_too_large','Request exceeds the 16 KB limit.');chunks.push(buf);}body=Buffer.concat(chunks).toString('utf8');}
 if(Buffer.isBuffer(body))body=body.toString('utf8');
 if(typeof body==='string'){
  if(Buffer.byteLength(body)>MAX_BODY_BYTES)throw new IntakeError(413,'body_too_large','Request exceeds the 16 KB limit.');
  try{if(type==='application/json')body=JSON.parse(body);else{const params=new URLSearchParams(body);if(new Set(params.keys()).size!==[...params.keys()].length)throw Error();body=Object.fromEntries(params);}}catch{throw new IntakeError(400,'invalid_body','The request could not be read.');}
 }
 if(!body||typeof body!=='object'||Array.isArray(body)||Buffer.byteLength(JSON.stringify(body))>MAX_BODY_BYTES)throw new IntakeError(400,'invalid_body','Send a valid request body.');
 return body;
}
export function commonHeaders(res){res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');}
export function json(res,status,value){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(value));}
export function html(res,status,value){res.statusCode=status;res.setHeader('Content-Type','text/html; charset=utf-8');res.end(value);}
export function failure(error){return error instanceof IntakeError?error:new IntakeError(503,'intake_unavailable','We could not confirm your request. Please try again or call (562) 473-3136.');}
