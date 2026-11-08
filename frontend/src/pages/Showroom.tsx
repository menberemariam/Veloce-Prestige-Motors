import { useMemo, useState } from 'react';
import { cars, fmt, monthly, type Car } from '../data/cars';
import { FinanceModal, Icon } from '../components/chrome';

export default function Showroom({ openCar }: { openCar: (c: Car) => void }) {
  const makes = [...new Set(cars.map(c => c.make))];
  const [sel, setSel] = useState<string[]>(makes);
  const [maxPrice, setMaxPrice] = useState(3500000);
  const [powertrains, setPowertrains] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [finance, setFinance] = useState<Car | null>(null);
  const pts = [...new Set(cars.map(c => c.powertrain))];

  const filtered = useMemo(() => cars.filter(c =>
    sel.includes(c.make) && c.price <= maxPrice && (powertrains.length === 0 || powertrains.includes(c.powertrain))
  ), [sel, maxPrice, powertrains]);

  const toggle = (v: string, list: string[], set: (x: string[]) => void) => set(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  const cb = "h-4 w-4 accent-yellow-400";

  return (
    <main className="max-w-7xl mx-auto px-6">
      <section className="py-16 text-center">
        <p className="text-[10px] tracking-[0.4em] text-gold uppercase">The Vault · Collection MMXXIV</p>
        <h1 className="font-serif text-5xl md:text-6xl mt-4">Curated Excellence.<br/><span className="italic text-gold">Uncompromising Heritage.</span></h1>
        <p className="text-muted mt-4 max-w-xl mx-auto text-sm">Six masterpiece automobiles, each verified by chassis ledger and provenance dossier.</p>
      </section>

      <div className="flex gap-10 items-start">
        <aside className="hidden lg:block w-60 shrink-0 sticky top-24 space-y-7 text-sm">
          <div><h4 className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3">Manufacturer</h4>
            {makes.map(m => <label key={m} className="flex gap-2 items-center py-1 text-muted"><input type="checkbox" className={cb} checked={sel.includes(m)} onChange={() => toggle(m, sel, setSel)} />{m}</label>)}</div>
          <div><h4 className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3">Valuation Bracket</h4>
            <input type="range" min={150000} max={3500000} step={50000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full" />
            <p className="text-xs text-muted mt-1">$150k — {maxPrice >= 3500000 ? '$3.5M+' : fmt(maxPrice)}</p></div>
          <div><h4 className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3">Powertrain</h4>
            {pts.map(p => <label key={p} className="flex gap-2 items-center py-1 text-muted"><input type="checkbox" className={cb} checked={powertrains.includes(p)} onChange={() => toggle(p, powertrains, setPowertrains)} />{p}</label>)}</div>
          <div><h4 className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3">Livery</h4>
            <div className="flex gap-2">{cars.map(c => <span key={c.id} title={c.livery} className="w-6 h-6 rounded-full border border-white/20" style={{ background: c.liveryColor }} />)}</div></div>
        </aside>

        <section className="flex-1 grid md:grid-cols-2 gap-6">
          {filtered.map(c => (
            <article key={c.id} className="bg-surface border border-white/10 rounded-2xl overflow-hidden hover:border-gold/50 transition">
              <div className="relative cursor-pointer" onClick={() => openCar(c)}>
                <img src={c.img} alt={c.model} className="w-full h-56 object-cover" />
                <span className="absolute top-4 right-4 bg-gold text-black text-sm font-bold px-3 py-1 rounded-full">{fmt(c.price)}</span>
                <div className="absolute bottom-4 left-4 flex gap-2">{c.provenance.map(p => <span key={p} className="bg-black/70 text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border border-gold/40 text-gold">{p}</span>)}</div>
              </div>
              <div className="p-5">
                <p className="text-[10px] tracking-[0.3em] text-muted uppercase">{c.year} · {c.make}</p>
                <h3 className="font-serif text-2xl mt-1 cursor-pointer hover:text-gold" onClick={() => openCar(c)}>{c.model}</h3>
                <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                  {[['Output', c.output], ['0–60', c.accel], ['Odometer', c.odo], ['Gearbox', c.gearbox]].map(([k, v]) => (
                    <div key={k} className="bg-ink rounded-lg py-2"><p className="text-[9px] tracking-widest text-muted uppercase">{k}</p><p className="text-xs font-semibold mt-0.5">{v}</p></div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-5">
                  <label className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" className={cb} checked={compare.includes(c.id)} onChange={() => toggle(c.id, compare, setCompare)} />Compare</label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">Est. <span className="text-gold font-semibold">{fmt(monthly(c.price))}/mo</span></span>
                    <button onClick={() => setFinance(c)} className="text-xs border border-gold text-gold px-3 py-1.5 rounded-full hover:bg-gold hover:text-black">Finance</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="text-muted text-sm col-span-2 text-center py-10">No masterpiece matches your filters.</p>}
        </section>
      </div>

      {compare.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-gold/40 px-6 py-4">
          <div className="max-w-7xl mx-auto flex gap-4 items-center overflow-x-auto">
            {compare.map(id => { const c = cars.find(x => x.id === id)!; return (
              <div key={id} className="flex items-center gap-3 bg-ink rounded-xl p-2 pr-4 shrink-0">
                <img src={c.img} className="w-16 h-12 object-cover rounded-lg" alt="" />
                <div><p className="text-xs font-semibold">{c.make} {c.model}</p><p className="text-gold text-sm">{fmt(c.price)} · {c.output}</p></div>
                <button onClick={() => toggle(id, compare, setCompare)} className="text-muted"><Icon name="close" /></button>
              </div>); })}
            <span className="text-xs text-muted shrink-0">{compare.length} selected for private comparison</span>
          </div>
        </div>
      )}
      {finance && <FinanceModal car={finance} close={() => setFinance(null)} />}
    </main>
  );
}
