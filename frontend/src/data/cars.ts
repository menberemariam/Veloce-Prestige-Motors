export type Car = {
  id: string; year: number; make: string; model: string; price: number;
  img: string; gallery: string[]; output: string; accel: string; odo: string; gearbox: string;
  powertrain: string; livery: string; liveryColor: string; provenance: string[]; min: number; max: number;
};
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
export const cars: Car[] = [
  { id:'sf90', year:2024, make:'Ferrari', model:'SF90 XX Stradale', price:890000, img:u('photo-1592198084033-aade902d1aae'),
    gallery:[u('photo-1592198084033-aade902d1aae'),u('photo-1583121274602-3e2820c69888'),u('photo-1503376780353-7e6692767b70'),u('photo-1552519507-da3b142c6e3d'),u('photo-1544636331-e26879cd4d9b')],
    output:'986 HP', accel:'2.3 s', odo:'412 mi', gearbox:'8-Spd DCT', powertrain:'Hybrid V8', livery:'Rosso Corsa', liveryColor:'#c1121f', provenance:['Fiorano Certified','1 Owner'], min:820000, max:960000 },
  { id:'gt3rs', year:2023, make:'Porsche', model:'911 GT3 RS', price:425000, img:u('photo-1503376780353-7e6692767b70'),
    gallery:[u('photo-1503376780353-7e6692767b70'),u('photo-1583121274602-3e2820c69888')], output:'518 HP', accel:'3.0 s', odo:'1,240 mi', gearbox:'7-Spd PDK', powertrain:'Flat-6 NA', livery:'Shark Blue', liveryColor:'#2563eb', provenance:['Weissach Pkg'], min:390000, max:460000 },
  { id:'750s', year:2024, make:'McLaren', model:'750S Spider', price:385000, img:u('photo-1552519507-da3b142c6e3d'),
    gallery:[u('photo-1552519507-da3b142c6e3d'),u('photo-1544636331-e26879cd4d9b')], output:'740 HP', accel:'2.8 s', odo:'890 mi', gearbox:'7-Spd SSG', powertrain:'Twin-Turbo V8', livery:'Papaya Spark', liveryColor:'#f97316', provenance:['MSO Commission'], min:350000, max:420000 },
  { id:'spectre', year:2023, make:'Rolls-Royce', model:'Spectre', price:560000, img:u('photo-1618843479313-40f8afb4b4d8'),
    gallery:[u('photo-1618843479313-40f8afb4b4d8'),u('photo-1563720223185-11003d516935')], output:'584 HP', accel:'4.4 s', odo:'2,100 mi', gearbox:'Single-Speed', powertrain:'Dual-Motor EV', livery:'Black Badge', liveryColor:'#111827', provenance:['Coachline'], min:510000, max:610000 },
  { id:'dbs', year:2022, make:'Aston Martin', model:'DBS 770 Ultimate', price:440000, img:u('photo-1563720223185-11003d516935'),
    gallery:[u('photo-1563720223185-11003d516935'),u('photo-1605559424843-9e4c228bf1c2')], output:'770 HP', accel:'3.2 s', odo:'3,450 mi', gearbox:'8-Spd ZF', powertrain:'Twin-Turbo V12', livery:'Xenon Grey', liveryColor:'#6b7280', provenance:['Q Commission'], min:400000, max:480000 },
  { id:'revuelto', year:2024, make:'Lamborghini', model:'Revuelto', price:695000, img:u('photo-1544636331-e26879cd4d9b'),
    gallery:[u('photo-1544636331-e26879cd4d9b'),u('photo-1626668893632-6f3d4466d22f')], output:'1,001 HP', accel:'2.5 s', odo:'310 mi', gearbox:'8-Spd DCT', powertrain:'Hybrid V12', livery:'Giallo Inti', liveryColor:'#eab308', provenance:['Ad Personam'], min:640000, max:760000 },
];
export const fmt = (n:number) => '$' + n.toLocaleString('en-US');
export const monthly = (price:number, downPct=20, months=60, apr=5.4) => {
  const principal = price * (1 - downPct/100);
  const r = apr/100/12; const m = principal * r / (1 - Math.pow(1+r, -months));
  return Math.round(m);
};
