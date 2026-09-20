// Reads last night's waste log from the public Firebase Realtime Database
// and emails a formatted report via Resend. Run nightly by
// .github/workflows/nightly-waste-report.yml
//
// This ITEMS list must remain 1:1 with the list in index.html!
const ITEMS = [
  {id:'beer1',name:'Blue Moon',cat:'Beer',unit:'Can'},
  {id:'beer2',name:'Bud Light',cat:'Beer',unit:'Can'},
  {id:'beer3',name:'Coors Light',cat:'Beer',unit:'Can'},
  {id:'beer4',name:'Guinness',cat:'Beer',unit:'Can'},
  {id:'beer5',name:'Heineken',cat:'Beer',unit:'Can'},
  {id:'beer6',name:'Michelob Ultra',cat:'Beer',unit:'Can'},
  {id:'beer7',name:'Miller Lite',cat:'Beer',unit:'Can'},
  {id:'beer8',name:'Truly Spiked Wildberry',cat:'Beer',unit:'Can'},
  {id:'wine1',name:'Dark Horse Pinot Grigio 375ml',cat:'Wine',unit:'Can'},
  {id:'wine2',name:'Dark Horse Pinot Noir 375ml',cat:'Wine',unit:'Can'},
  {id:'wine3',name:'Dark Horse Rosé 375ml',cat:'Wine',unit:'Can'},
  {id:'wine4',name:'Dark Horse Sauv Blanc 375ml',cat:'Wine',unit:'Can'},
  {id:'soda1',name:'Soda BIB 3gal',cat:'Fountain Soda',unit:'3 Gal'},
  {id:'soda2',name:'Soda BIB 5gal',cat:'Fountain Soda',unit:'5 Gal'},
  {id:'sodapk1',name:'Kids 14oz Paper Cup',cat:'Fountain Soda',unit:'Each'},
  {id:'sodapk2',name:'Junior 20oz Paper Cup',cat:'Fountain Soda',unit:'Each'},
  {id:'sodapk3',name:'Medium 32oz Paper Cup',cat:'Fountain Soda',unit:'Each'},
  {id:'sodapk4',name:'Large 44oz Paper Cup',cat:'Fountain Soda',unit:'Each'},
  {id:'pop1',name:'Caramel Corn bag',cat:'Popcorn',unit:'Each'},
  {id:'pop2',name:'Coconut oil',cat:'Popcorn',unit:'35 LB'},
  {id:'pop3',name:'Butter flavored salt',cat:'Popcorn',unit:'35 oz'},
  {id:'pop4',name:'Kettle corn seasoning 0.9oz',cat:'Popcorn',unit:'Each'},
  {id:'pop5',name:'Nacho cheddar seasoning 0.9oz',cat:'Popcorn',unit:'Each'},
  {id:'pop6',name:'Ranch seasoning 0.9oz',cat:'Popcorn',unit:'Each'},
  {id:'pop7',name:'White cheddar seasoning 0.9oz',cat:'Popcorn',unit:'Each'},
  {id:'pop8',name:'Popcorn seed',cat:'Popcorn',unit:'35 LB'},
  {id:'pop9',name:'Buttery topping',cat:'Popcorn',unit:'35 LB'},
  {id:'poppk1',name:'Junior 64oz Popcorn Bag',cat:'Popcorn Pkg',unit:'Bag'},
  {id:'poppk2',name:'Kids tray',cat:'Popcorn Pkg',unit:'Tray'},
  {id:'poppk3',name:'Large 170oz Popcorn Tub',cat:'Popcorn Pkg',unit:'Tub'},
  {id:'poppk4',name:'Tuesday 44oz Popcorn Tub',cat:'Popcorn Pkg',unit:'Each'},
  {id:'poppk5',name:'Medium 85oz Popcorn Tub',cat:'Popcorn Pkg',unit:'Tub'},
  {id:'poppk6',name:'Plastic Refillable 170oz Popcorn Tub',cat:'Popcorn Pkg',unit:'Each'},
  {id:'can1',name:'Airhead Extreme Bites',cat:'Candy',unit:'Each'},
  {id:'can2',name:'Airheads Soft Bites',cat:'Candy',unit:'Each'},
  {id:'can3',name:'Buncha Crunch',cat:'Candy',unit:'Each'},
  {id:'can4',name:'Chewy SweeTarts Mini',cat:'Candy',unit:'Each'},
  {id:'can5',name:'Cookie Dough Bites',cat:'Candy',unit:'Each'},
  {id:'can6',name:'Cookie Dough Bites LTO',cat:'Candy',unit:'Each'},
  {id:'can7',name:'Dots',cat:'Candy',unit:'Each'},
  {id:'can8',name:'Gummies Skittles',cat:'Candy',unit:'Each'},
  {id:'can9',name:'Haribo Gummi Bears',cat:'Candy',unit:'Each'},
  {id:'can10',name:'Juicefuls',cat:'Candy',unit:'Each'},
  {id:'can11',name:'Junior Mints',cat:'Candy',unit:'Each'},
  {id:'can12',name:'Lifesaver Gummies',cat:'Candy',unit:'Each'},
  {id:'can13',name:'M&M Peanut',cat:'Candy',unit:'Each'},
  {id:'can14',name:'M&M Plain',cat:'Candy',unit:'Each'},
  {id:'can15',name:'Milk Duds',cat:'Candy',unit:'Each'},
  {id:'can16',name:'Nerd Gummi Cluster',cat:'Candy',unit:'Each'},
  {id:'can17',name:'Nerd Gummi Very Berry Cluster',cat:'Candy',unit:'Each'},
  {id:'can18',name:'Reeses Peanut Butter Cups',cat:'Candy',unit:'Each'},
  {id:'can19',name:'Reeses Animal Dipped',cat:'Candy',unit:'Each'},
  {id:'can20',name:'Reeses Pieces',cat:'Candy',unit:'Each'},
  {id:'can21',name:'Skittles',cat:'Candy',unit:'Each'},
  {id:'can22',name:'Skittles Sour',cat:'Candy',unit:'Each'},
  {id:'can23',name:'Sour Jacks 5oz',cat:'Candy',unit:'Each'},
  {id:'can24',name:'Sour Patch Kids',cat:'Candy',unit:'Each'},
  {id:'can25',name:'SunMaid Chocolate Raisins',cat:'Candy',unit:'Each'},
  {id:'can26',name:'SweeTart Ropes',cat:'Candy',unit:'Each'},
  {id:'can27',name:'Trolli Sour Crawlers',cat:'Candy',unit:'Each'},
  {id:'can28',name:'Tuxedo Almonds',cat:'Candy',unit:'Each'},
  {id:'can29',name:'Twizzlers',cat:'Candy',unit:'Each'},
  {id:'can30',name:'Cotton candy/sugar',cat:'Candy',unit:'Case'},
  {id:'can31',name:'Oreos Mini',cat:'Candy',unit:'Each'},
  {id:'can32',name:'Welchs Fruit Bag 0.9oz',cat:'Candy',unit:'Each'},
  {id:'can33',name:'Welchs Fruit Peg 5oz',cat:'Candy',unit:'Each'},
  {id:'can34',name:'M&M Peanut Butter',cat:'Candy',unit:'Each'},
  {id:'icee1',name:'ICEE/FCB syrup (all flavors)',cat:'ICEE',unit:'3 Gal'},
  {id:'iceepk1',name:'ICEE 24oz Paper Cup',cat:'ICEE',unit:'Each'},
  {id:'iceepk2',name:'ICEE 32oz Paper Cup',cat:'ICEE',unit:'Each'},
  {id:'ff1',name:'Brownie Bites',cat:'Food',unit:'Each'},
  {id:'ff2',name:'Doritos',cat:'Food',unit:'Each'},
  {id:'ff3',name:'Flamin Hot Cheetos',cat:'Food',unit:'Each'},
  {id:'ff4',name:'Flamin Hot Doritos',cat:'Food',unit:'Each'},
  {id:'ff5',name:'Hot Fries',cat:'Food',unit:'Each'},
  {id:'ff6',name:'Regular Cheetos',cat:'Food',unit:'Each'},
  {id:'ff7',name:'Dinamita Rolled Chips',cat:'Food',unit:'Each'},
  {id:'ff8',name:'BBQ Potato chips',cat:'Food',unit:'Each'},
  {id:'ff9',name:'Limon Potato chips',cat:'Food',unit:'Each'},
  {id:'ff10',name:'Regular Potato chips',cat:'Food',unit:'Each'},
  {id:'ff11',name:'Churro Bites',cat:'Food',unit:'Each'},
  {id:'ff12',name:'Icing cup 2oz',cat:'Food',unit:'Each'},
  {id:'hd1',name:'Hot dog bun',cat:'Hot Dogs',unit:'Each'},
  {id:'hd2',name:'Hot dog 1/4lb',cat:'Hot Dogs',unit:'Each'},
  {id:'hd3',name:'Hot dog regular',cat:'Hot Dogs',unit:'Each'},
  {id:'nacho1',name:'Tortilla chips',cat:'Nachos',unit:'Each'},
  {id:'nacho2',name:'Nacho cheese sauce',cat:'Nachos',unit:'140 oz'},
  {id:'nacho3',name:'Jalapeno peppers gallon',cat:'Nachos',unit:'Gallon'},
  {id:'nacho4',name:'Plastic 4oz Nacho tray',cat:'Nachos',unit:'Tray'},
  {id:'pret1',name:'Pretzel Bites',cat:'Pretzels',unit:'Each'},
  {id:'pret2',name:'Butter Pretzel',cat:'Pretzels',unit:'Each'},
  {id:'ic1',name:'Haagen-Dazs Almond Crunch bar',cat:'Ice Cream',unit:'Each'},
  {id:'ic2',name:'Ice Cream Dibs',cat:'Ice Cream',unit:'Each'},
  {id:'ic3',name:'Tollhouse Cookie Ice Cream Sandwich',cat:'Ice Cream',unit:'Each'},
  {id:'ic4',name:'Dippin Dots prepack',cat:'Ice Cream',unit:'Each'},
  {id:'nc1',name:'Pure Leaf Tea',cat:'Drinks',unit:'Bottle'},
  {id:'nc2',name:'Celsius (all varieties)',cat:'Drinks',unit:'Can'},
  {id:'nc3',name:'Rockstar (all varieties)',cat:'Drinks',unit:'Can'},
  {id:'w1',name:'Aquafina 20oz',cat:'Drinks',unit:'Bottle'},
  {id:'w2',name:'Aquafina Liter',cat:'Drinks',unit:'Bottle'},
  {id:'w3',name:'LifeWtr',cat:'Drinks',unit:'Bottle'},
  {id:'w4',name:'Bubly',cat:'Drinks',unit:'Can'},
  {id:'w5',name:'Poppi',cat:'Drinks',unit:'Can'},
  {id:'g1',name:'Gatorade',cat:'Drinks',unit:'Bottle'},
  {id:'coffee1',name:'K-Cup coffee',cat:'Coffee',unit:'Each'},
  {id:'coffee2',name:'K-Cup coffee decaf',cat:'Coffee',unit:'Each'},
  {id:'coffpk1',name:'Cup 12oz hot',cat:'Coffee',unit:'Each'},
];

const DB_URL = 'https://coral-ridge-cinema-waste-default-rtdb.firebaseio.com';
const TIME_ZONE = 'America/Chicago';

function pad(n) {
  return String(n).padStart(2, '0');
}

function chicagoNowParts() {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map(p => [p.type, p.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: parts.hour === '24' ? 0 : Number(parts.hour),
  };
}

function ymdToDbKey(year, month, day) {
  return `waste_${year}_${pad(month)}_${pad(day)}`;
}

function ymdToPrettyDate(year, month, day) {
  const d = new Date(Date.UTC(year, month - 1, day, 12));
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function resolveReportDate(override) {
  if (override) {
    const [y, m, d] = override.split('-').map(Number);
    return { year: y, month: m, day: d };
  }
  
  //This script runs right after local midnight, which is when the day that
  //just ended stops accepting new entries, so the report covers "yesterday".
  
  const { year, month, day } = chicagoNowParts();
  const todayUTC = Date.UTC(year, month - 1, day);
  const yesterday = new Date(todayUTC - 24 * 60 * 60 * 1000);
  return { year: yesterday.getUTCFullYear(), month: yesterday.getUTCMonth() + 1, day: yesterday.getUTCDate() };
}

function buildReport(waste) {
  const wasted = Object.entries(waste || {})
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = ITEMS.find(i => i.id === id);
      return item ? { ...item, qty } : null;
    })
    .filter(Boolean);

  const byCat = {};
  for (const item of wasted) {
    (byCat[item.cat] ||= []).push(item);
  }

  const totalUnits = wasted.reduce((s, i) => s + i.qty, 0);
  return { wasted, byCat, totalUnits };
}

function renderText(dateLabel, report) {
  let txt = `WASTE LOG — Coral Ridge Cinema 2225\n${dateLabel}\n${'─'.repeat(40)}\n`;
  if (report.wasted.length === 0) {
    txt += '\nNo waste logged for this date.\n';
    return txt;
  }
  for (const [cat, items] of Object.entries(report.byCat)) {
    txt += `\n[${cat}]\n`;
    for (const i of items) txt += `  ${i.name}: ${i.qty} ${i.unit}\n`;
  }
  txt += `\nTotal units wasted: ${report.totalUnits}\n`;
  return txt;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderHtml(dateLabel, report) {
  const style = `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a19;`;
  let body;
  if (report.wasted.length === 0) {
    body = `<p style="color:#6b6b68">No waste logged for this date.</p>`;
  } else {
    const sections = Object.entries(report.byCat).map(([cat, items]) => `
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#6b6b68;border-bottom:1px solid #e5e5e3;padding-bottom:4px;margin:20px 0 6px">${escapeHtml(cat)}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${items.map(i => `
          <tr style="border-bottom:1px solid #f0f0ee">
            <td style="padding:6px 0">${escapeHtml(i.name)}</td>
            <td style="padding:6px 0;text-align:right;font-weight:600;white-space:nowrap">${i.qty} <span style="font-weight:400;color:#6b6b68;font-size:12px">${escapeHtml(i.unit)}</span></td>
          </tr>`).join('')}
      </table>`).join('');
    body = sections + `<p style="margin-top:20px;font-size:14px"><strong>Total units wasted:</strong> ${report.totalUnits}</p>`;
  }
  return `<div style="${style}max-width:560px">
    <h2 style="font-size:18px;margin-bottom:2px">Waste Log — Coral Ridge Cinema 2225</h2>
    <div style="font-size:13px;color:#6b6b68;margin-bottom:8px">${escapeHtml(dateLabel)}</div>
    ${body}
  </div>`;
}

async function main() {
  const override = process.env.REPORT_DATE_OVERRIDE || undefined;

  const { year, month, day } = resolveReportDate(override);

  if (!isManual || !force) {
    const { hour } = chicagoNowParts();
    if (hour !== 0) {
      console.log(`Skipping: it is currently hour ${hour} in ${TIME_ZONE}, not local midnight. (One of the two DST-covering cron runs is expected to no-op.)`);
      return;
    }
  }

  const { year, month, day } = resolveReportDate(override);
  const dbKey = ymdToDbKey(year, month, day);
  const dateLabel = ymdToPrettyDate(year, month, day);

  console.log(`Fetching ${dbKey} from Firebase...`);
  const res = await fetch(`${DB_URL}/${dbKey}.json`);
  if (!res.ok) {
    throw new Error(`Firebase read failed: ${res.status} ${await res.text()}`);
  }
  const waste = await res.json();
  const report = buildReport(waste);

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO_EMAIL = process.env.TO_EMAIL;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'Coral Ridge Waste Log <onboarding@resend.dev>';
  if (!RESEND_API_KEY || !TO_EMAIL) {
    throw new Error('Missing RESEND_API_KEY or TO_EMAIL secret.');
  }

  const payload = {
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    subject: `Waste Log — Coral Ridge 2225 — ${dateLabel}`,
    text: renderText(dateLabel, report),
    html: renderHtml(dateLabel, report),
  };

  console.log(`Sending report for ${dateLabel} (${report.wasted.length} item types, ${report.totalUnits} total units) to ${TO_EMAIL}...`);
  const sendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!sendRes.ok) {
    throw new Error(`Resend API failed: ${sendRes.status} ${await sendRes.text()}`);
  }

  console.log('Email sent successfully.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
