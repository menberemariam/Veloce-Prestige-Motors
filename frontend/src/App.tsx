import { useCallback, useEffect, useState } from 'react';
import { Footer, Header, type Page } from './components/chrome';
import Showroom from './pages/Showroom';
import VehicleDetail from './pages/VehicleDetail';
import Consignment from './pages/Consignment';
import Booking from './pages/Booking';
import { api, type User } from './lib/api';
import type { Car } from './data/cars';

export default function App() {
  const [page, setPage] = useState<Page>('showroom');
  const [car, setCar] = useState<Car | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authTick, setAuthTick] = useState(0);

  const refreshUser = useCallback(async () => {
    try { setUser(await api.whoami()); } catch { setUser(null); }
  }, []);
  useEffect(() => { refreshUser(); }, [refreshUser, authTick]);

  const go = (p: Page, c?: Car) => {
    if (p === 'detail' && c) setCar(c);
    setPage(p); window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-ink text-white">
      <Header page={page} go={go} user={user} onAuth={() => setAuthTick(t => t + 1)} />
      {page === 'showroom' && <Showroom openCar={c => go('detail', c)} />}
      {page === 'detail' && car && <VehicleDetail car={car} book={() => go('booking')} />}
      {page === 'consignment' && <Consignment user={user} needAuth={() => setAuthTick(t => t + 1)} />}
      {page === 'booking' && <Booking preset={car?.id} />}
      <Footer />
    </div>
  );
}
