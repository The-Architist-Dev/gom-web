import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Clock, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import './HeroSection.css';

const slides = [
  {
    image: '/banners/bowl.jpg',
    title: 'Chén Gốm Cổ',
    subtitle: 'Khám phá vẻ đẹp tinh tế của nghệ thuật gốm sứ truyền thống'
  },
  {
    image: '/banners/ceramicblue.jpg',
    title: 'Gốm Xanh Cổ Điển',
    subtitle: 'Nét đẹp thanh tao của men xanh cổ truyền Việt Nam'
  },
  {
    image: '/banners/ceramicbrown.jpg',
    title: 'Gốm Nâu Đất',
    subtitle: 'Sự mộc mạc và gần gũi của đất sét thiên nhiên'
  },
  {
    image: '/banners/ceramicgreen.jpg',
    title: 'Gốm Xanh Lục',
    subtitle: 'Màu sắc tươi mới của thiên nhiên trong nghệ thuật gốm'
  },
  {
    image: '/banners/ceramicpink.jpg',
    title: 'Gốm Hồng Phấn',
    subtitle: 'Sắc hồng nhẹ nhàng, tinh tế của gốm sứ cao cấp'
  }
];

export const HeroSection = ({ onCtaClick, onSecondaryClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 25 },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
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
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column - Content */}
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content-inner"
          >
            {/* Badge */}
            <div className="hero-badge">
              <span>Giám định gốm sứ bằng AI</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              <span className="hero-title-line">Khám phá giá trị</span>
              <span className="hero-title-line">
                hiện vật <span className="hero-title-accent">gốm sứ</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Tải ảnh hiện vật để hệ thống AI đa đại lý phân tích phong cách, niên đại và dấu hiệu nhận diện.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta-group">
              <button className="hero-cta-primary" onClick={onCtaClick}>
                Bắt đầu giám định
                <span className="cta-arrow">→</span>
              </button>
              <button className="hero-cta-secondary" onClick={onSecondaryClick}>
                Khám phá dòng gốm
              </button>
            </div>

          </motion.div>
        </div>

        {/* Right Column - Slider */}
        <div className="hero-slider-container">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-slider-wrapper"
          >
            {/* Floating Badge */}
            <div className="floating-badge">
              <span>AI phân tích</span>
            </div>

            {/* Slider */}
            <div className="hero-embla" ref={emblaRef}>
              <div className="hero-embla__container">
                {slides.map((slide, index) => (
                  <div className="hero-embla__slide" key={index}>
                    <div className="hero-slide">
                      <div className="hero-slide-image">
                        <img src={slide.image} alt={slide.title} loading="lazy" />
                        <div className="hero-slide-overlay">
                          <div className="slide-info">
                            <h3>{slide.title}</h3>
                            <p>{slide.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button className="hero-embla__button hero-embla__prev" onClick={scrollPrev} aria-label="Previous">
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button className="hero-embla__button hero-embla__next" onClick={scrollNext} aria-label="Next">
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>

            {/* Dots */}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};