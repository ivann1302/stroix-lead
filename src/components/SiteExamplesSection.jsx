import { useEffect, useRef, useState } from 'react';
import { siteExamples } from '../data/home';

const AUTOPLAY_DELAY = 3600;
const MOBILE_QUERY = '(max-width: 699px)';

function getDesktopPosition(index, activeIndex) {
  const relativeIndex = (index - activeIndex + siteExamples.length) % siteExamples.length;

  if (relativeIndex === 0) {
    return 'center';
  }

  return relativeIndex === 1 ? 'right' : 'left';
}

function getCenteredOffset(scroller, item) {
  return item.offsetLeft - ((scroller.clientWidth - item.clientWidth) / 2);
}

function getNearestIndex(scroller) {
  const items = Array.from(scroller.children);
  const viewportCenter = scroller.scrollLeft + (scroller.clientWidth / 2);

  return items.reduce((nearest, item, index) => {
    const itemCenter = item.offsetLeft + (item.clientWidth / 2);
    const distance = Math.abs(viewportCenter - itemCenter);

    return distance < nearest.distance ? { index, distance } : nearest;
  }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
}

export default function SiteExamplesSection() {
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const scroller = scrollerRef.current;

    if (!scroller) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    let autoplayTimer;
    let scrollTimer;
    let restartTimer;

    const scrollToIndex = (index, behavior = 'smooth') => {
      const item = scroller.children[index];

      if (!item || !mediaQuery.matches) {
        return;
      }

      scroller.scrollTo({
        left: getCenteredOffset(scroller, item),
        behavior,
      });
    };

    const syncActiveIndex = () => {
      if (!mediaQuery.matches) {
        return;
      }

      setActiveIndex(getNearestIndex(scroller));
    };

    const startAutoplay = () => {
      window.clearInterval(autoplayTimer);

      autoplayTimer = window.setInterval(() => {
        setActiveIndex((currentIndex) => {
          const nextIndex = (currentIndex + 1) % siteExamples.length;

          if (mediaQuery.matches) {
            scrollToIndex(nextIndex);
          }

          return nextIndex;
        });
      }, AUTOPLAY_DELAY);
    };

    const restartAutoplay = () => {
      window.clearInterval(autoplayTimer);
      window.clearTimeout(restartTimer);
      restartTimer = window.setTimeout(startAutoplay, AUTOPLAY_DELAY);
    };

    const handleScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(syncActiveIndex, 120);
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    scroller.addEventListener('pointerdown', restartAutoplay, { passive: true });
    window.addEventListener('resize', syncActiveIndex);

    scrollToIndex(0, 'auto');
    startAutoplay();

    return () => {
      window.clearInterval(autoplayTimer);
      window.clearTimeout(scrollTimer);
      window.clearTimeout(restartTimer);
      scroller.removeEventListener('scroll', handleScroll);
      scroller.removeEventListener('pointerdown', restartAutoplay);
      window.removeEventListener('resize', syncActiveIndex);
    };
  }, []);

  return (
    <section className="site-examples-section" id="site-examples" aria-labelledby="site-examples-title" data-reveal="section">
      <div className="site-examples-section__head" data-reveal="item">
        <p className="eyebrow">Примеры сайтов</p>
        <h2 id="site-examples-title">
          Даете клиенту не просто сайт, а <span className="site-examples-section__accent">готовый путь к заявке</span>
        </h2>
        <p>
          Под каждый запуск я готовлю современную посадочную страницу с сильной подачей,
          понятной структурой доверия и воронкой, которая ведет посетителя к обращению.
        </p>
      </div>

      <div className="site-examples-desktop" aria-label="Примеры сайтов для клиентов" data-reveal="panel" data-reveal-delay="1">
        <div className="site-examples-desktop__stage">
          {siteExamples.map((example, index) => {
            const position = getDesktopPosition(index, activeIndex);

            return (
              <div className={`site-example-card site-example-card--${position}`} key={example.image}>
                <img src={example.image} alt={example.title} loading="lazy" decoding="async" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="site-examples-mobile">
        <div
          className="site-examples-mobile__scroller"
          ref={scrollerRef}
          aria-label="Примеры сайтов для клиентов"
        >
          {siteExamples.map((example) => (
            <div className="site-example-card" key={example.image}>
              <img src={example.image} alt={example.title} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <div className="site-examples-mobile__dots" aria-hidden="true">
          {siteExamples.map((example, index) => (
            <span
              className={index === activeIndex ? 'site-examples-mobile__dot site-examples-mobile__dot--active' : 'site-examples-mobile__dot'}
              key={example.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
