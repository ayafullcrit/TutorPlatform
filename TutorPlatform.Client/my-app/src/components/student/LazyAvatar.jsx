import { useEffect, useRef, useState } from "react";

export default function LazyAvatar({ src, alt, fallback }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState(fallback);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible) setImgSrc(src || fallback);
  }, [visible, src, fallback]);

  return (
    <div ref={ref} className="lazy-avatar">
      <picture>
        <source srcSet={imgSrc?.replace(".png", ".webp")} type="image/webp" />
        <img
          className="lazy-avatar__img"
          src={imgSrc}
          alt={alt}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallback;
          }}
        />
      </picture>
    </div>
  );
}