const fs = require('fs');
const content = fs.readFileSync('./src/components/sections/Destinations.tsx', 'utf8');

const target = `                const distance = Math.abs(selectedIndex - index);
                const isActive = index === selectedIndex;

                // Desktop Coverflow Logic (5 cards)
                // Center: 100%, Distance 1: 90%, Distance >= 2: 80%
                let desktopScale = "md:scale-80";
                let desktopZIndex = "md:z-0";
                let desktopOpacity = "md:opacity-40";

                if (distance === 0) {
                  desktopScale = "md:scale-100";
                  desktopZIndex = "md:z-30";
                  desktopOpacity = "md:opacity-100 md:shadow-2xl";
                } else if (distance === 1) {
                  desktopScale = "md:scale-90";
                  desktopZIndex = "md:z-20";
                  desktopOpacity = "md:opacity-70";
                }

                // Mobile/Tablet Coverflow Logic (3 cards)
                // Center: 100%, Distance >= 1: 85%
                let mobileScale = "scale-90";
                let mobileZIndex = "z-10";
                let mobileOpacity = "opacity-50";

                if (distance === 0) {
                  mobileScale = "scale-100";
                  mobileZIndex = "z-30";
                  mobileOpacity = "opacity-100 shadow-xl";
                }`;

const replacement = `                const tweenValue = tweenValues.length > index ? tweenValues[index] : 0;
                const distance = Math.round(tweenValue * cards.length); // Rough distance estimation

                const isActive = index === selectedIndex;

                // Smooth scaling and opacity using tweenValue (which ranges 0-1 depending on distance from center)
                // Desktop Coverflow Logic: Center = 1, Distance 1 = ~0.9, >1 = 0.8
                const isCenter = tweenValue < 0.1;
                const isNearCenter = tweenValue >= 0.1 && tweenValue < 0.3;

                let desktopScale = "md:scale-80";
                let desktopZIndex = "md:z-0";
                let desktopOpacity = "md:opacity-40";

                if (isCenter) {
                  desktopScale = "md:scale-100";
                  desktopZIndex = "md:z-30";
                  desktopOpacity = "md:opacity-100 md:shadow-2xl";
                } else if (isNearCenter) {
                  desktopScale = "md:scale-90";
                  desktopZIndex = "md:z-20";
                  desktopOpacity = "md:opacity-70";
                }

                // Mobile/Tablet Coverflow Logic
                let mobileScale = "scale-90";
                let mobileZIndex = "z-10";
                let mobileOpacity = "opacity-50";

                if (isCenter) {
                  mobileScale = "scale-100";
                  mobileZIndex = "z-30";
                  mobileOpacity = "opacity-100 shadow-xl";
                }`;

if (content.includes(target)) {
    fs.writeFileSync('./src/components/sections/Destinations.tsx', content.replace(target, replacement));
    console.log('patched');
} else {
    console.log('not found');
}
