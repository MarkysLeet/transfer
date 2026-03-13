const fs = require('fs');
let content = fs.readFileSync('./src/components/sections/FeaturesShowcase.tsx', 'utf8');

content = content.replace(
  `const currentCarTitle = selectedClass === "vw" ? ["VW", "Transporter"] : ["Mercedes Benz", "Vito"];`,
  `const currentCarTitle = selectedClass === "vw" ? ["Volkswagen", "Transporter"] : ["Mercedes-Benz", "Vito"];`
);

content = content.replace(
  `<span className="relative z-20">{tWidget("vwClass")}</span>`,
  `<span className="relative z-20">{tWidget("fleetVwClass")}</span>`
);

content = content.replace(
  `<span className="relative z-20">{tWidget("vitoClass")}</span>`,
  `<span className="relative z-20">{tWidget("fleetVitoClass")}</span>`
);

fs.writeFileSync('./src/components/sections/FeaturesShowcase.tsx', content);
console.log('patched');
