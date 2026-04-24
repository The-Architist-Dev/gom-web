import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './HeroCarousel.css';

const slides = [
  {
    image: 'https://i.pinimg.com/1200x/ca/57/35/ca5735c6a579334d55e7ad3711640a6e.jpg',
    title: 'Giám định Gốm Sứ Cổ',
    subtitle: 'Hệ thống AI đa đại lý phân tích chính xác nguồn gốc, niên đại và phong cách của hiện vật gốm sứ Việt Nam',
    gradient: 'linear-gradient(135deg, rgba(15, 38, 92, 0.90) 0%, rgba(15, 38, 92, 0.75) 50%, rgba(15, 38, 92, 0.90) 100%)'
  },
  {
    image: 'https://i.pinimg.com/1200x/8e/9c/3d/8e9c3d8f5e8e8e8e8e8e8e8e8e8e8e8e.jpg',
    title: 'Lưu Trữ Di Sản Văn Hóa',
    subtitle: 'Bảo tồn và chia sẻ kiến thức gốm sứ truyền thống qua công nghệ số hiện đại',
    gradient: 'linear-gradient(135deg, rgba(201, 169, 97, 0.88) 0%, rgba(184, 148, 31, 0.82) 50%, rgba(201, 169, 97, 0.88) 100%)'
  },
  {
    image: 'https://i.pinimg.com/1200x/f5/2e/8c/f52e8c5e8e8e8e8e8e8e8e8e8e8e8e8e.jpg',
    title: 'Khám Phá Dòng Gốm Trứ Danh',
    subtitle: 'Tìm hiểu về các dòng gốm cổ truyền từ Chu Đậu, Bát Tràng đến Thanh Hóa',
    gradient: 'linear-gradient(135deg, rgba(154, 106, 79, 0.90) 0%, rgba(154, 106, 79, 0.78) 50%, rgba(154, 106, 79, 0.90) 100%)'
  }
];

export const HeroCarousel = ({ onCtaClick, onSecondaryClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 25 },
    [Autoplay({ delay: 4500, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="hero-carousel-premium">
      <div className="hero-embla" ref={emblaRef}>
        <div className="hero-embla__container">
          {slides.map((slide, index) => (
            <div className="hero-embla__slide" key={index}>
              <div className="hero-slide-premium">
                <div className="hero-slide-image-premium">
                  <img src={slide.image} alt={slide.title} loading="lazy" />
                  <div className="hero-slide-gradient" style={{ background: slide.gradient }} />
                </div>
                <div className="hero-slide-content-premium">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hero-content-inner-premium"
                  >
                    <h1 className="hero-title-premium">{slide.title}</h1>
                    <p className="hero-subtitle-premium">{slide.subtitle}</p>
                    <div className="hero-cta-group-premium">
                      <button className="hero-cta-primary-premium" onClick={onCtaClick}>
                        Bắt đầu giám định
                        <span className="cta-arrow-premium">→</span>
                      </button>
                      <button className="hero-cta-secondary-premium" onClick={onSecondaryClick}>
                        Khám phá dòng gốm
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Navigation Arrows */}
      <button className="hero-embla__button hero-embla__prev" onClick={scrollPrev} aria-label="Previous">
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>
      <button className="hero-embla__button hero-embla__next" onClick={scrollNext} aria-label="Next">
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>

      {/* Premium Dots */}
      <div className="hero-embla__dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-embla__dot ${index === selectedIndex ? 'is-active' : ''}`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
