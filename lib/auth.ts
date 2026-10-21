import { cookies } from 'next/headers';import {createHmac,timingSafeEqual} from 'crypto';
const name='region_admin';
function signature(payload:string){return createHmac('sha256',process.env.ADMIN_SESSION_SECRET||'').update(payload).digest('hex')}
export function token(){const payload=String(Date.now()+7*86400000);return `${payload}.${signature(payload)}`}
export async function authorized(){if(!process.env.ADMIN_PASSWORD||!process.env.ADMIN_SESSION_SECRET)return false;const val=(await cookies()).get(name)?.value||'';const [payload,sig]=val.split('.');if(!payload||!sig||!/^\d+$/.test(payload)||Number(payload)<Date.now())return false;const a=Buffer.from(sig,'utf8'),b=Buffer.from(signature(payload),'utf8');return a.length===b.length&&timingSafeEqual(a,b)}
export const cookieName=name;
