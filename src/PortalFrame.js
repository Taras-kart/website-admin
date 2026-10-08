import React,{useEffect,useRef,useState} from 'react'
import {Link,NavLink,useLocation} from 'react-router-dom'
import {useAuth} from './pages/AdminAuth'
import {apiGet} from './pages/api'
import './PortalFrame.css'
const common=[['Overview','/'],['Stock','/stocks'],['Add product','/products'],['Excel & images','/import'],['Sales','/sales'],['Counter sale','/pos'],['Movements','/transactions']]
const management=[['Branches','/branches'],['Admins','/branch-admins'],['Categories','/categories'],['Customers','/customers'],['Homepage','/homepage-images'],['Order issues','/order-issues'],['B2B orders','/b2b-orders'],['B2B stock','/b2b-stock'],['Shipping','/shipping'],['Rewards','/coin-settings'],['Activity','/audit']]
class PageBoundary extends React.Component{
 state={failed:false}
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<section className="tadm-failure" role="alert"><h1>This page could not load</h1><p>Try opening it again. Your saved records have not changed.</p><button onClick={()=>window.location.reload()}>Reload page</button><Link to="/">Back to overview</Link></section>:this.props.children}
}
export default function PortalFrame({children}){
 const {user,token,setBranch,logout}=useAuth(),location=useLocation(),[branches,setBranches]=useState([]),[branchError,setBranchError]=useState(''),[open,setOpen]=useState(false),menu=useRef(null),trigger=useRef(null)
 const isLogin=location.pathname==='/login',superAdmin=user?.role==='SUPER_ADMIN',visible=Boolean(token&&user&&!isLogin)
 useEffect(()=>{if(!visible)return;const controller=new AbortController();apiGet('/manage/branches',{}, {signal:controller.signal}).then(data=>{if(!controller.signal.aborted){setBranches(Array.isArray(data)?data:[]);setBranchError('')}}).catch(e=>{if(!controller.signal.aborted)setBranchError(e.message)});return()=>controller.abort()},[visible])
 useEffect(()=>setOpen(false),[location.pathname])
 useEffect(()=>{if(!open)return;const old=document.body.style.overflow,button=trigger.current;document.body.style.overflow='hidden';menu.current?.querySelector('a')?.focus();const key=e=>{if(e.key==='Escape')setOpen(false);if(e.key==='Tab'){const nodes=[...menu.current.querySelectorAll('a,button')],first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}};document.addEventListener('keydown',key);return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',key);button?.focus()}},[open])
 const links=superAdmin?[...common,...management,['Account','/settings']]:[...common,['Account','/settings']]
 const group=(title,items)=><section className="tadm-nav-group"><p>{title}</p>{items.map(([label,url])=><NavLink key={url} end={url==='/'} to={url} className={({isActive})=>`tadm-nav-link${isActive?' tadm-nav-current':''}`}><span className="tadm-nav-marker" aria-hidden="true"/>{label}</NavLink>)}</section>
 return <div className={`tadm-app ${visible?'tadm-signed':'tadm-guest'}`}>
 {visible&&<><header className="tadm-topbar"><Link className="tadm-brand" to="/">ATTACH<span>{superAdmin?'Super admin':'Branch admin'}</span></Link><div className="tadm-context"><label className="tadm-branch"><span>Branch</span>{superAdmin?<select aria-label="Select branch" value={user.branch_id||''} onChange={e=>setBranch(e.target.value)}><option value="">All branches</option>{branches.map(row=><option key={row.id} value={row.id}>{row.name}{row.is_active?'':' (inactive)'}</option>)}</select>:<strong>{branches.find(row=>Number(row.id)===Number(user.branch_id))?.name||`Branch ${user.branch_id}`}</strong>}</label><span className="tadm-username">{user.username}</span><button className="tadm-signout" onClick={logout}>Sign out</button></div><button ref={trigger} className="tadm-menu" aria-expanded={open} aria-controls="tadm-navigation" onClick={()=>setOpen(v=>!v)}>Menu</button></header>{open&&<button className="tadm-backdrop" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}<nav ref={menu} id="tadm-navigation" className={`tadm-sidebar${open?' tadm-sidebar-open':''}`} aria-label="Portal navigation"><div className="tadm-drawer-heading"><strong>Navigation</strong><button onClick={()=>setOpen(false)} aria-label="Close navigation">Close</button></div>{group('Workspace',common)}{superAdmin&&group('Management',management)}{group('Settings',[['Account','/settings']])}</nav></>}
 <div className={visible?'tadm-content':'tadm-login-content'} data-page={links.find(([,url])=>url===location.pathname)?.[0]||location.pathname}>{visible&&branchError&&<p className="tadm-branch-error" role="alert">Branch list: {branchError}</p>}<PageBoundary key={location.pathname}>{children}</PageBoundary></div>
 </div>
}
