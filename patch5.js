const fs = require('fs');
const content = fs.readFileSync('./src/components/sections/Destinations.tsx', 'utf8');

const target = `                    key={card.id}
                    className="flex-[0_0_65%] sm:flex-[0_0_50%] md:flex-[0_0_30%] lg:flex-[0_0_25%] min-w-0 pl-4 md:pl-6 relative transition-transform duration-500"`;

const replacement = `                    key={card.id}
                    className="flex-[0_0_65%] sm:flex-[0_0_50%] md:flex-[0_0_30%] lg:flex-[0_0_25%] min-w-0 pl-4 md:pl-6 relative"`;

if (content.includes(target)) {
    fs.writeFileSync('./src/components/sections/Destinations.tsx', content.replace(target, replacement));
    console.log('patched 5');
} else {
    console.log('not found 5');
}
