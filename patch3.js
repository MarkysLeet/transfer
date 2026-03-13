const fs = require('fs');
const content = fs.readFileSync('./src/components/sections/Destinations.tsx', 'utf8');

const target = `                const isActive = index === selectedIndex;`;

const replacement = `                const isActive = index === selectedIndex;`;

if (content.includes(target)) {
    // Actually we need to make sure we don't have transition:all causing the jumping.
    console.log('already patched, double check transition-all');
} else {
    console.log('not found');
}
