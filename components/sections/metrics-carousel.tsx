"use client";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { gsap, SplitText } from "@/lib/motion";

export interface MetricsCarouselProps { children: readonly ReactNode[]; labels: readonly string[] }
export function MetricsCarousel({ children, labels }: Readonly<MetricsCarouselProps>) {
  const scope = useRef<HTMLDivElement>(null);
  const swiper = useRef<SwiperInstance | null>(null);
  const splits = useRef<SplitText[]>([]);
  const initialized = useRef(new WeakSet<Element>());
  const slideSplits = useRef(new WeakMap<Element, { title: SplitText; copy: SplitText }>());
  const slideChangeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const inView = useRef(false);
  const reduced = useRef(false);

  function playVisibleSlides(instance: SwiperInstance, replayActive = false) {
    if (reduced.current || !inView.current) return;
    const container = scope.current?.getBoundingClientRect();
    if (!container) return;
    let visibleIndex = 0;
    instance.slides.forEach((slide, index) => {
      const bounds = slide.getBoundingClientRect();
      if (bounds.right <= container.left || bounds.left >= container.right || (replayActive ? index !== instance.activeIndex : initialized.current.has(slide))) return;
      const heading = slide.querySelector("h3");
      const paragraph = slide.querySelector(".metric-card p");
      if (!heading || !paragraph) return;
      initialized.current.add(slide);
      let text = slideSplits.current.get(slide);
      if (!text) {
        text = { title: SplitText.create(heading, { type: "words", wordsClass: "motion-word", aria: "auto" }), copy: SplitText.create(paragraph, { type: "lines", linesClass: "motion-line", aria: "auto" }) };
        slideSplits.current.set(slide, text);
        splits.current.push(text.title, text.copy);
      }
      const targets = [...text.title.words, ...text.copy.lines];
      gsap.killTweensOf(targets);
      gsap.fromTo(targets, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .05, delay: replayActive ? 0 : visibleIndex++ * .2, ease: "power2.out" });
      if (replayActive) slide.querySelector(".counter > span")?.dispatchEvent(new Event("noventra:counter-replay"));
    });
  }
  function slideChanged(instance: SwiperInstance) {
    setActive(instance.realIndex % labels.length);
    if (slideChangeTimer.current) clearTimeout(slideChangeTimer.current);
    slideChangeTimer.current = setTimeout(() => document.fonts.ready.then(() => { if (!instance.destroyed) playVisibleSlides(instance, true); }), 100);
  }
  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const synchronize = () => {
      reduced.current = media.matches;
      const instance = swiper.current;
      if (!instance) return;
      if (media.matches || pausedRef.current || !inView.current || element.matches(":focus-within")) instance.autoplay.stop(); else instance.autoplay.start();
      if (media.matches) {
        splits.current.forEach(split => { gsap.killTweensOf([...split.words, ...split.lines]); split.revert(); });
        splits.current = [];
        initialized.current = new WeakSet();
        slideSplits.current = new WeakMap();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      synchronize();
      if (entry.isIntersecting && swiper.current) document.fonts.ready.then(() => { if (scope.current && swiper.current) playVisibleSlides(swiper.current); });
    }, { threshold: .3, rootMargin: "0px 0px -100px 0px" });
    observer.observe(element);
    synchronize();
    media.addEventListener("change", synchronize);
    return () => {
      observer.disconnect(); media.removeEventListener("change", synchronize);
      if (slideChangeTimer.current) clearTimeout(slideChangeTimer.current);
      splits.current.forEach(split => { gsap.killTweensOf([...split.words, ...split.lines]); split.revert(); });
      splits.current = [];
      initialized.current = new WeakSet();
      slideSplits.current = new WeakMap();
    };
  }, []);
  function pause(next: boolean) {
    pausedRef.current = next;
    setPaused(next);
    if (next) swiper.current?.autoplay.stop(); else if (!reduced.current && inView.current) swiper.current?.autoplay.start();
  }
  return <div ref={scope} className="metrics-carousel" aria-label="Noventra delivery stages" role="group" aria-roledescription="carousel" onPointerLeave={() => { requestAnimationFrame(() => { if (pausedRef.current || reduced.current || !inView.current || scope.current?.matches(":focus-within")) swiper.current?.autoplay.stop(); }); }} onFocusCapture={() => swiper.current?.autoplay.stop()} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget) && !pausedRef.current && !reduced.current && inView.current) swiper.current?.autoplay.start(); }}>
    <Swiper modules={[A11y, Autoplay, Keyboard]} slidesPerView="auto" spaceBetween={8} loop loopAdditionalSlides={3} speed={800} watchSlidesProgress keyboard={{ enabled: true, onlyInViewport: true }} autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }} breakpoints={{ 1024: { spaceBetween: 16 } }} onSwiper={instance => { swiper.current = instance; instance.autoplay.stop(); }} onSlideChange={slideChanged}>
      {[0, 1, 2].flatMap(copy => children.map((child, index) => <SwiperSlide key={`${copy}-${index}`} data-copy={copy > 0 ? "duplicate" : "primary"} aria-label={`${index + 1} of ${labels.length}: ${labels[index]}`} aria-hidden={copy > 0 ? true : undefined}>{child}</SwiperSlide>))}
    </Swiper>
    <div className="carousel-toolbar"><span className="carousel-position">{String(active + 1).padStart(2, "0")} / {String(labels.length).padStart(2, "0")}<span>{labels[active]}</span></span><div className="carousel-controls"><button className="icon-button" onClick={() => swiper.current?.slidePrev()} aria-label="Previous delivery stage"><ArrowLeft size={18} aria-hidden="true" /></button><button className="icon-button motion-pause" onClick={() => pause(!paused)} aria-label={`${paused ? "Resume" : "Pause"} delivery animation`} aria-pressed={paused}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button><button className="icon-button" onClick={() => swiper.current?.slideNext()} aria-label="Next delivery stage"><ArrowRight size={18} aria-hidden="true" /></button></div></div>
  </div>;
}
