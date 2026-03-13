const fs = require('fs');
let content = fs.readFileSync('./src/components/ui/BookingWidget.tsx', 'utf8');

content = content.replace(
  `const carClassName = selectedClass === "vw" ? "VW Transporter" : "MB Vito";`,
  `const carClassName = selectedClass === "vw" ? "Volkswagen Transporter" : "Mercedes-Benz Vito";`
);

fs.writeFileSync('./src/components/ui/BookingWidget.tsx', content);
console.log('patched');
