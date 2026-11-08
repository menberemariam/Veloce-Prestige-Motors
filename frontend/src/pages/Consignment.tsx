import { useMemo, useState } from 'react';
import { cars, fmt } from '../data/cars';
import { api, type User } from '../lib/api';

const conditions = [
  { id: 'concours', label: 'Concours', desc: 'Show-grade, documented', mult: 1.05 },
  { id: 'pristine', label: 'Pristine', desc: 'Collector-grade', mult: 1.0 },
  { id: 'excellent', label: 'Excellent', desc: 'Minor wear, honest', mult: 0.92 },
];

export default function Consignment({ user, needAuth }: { user: User | null; needAuth: () => void }) {
  const [step, setStep] = useState(1);
  const [carId, setCarId] = useState(cars[0].id);
  const [mileage, setMileage] = useState(1200);
  const [cond, setCond] = useState('pristine');
  const [name, setName] = useState(''); const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false); const [done, setDone] = useState<any>(null);
  const [live, setLive] = useState<number | null>(null);

  const car = cars.find(c => c.id === carId)!;
  const valuation = useMemo(() => {
    const base = (car.min + car.max) / 2;
    const adj = mileage < 800 ? 15 : mileage > 5000 ? -15 : 0;
    return Math.round(base * conditions.find(c => c.id === cond)!.mult * (1 + adj / 100));
  }, [car, mileage, cond]);

  const fetchLive = async () => {
    try { const r = await api.estimate({ make: car.make, model: car.model, year: car.year, mileage, lng: 0, lat: 0 }); setLive(r.price ?? null); }
    catch { setLive(null); }
  };

  const submit = async () => {
    if (!user) { needAuth(); return; }
    setBusy(true); setMsg('');
    try {
      const report = await api.createReport({ make: car.make, model: car.model, year: car.year, mileage, lng: 0, lat: 0, price: valuation });
      setDone(report);
      if (user.admin) { try { await api.approveReport(report.id, true); } catch {} }
      setStep(3);
    } catch (e: any) { setMsg(e.message); } finally { setBusy(false); }
  };

  const input = "w-full bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold";
  const steps = ['Chassis Identity', 'Provenance', 'Execution'];

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <p className="text-[10px] tracking-[0.4em] text-gold uppercase text-center">Private Consignment</p>
      <h1 className="font-serif text-4xl text-center mt-3">Valuation <span className="italic text-gold">Atelier</span></h1>
      <div className="flex justify-center gap-2 mt-8">{steps.map((s, i) => <button key={s} onClick={() => setStep(i + 1)} className={`px-4 py-2 rounded-full text-xs border ${step === i + 1 ? 'border-gold text-gold' : 'border-white/15 text-muted'}`}>{i + 1}. {s}</button>)}</div>

      <div className="grid lg:grid-cols-3 gap-8 mt-10">
        <section className="lg:col-span-2 bg-surface border border-white/10 rounded-2xl p-8">
          {step === 1 && <>
            <h2 className="font-serif text-2xl mb-5">Chassis Identity</h2>
            <div className="space-y-3">
              {cars.map(c => (
                <button key={c.id} onClick={() => setCarId(c.id)} className={`w-full flex items-center gap-4 p-3 rounded-xl border text-left ${carId === c.id ? 'border-gold bg-ink' : 'border-white/10'}`}>
                  <img src={c.img} className="w-20 h-14 object-cover rounded-lg" alt="" />
                  <div className="flex-1"><p className="text-sm font-semibold">{c.year} {c.make} {c.model}</p><p className="text-xs text-muted">{fmt(c.min)} — {fmt(c.max)}</p></div>
                  <span className="text-[10px] tracking-widest uppercase text-gold border border-gold/40 px-2 py-1 rounded-full">{c.provenance[0]}</span>
                </button>
              ))}
            </div>
            <label className="block text-xs text-muted mt-6 mb-2">Odometer (miles)</label>
            <input type="number" className={input} value={mileage} onChange={e => setMileage(+e.target.value)} />
            <p className="text-xs text-muted mt-2">{mileage < 800 ? '+15% low-mileage adjustment' : mileage > 5000 ? '−15% high-mileage adjustment' : 'No mileage adjustment'}</p>
          </>}

          {step === 2 && <>
            <h2 className="font-serif text-2xl mb-5">Provenance & Condition</h2>
            <div className="space-y-3">{conditions.map(c => (
              <label key={c.id} className={`flex gap-3 p-4 rounded-xl border cursor-pointer ${cond === c.id ? 'border-gold bg-ink' : 'border-white/10'}`}>
                <input type="radio" name="cond" className="accent-yellow-400" checked={cond === c.id} onChange={() => setCond(c.id)} />
                <span><span className="text-sm font-semibold">{c.label}</span> <span className="text-xs text-muted">×{c.mult} — {c.desc}</span></span>
              </label>))}</div>
            <div className="grid md:grid-cols-2 gap-3 mt-6">
              <input className={input} placeholder="Principal name" value={name} onChange={e => setName(e.target.value)} />
              <input className={input} placeholder="Email for consultation" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <p className="text-xs text-muted mt-4">Submitting creates a valuation report in the backend ({user ? `as ${user.email}` : 'sign-in required'}). Admin accounts are auto-approved.</p>
          </>}

          {step === 3 && <>
            <h2 className="font-serif text-2xl mb-5">Execution</h2>
            {done ? <div className="bg-ink border border-gold/40 rounded-xl p-6">
              <p className="text-gold text-sm tracking-widest uppercase">Report #{done.id} Submitted</p>
              <p className="font-serif text-3xl mt-2">{fmt(done.price)}</p>
              <p className="text-xs text-muted mt-1">{done.make} {done.model} · {done.year} · {done.mileage.toLocaleString()} mi · Approved: {String(done.approved)}</p>
            </div> : <p className="text-sm text-muted">Review your valuation, then submit to enter the vault ledger.</p>}
            {msg && <p className="text-xs text-red-400 mt-3">{msg}</p>}
          </>}
          <div className="flex gap-3 mt-8">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-full border border-white/20 text-sm">Back</button>}
            {step < 3 ? <button onClick={() => setStep(step + 1)} className="flex-1 bg-gold text-black font-semibold py-3 rounded-full">Continue</button>
              : <button disabled={busy || !!done} onClick={submit} className="flex-1 bg-gold text-black font-semibold py-3 rounded-full disabled:opacity-50">{busy ? 'Submitting…' : done ? 'Submitted ✓' : 'Submit Valuation'}</button>}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-surface border border-gold/30 rounded-2xl p-6 sticky top-24">
            <p className="text-[10px] tracking-[0.3em] text-gold uppercase">Live Valuation</p>
            <p className="font-serif text-4xl text-gold mt-2">{fmt(valuation)}</p>
            <p className="text-xs text-muted mt-1">Cash outright estimate · {car.make} {car.model}</p>
            <svg viewBox="0 0 100 30" className="w-full h-16 mt-4"><polyline points="0,24 20,18 40,12 60,15 80,8 100,4" fill="none" stroke="#f2ca50" strokeWidth="1.5" /></svg>
            <button onClick={fetchLive} className="w-full mt-2 border border-white/20 py-2 rounded-full text-xs">Query Backend Estimate</button>
            {live !== null && <p className="text-xs text-muted text-center mt-2">Backend estimate: <span className="text-gold">{fmt(live)}</span></p>}
          </div>
          <div className="bg-surface border border-white/10 rounded-2xl p-6">
            <h3 className="font-serif text-lg mb-3">Why Consign</h3>
            {['Global collector network','Chassis-ledger verification','Private vault presentation','Concierge finance desk'].map(x => <p key={x} className="text-xs text-muted py-1.5 border-b border-white/5">✦ {x}</p>)}
          </div>
        </aside>
      </div>
    </main>
  );
}
