const fs = require('fs');
let code = fs.readFileSync('src/components/ui/booking-widget/BookingModalContent.tsx', 'utf8');

const regex = /return \(\n    <>\n      \{\/\* Header \*\/\}/;

if(regex.test(code)) {
    console.log("Matched");
}
