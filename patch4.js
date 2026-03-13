const fs = require('fs');
const content = fs.readFileSync('./src/components/sections/Destinations.tsx', 'utf8');

const target = `                    <div
                      className={\`relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] bg-white
                        \${mobileScale} \${desktopScale}
                        \${mobileZIndex} \${desktopZIndex}
                        \${mobileOpacity} \${desktopOpacity}
                        \${isActive ? "hover:scale-105" : ""}
                      \`}
                    >`;

// Remove `transition-all` to ensure the clones scale and position instantly when snapped,
// so that Embla's internal looping doesn't animate the clones jumping
const replacement = `                    <div
                      className={\`relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer bg-white
                        \${mobileScale} \${desktopScale}
                        \${mobileZIndex} \${desktopZIndex}
                        \${mobileOpacity} \${desktopOpacity}
                        \${isActive ? "hover:scale-105 transition-transform duration-700" : ""}
                      \`}
                    >`;

if (content.includes(target)) {
    fs.writeFileSync('./src/components/sections/Destinations.tsx', content.replace(target, replacement));
    console.log('patched');
} else {
    console.log('not found');
}
