import { useState } from 'react';
import { cars, fmt } from '../data/cars';

const slots = ['09:00', '11:30', '14:00', '16:30'];
const days = ['Thu 12', 'Fri 13', 'Sat 14', 'Mon 16'];

export default function Booking({ preset }: { preset?: string }) {
  const [step, setStep] = useState(1);
  const [carId, setCarId] = useState(preset || cars[0].id);
  const [day, setDay] = useState(days[1]); const [slot, setSlot] = useState(slots[1]);
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [license, setLicense] = useState('');
  const [vault, setVault] = useState(false); const [confirmed, setConfirmed] = useState(false);
  const car = cars.find(c => c.id === carId)!;
  const steps = ['Allocated Masterpiece', 'Experience Protocol', 'Temporal Allocation', 'Principal Dossier'];
  const input = "w-full bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold";

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <p className="text-[10px] tracking-[0.4em] text-gold uppercase text-center">Private Experience</p>
      <h1 className="font-serif text-4xl text-center mt-3">Reserve Your <span className="italic text-gold">Test Drive</span></h1>
      <div className="flex flex-wrap justify-center gap-2 mt-8">{steps.map((s, i) => <button key={s} onClick={() => setStep(i + 1)} className={`px-4 py-2 rounded-full text-xs border ${step === i + 1 ? 'border-gold text-gold' : 'border-white/15 text-muted'}`}>{i + 1}. {s}</button>)}</div>

      <div className="grid lg:grid-cols-3 gap-8 mt-10">
        <section className="lg:col-span-2 bg-surface border border-white/10 rounded-2xl p-8">
          {step === 1 && <>
            <h2 className="font-serif text-2xl mb-4">Allocated Masterpiece</h2>
            <img src={car.img} className="w-full h-64 object-cover rounded-xl" alt="" />
            <div className="flex justify-between items-center mt-4"><div><p className="font-serif text-xl">{car.year} {car.make} {car.model}</p><p className="text-gold">{fmt(car.price)}</p></div>
            <button onClick={() => setVault(true)} className="border border-gold text-gold px-4 py-2 rounded-full text-xs">Open Vault</button></div>
          </>}
          {step === 2 && <>
            <h2 className="font-serif text-2xl mb-4">Experience Protocol</h2>
            {['Private circuit orientation with Veloce pilot','Escorted road route — 40 minutes','Concierge debrief & valuation dossier'].map(x => <p key={x} className="text-sm text-muted py-2 border-b border-white/5">✦ {x}</p>)}
            <p className="text-xs text-muted mt-4">Valid driver's licence and insurance verification required on arrival.</p>
          </>}
          {step === 3 && <>
            <h2 className="font-serif text-2xl mb-4">Temporal Allocation</h2>
            <p className="text-[10px] tracking-[0.3em] text-muted uppercase mb-2">Day</p>
            <div className="flex gap-2 flex-wrap">{days.map(d => <button key={d} onClick={() => setDay(d)} className={`px-4 py-2 rounded-full text-sm border ${day === d ? 'border-gold text-gold' : 'border-white/15 text-muted'}`}>{d}</button>)}</div>
            <p className="text-[10px] tracking-[0.3em] text-muted uppercase mt-6 mb-2">Time</p>
            <div className="flex gap-2 flex-wrap">{slots.map(s => <button key={s} onClick={() => setSlot(s)} className={`px-4 py-2 rounded-full text-sm border ${slot === s ? 'border-gold text-gold' : 'border-white/15 text-muted'}`}>{s}</button>)}</div>
          </>}
          {step === 4 && <>
            <h2 className="font-serif text-2xl mb-4">Principal Dossier</h2>
            {confirmed ? <div className="bg-ink border border-gold/40 rounded-xl p-6 text-center"><p className="font-serif text-2xl text-gold">Appointment Confirmed</p><p className="text-sm text-muted mt-2">{car.make} {car.model} · {day} · {slot}</p></div>
            : <div className="space-y-3">
                <input className={input} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
                <input className={input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input className={input} placeholder="Driving licence number" value={license} onChange={e => setLicense(e.target.value)} />
              </div>}
          </>}
          <div className="flex gap-3 mt-8">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-full border border-white/20 text-sm">Back</button>}
            {step < 4 ? <button onClick={() => setStep(step + 1)} className="flex-1 bg-gold text-black font-semibold py-3 rounded-full">Continue</button>
              : <button disabled={confirmed} onClick={() => setConfirmed(true)} className="flex-1 bg-gold text-black font-semibold py-3 rounded-full disabled:opacity-50">{confirmed ? 'Confirmed ✓' : 'Confirm Appointment'}</button>}
          </div>
        </section>

        <aside className="bg-surface border border-gold/30 rounded-2xl p-6 h-fit sticky top-24">
          <p className="text-[10px] tracking-[0.3em] text-gold uppercase">Appointment Dossier</p>
          <img src={car.img} className="w-full h-40 object-cover rounded-xl mt-4" alt="" />
          <p className="font-serif text-xl mt-4">{car.make} {car.model}</p>
          <div className="text-sm text-muted space-y-2 mt-3">
            <p>Day — <span className="text-white">{day}</span></p><p>Time — <span className="text-white">{slot}</span></p>
            <p>Price — <span className="text-gold">{fmt(car.price)}</span></p>
            <p>Output — <span className="text-white">{car.output}</span></p>
          </div>
        </aside>
      </div>

      {vault && <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setVault(false)}>
        <div className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between"><h3 className="font-serif text-2xl">The Vault</h3><button onClick={() => setVault(false)} className="text-muted">✕</button></div>
          <div className="grid grid-cols-3 gap-4 mt-5">{cars.slice(0, 3).map(c => (
            <button key={c.id} onClick={() => { setCarId(c.id); setVault(false); }} className="text-left"><img src={c.img} className="w-full h-28 object-cover rounded-xl" alt="" /><p className="text-xs font-semibold mt-2">{c.make} {c.model}</p><p className="text-gold text-xs">{fmt(c.price)}</p></button>))}
          </div>
        </div>
      </div>}
    </main>
  );
}
