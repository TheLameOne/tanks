import { useEffect, useRef, useState } from 'react';
import slideOne from '../assets/homepage/web/slide-1.webp';
import slideTwo from '../assets/homepage/web/slide-2.webp';
import slideThree from '../assets/homepage/web/slide-3.webp';
import slideFour from '../assets/homepage/web/slide-4.webp';
import slideFive from '../assets/homepage/web/slide-5.webp';

type HeroSlide = {
  src: string;
  alt: string;
  // White-background renders sit inside the frame; studio renders fill it.
  fit: 'contain' | 'cover';
  // Shifts a cropped image so its detail clears the caption in the top-left corner.
  position?: string;
};

const slides: HeroSlide[] = [
  {
    src: slideOne,
    alt: "Tank's tiny gantry car wash installed in a wash bay with its control panel and pump",
    fit: 'contain',
  },
  {
    src: slideTwo,
    alt: "Overhead view of a complete Tank's tiny wash bay layout",
    fit: 'contain',
  },
  {
    src: slideThree,
    alt: "Tank's tiny gantry beside a wall-mounted control panel and high-pressure pump",
    fit: 'contain',
  },
  {
    src: slideFour,
    alt: "Side view of the Tank's tiny gantry with a car inside the wash bay",
    fit: 'cover',
  },
  {
    src: slideFive,
    alt: "Front view of the Tank's tiny gantry with a car ready for washing",
    fit: 'cover',
    position: '32% 50%',
  },
];

const SLIDE_DURATION_MS = 6000;

type Direction = 'next' | 'previous';

export default function HeroSlider({ caption }: { caption: string }) {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>('next');
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const sliderRef = useRef<HTMLElement | null>(null);
  const pointerStart = useRef<number | null>(null);
  const isRunning = !isHovered && isInView;

  const goTo = (index: number, nextDirection: Direction) => {
    if (index === current) return;
    setPrevious(current);
    setCurrent(index);
    setDirection(nextDirection);
  };
  const showNext = () => goTo((current + 1) % slides.length, 'next');
  const showPrevious = () => goTo((current - 1 + slides.length) % slides.length, 'previous');

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setIsInView(entry.isIntersecting);
    });
    observer.observe(slider);

    return () => observer.disconnect();
  }, []);

  // Auto-scroll; restarting on every change means a swipe also resets the timer.
  useEffect(() => {
    if (!isRunning) return undefined;

    const timeout = window.setTimeout(showNext, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [current, isRunning]);

  return (
    <section
      ref={sliderRef}
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Tank's machines"
    >
      <div
        className="hero-slider__viewport"
        aria-live={isRunning ? 'off' : 'polite'}
        onPointerEnter={(event) => { if (event.pointerType === 'mouse') setIsHovered(true); }}
        onPointerLeave={() => setIsHovered(false)}
        onPointerDown={(event) => { pointerStart.current = event.clientX; }}
        onPointerUp={(event) => {
          if (pointerStart.current === null) return;
          const delta = event.clientX - pointerStart.current;
          pointerStart.current = null;
          if (Math.abs(delta) > 45) {
            if (delta > 0) showPrevious();
            else showNext();
          }
        }}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        {slides.map((slide, index) => {
          let state = 'is-hidden';
          if (index === current) state = previous === null ? 'is-current' : `is-current is-entering-${direction}`;
          else if (index === previous) state = `is-leaving is-leaving-${direction}`;

          return (
            <figure
              className={`hero-slide hero-slide--${slide.fit} ${state}`}
              key={slide.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={index !== current}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                style={slide.position ? { objectPosition: slide.position } : undefined}
                draggable={false}
                decoding="async"
              />
            </figure>
          );
        })}
        {/* One caption shared by every slide, so it stays put while the images move. */}
        <p className="hero-slider__caption">{caption}</p>
      </div>

    </section>
  );
}
