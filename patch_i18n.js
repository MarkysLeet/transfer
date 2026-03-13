const fs = require('fs');

const langs = ['en', 'de', 'ru', 'tr'];

langs.forEach(lang => {
    const file = `./messages/${lang}.json`;
    let content = fs.readFileSync(file, 'utf8');

    // Update the existing widget capacities to have full names
    if (lang === 'en') {
        content = content.replace(/"vwClass": ".*"/g, '"vwClass": "Volkswagen Transporter (1-5 pax)",\n    "fleetVwClass": "Volkswagen Transporter"');
        content = content.replace(/"vitoClass": ".*"/g, '"vitoClass": "Mercedes-Benz Vito (1-8 pax)",\n    "fleetVitoClass": "Mercedes-Benz Vito"');
    } else if (lang === 'ru') {
        content = content.replace(/"vwClass": ".*"/g, '"vwClass": "Volkswagen Transporter (1-5 чел.)",\n    "fleetVwClass": "Volkswagen Transporter"');
        content = content.replace(/"vitoClass": ".*"/g, '"vitoClass": "Mercedes-Benz Vito (1-8 чел.)",\n    "fleetVitoClass": "Mercedes-Benz Vito"');
    } else if (lang === 'de') {
        content = content.replace(/"vwClass": ".*"/g, '"vwClass": "Volkswagen Transporter (1-5 Pers.)",\n    "fleetVwClass": "Volkswagen Transporter"');
        content = content.replace(/"vitoClass": ".*"/g, '"vitoClass": "Mercedes-Benz Vito (1-8 Pers.)",\n    "fleetVitoClass": "Mercedes-Benz Vito"');
    } else if (lang === 'tr') {
        content = content.replace(/"vwClass": ".*"/g, '"vwClass": "Volkswagen Transporter (1-5 kişi)",\n    "fleetVwClass": "Volkswagen Transporter"');
        content = content.replace(/"vitoClass": ".*"/g, '"vitoClass": "Mercedes-Benz Vito (1-8 kişi)",\n    "fleetVitoClass": "Mercedes-Benz Vito"');
    }

    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
});
