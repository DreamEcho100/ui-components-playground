import { useEffect, useState } from "react";

/**
 * @template {Element} T
 *
 * @param {{
 * 	ref: React.MutableRefObject<T | null>
 *  intersectionObserverInit?: IntersectionObserverInit
 * }} props
 */
export default function useIsIntersecting(props) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (!entry) return;

      setIsIntersecting(entry.isIntersecting);
    }, props.intersectionObserverInit);

    if (props.ref.current) {
      observer.observe(props.ref.current);
    }

    return () => {
      if (props.ref.current) {
        observer.unobserve(props.ref.current);
      }
    };
  }, [props.ref, props.intersectionObserverInit]);

  return isIntersecting;
}
