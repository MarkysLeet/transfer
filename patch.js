const fs = require('fs');
const content = fs.readFileSync('./src/components/sections/Destinations.tsx', 'utf8');

const target = `  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Only call setState if the value actually changed to prevent cascading renders
    const updateSelect = () => {
      setSelectedIndex((current) => {
        const next = emblaApi.selectedScrollSnap();
        return current === next ? current : next;
      });
    };

    updateSelect();
    emblaApi.on("select", updateSelect);
    emblaApi.on("reInit", updateSelect);
  }, [emblaApi]);`;

const replacement = `  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tweenValues, setTweenValues] = useState<number[]>([]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) {
              diffToTarget = scrollSnap - (1 + scrollProgress);
            }
            if (sign === 1) {
              diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          }
        });
      }
      return Math.abs(diffToTarget);
    });
    setTweenValues(styles);
  }, [emblaApi, setTweenValues]);

  useEffect(() => {
    if (!emblaApi) return;

    const updateSelect = () => {
      setSelectedIndex((current) => {
        const next = emblaApi.selectedScrollSnap();
        return current === next ? current : next;
      });
    };

    onScroll();
    updateSelect();

    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("select", updateSelect);
    emblaApi.on("reInit", updateSelect);
  }, [emblaApi, onScroll]);`;

if (content.includes(target)) {
    fs.writeFileSync('./src/components/sections/Destinations.tsx', content.replace(target, replacement));
    console.log('patched');
} else {
    console.log('not found');
}
