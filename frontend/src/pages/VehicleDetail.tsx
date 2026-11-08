import { useState } from 'react';
import { fmt, monthly, type Car } from '../data/cars';

export default function VehicleDetail({ car, book }: { car: Car; book: () => void }) {
  const [img, setImg] = useState(car.img);
  const [down, setDown] = useState(20); const [months, setMonths] = useState(60);
  const specs: [string, string][] = [['Output', car.output], ['0–60 MPH', car.accel], ['Fiorano Lap', '1:17.30'], ['Odometer', car.odo], ['Gearbox', car.gearbox], ['Powertrain', car.powertrain], ['Livery', car.livery], ['Provenance', car.provenance.join(' · ')]];
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <button onClick={() => history.back()} className="text-xs text-muted hover:text-gold mb-6">← Back to Showroom</button>
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <img src={img} alt={car.model} className="w-full h-[420px] object-cover rounded-2xl border border-white/10" />
          <div className="flex gap-3 mt-3">{car.gallery.map(g => <img key={g} src={g} onClick={() => setImg(g)} className={`w-24 h-16 object-cover rounded-lg cursor-pointer border-2 ${img===g?'border-gold':'border-transparent opacity-60'}`} alt="" />)}</div>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase">Chassis Ledger #{car.id.toUpperCase()}-XX-014</p>
          <h1 className="font-serif text-4xl mt-2">{car.year} {car.make} {car.model}</h1>
          <p className="font-serif text-3xl text-gold mt-3">{fmt(car.price)}</p>
          <div className="flex gap-3 mt-5">
            <span className="bg-surface border border-white/10 rounded-xl px-4 py-2 text-sm">{car.output}</span>
            <span className="bg-surface border border-white/10 rounded-xl px-4 py-2 text-sm">{car.accel} 0–60</span>
            <span className="bg-surface border border-white/10 rounded-xl px-4 py-2 text-sm">Fiorano 1:17.30</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-8">
            {specs.map(([k, v]) => <div key={k} className="bg-surface border border-white/10 rounded-xl p-4"><p className="text-[9px] tracking-[0.25em] text-muted uppercase">{k}</p><p className="font-serif text-lg mt-1">{v}</p></div>)}
          </div>
          <div className="bg-surface border border-gold/30 rounded-2xl p-6 mt-8">
            <h3 className="font-serif text-xl">Financing Desk</h3>
            <label className="block text-xs text-muted mt-4 mb-2">Down payment — {down}%</label>
            <input type="range" min={0} max={80} value={down} onChange={e => setDown(+e.target.value)} className="w-full" />
            <div className="flex gap-2 mt-3">{[36,48,60].map(m => <button key={m} onClick={() => setMonths(m)} className={`flex-1 py-2 rounded-lg text-sm border ${months===m?'border-gold text-gold':'border-white/15 text-muted'}`}>{m} mo · 5.4% APR</button>)}</div>
            <p className="mt-4 text-sm">Estimated <span className="font-serif text-2xl text-gold">{fmt(monthly(car.price, down, months))}/mo</span></p>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={book} className="flex-1 bg-gold text-black font-semibold py-3 rounded-full">Reserve Test Drive</button>
            <button className="flex-1 border border-white/20 py-3 rounded-full text-sm">Concierge Enquiry</button>
          </div>
        </div>
      </div>
      <section className="mt-14 bg-surface border border-white/10 rounded-2xl p-8">
        <h2 className="font-serif text-2xl mb-6">Provenance Timeline</h2>
        <div className="grid md:grid-cols-4 gap-6 text-sm">
          {[['Factory Order','Commissioned direct from Maranello with Tailor Made specification.'],['Delivery','Delivered to first keeper; full Ferrari service history.'],['Certification','Fiorano Certified — chassis ledger verified, mileage confirmed.'],['Veloce Vault','Acquired into the Veloce vault after private collection review.']].map(([t,d],i)=>(
            <div key={t}><p className="text-gold font-serif text-lg">{String(i+1).padStart(2,'0')}</p><h4 className="font-semibold mt-1">{t}</h4><p className="text-muted mt-1 text-xs leading-relaxed">{d}</p></div>))}
        </div>
      </section>
    </main>
  );
}
