import { useState } from 'react';
import { api, type User } from '../lib/api';
import { fmt, monthly, type Car } from '../data/cars';

export type Page = 'showroom' | 'detail' | 'consignment' | 'booking';

export function Header({ page, go, user, onAuth }: { page: Page; go: (p: Page, car?: Car) => void; user: User | null; onAuth: () => void }) {
  const [open, setOpen] = useState(false);
  const link = (p: Page, label: string) => (
    <button key={p} onClick={() => go(p)} className={`text-xs tracking-[0.2em] uppercase ${page===p ? 'text-gold' : 'text-muted hover:text-white'}`}>{label}</button>
  );
  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => go('showroom')} className="font-serif text-xl text-white">Veloce <span className="text-gold italic">Prestige</span> Motors</button>
        <nav className="hidden md:flex gap-8">{link('showroom','Showroom')}{link('consignment','Consignment')}{link('booking','Test Drive')}</nav>
        <div className="flex items-center gap-3">
          {user ? <>
            <span className="text-xs text-muted hidden sm:block">{user.email}{user.admin ? ' · Admin' : ''}</span>
            <button className="text-xs border border-white/20 px-3 py-1.5 rounded-full hover:border-gold" onClick={async()=>{await api.signout(); onAuth();}}>Sign out</button>
          </> : <button className="text-xs bg-gold text-black font-semibold px-4 py-2 rounded-full" onClick={()=>setOpen(true)}>Client Sign-In</button>}
        </div>
      </div>
      {open && <AuthModal close={()=>setOpen(false)} done={()=>{setOpen(false); onAuth();}} />}
    </header>
  );
}

export function Footer() {
  return <footer className="border-t border-white/10 mt-20 py-10 text-center text-xs text-muted tracking-widest uppercase">Veloce Prestige Motors · Curated Excellence · Est. MMXXIV</footer>;
}

export function AuthModal({ close, done }: { close: () => void; done: () => void }) {
  const [mode, setMode] = useState<'signin'|'signup'>('signup');
  const [email, setEmail] = useState('collector@veloce.com'); const [password, setPassword] = useState('password123');
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async () => { setBusy(true); setMsg(''); try { await (mode==='signup' ? api.signup(email,password) : api.signin(email,password)); done(); } catch(e:any){ setMsg(e.message); } finally{ setBusy(false);} };
  const input = "w-full bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold";
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={close}>
      <div className="bg-surface border border-white/10 rounded-2xl p-8 w-full max-w-sm" onClick={e=>e.stopPropagation()}>
        <h3 className="font-serif text-2xl mb-1">Client Access</h3><p className="text-xs text-muted mb-5">Sign in to consign, book, and approve valuations.</p>
        <div className="space-y-3">
          <input className={input} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input className={input} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
          {msg && <p className="text-xs text-red-400">{msg}</p>}
          <button disabled={busy} onClick={submit} className="w-full bg-gold text-black font-semibold py-2.5 rounded-full disabled:opacity-50">{busy?'Please wait…':(mode==='signup'?'Create Account':'Sign In')}</button>
          <button className="w-full text-xs text-muted" onClick={()=>setMode(mode==='signup'?'signin':'signup')}>{mode==='signup'?'Already a client? Sign in':'New client? Create account'}</button>
        </div>
      </div>
    </div>
  );
}

export function FinanceModal({ car, close }: { car: Car; close: () => void }) {
  const [down, setDown] = useState(20); const [months, setMonths] = useState(60);
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={close}>
      <div className="bg-surface border border-white/10 rounded-2xl p-8 w-full max-w-md" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-start"><div><p className="text-[10px] tracking-[0.3em] text-gold uppercase">Financing Desk</p><h3 className="font-serif text-2xl mt-1">{car.year} {car.make} {car.model}</h3></div><button onClick={close} className="text-muted"><span className="material-symbols-outlined">close</span></button></div>
        <p className="text-sm text-muted mt-2">Price {fmt(car.price)} · 5.4% APR</p>
        <label className="block text-xs mt-6 mb-2">Down payment — {down}% ({fmt(car.price*down/100)})</label>
        <input type="range" min={0} max={80} value={down} onChange={e=>setDown(+e.target.value)} className="w-full" />
        <div className="flex gap-2 mt-4">{[36,48,60].map(m=><button key={m} onClick={()=>setMonths(m)} className={`flex-1 py-2 rounded-lg text-sm border ${months===m?'border-gold text-gold':'border-white/15 text-muted'}`}>{m} mo</button>)}</div>
        <div className="mt-6 bg-ink rounded-xl p-5 text-center"><p className="text-[10px] tracking-[0.3em] text-muted uppercase">Estimated Monthly</p><p className="font-serif text-4xl text-gold mt-1">{fmt(monthly(car.price, down, months))}<span className="text-sm text-muted">/mo</span></p></div>
        <button className="w-full mt-5 bg-gold text-black font-semibold py-3 rounded-full">Request Concierge Approval</button>
      </div>
    </div>
  );
}

export function Icon({ name, className='text-lg' }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}
