import { useEffect, useRef, useState } from 'react';
import useIsIntersecting from './utils';

const defaultDelayAmountAfterSuccessMS = 1500;
const defaultDelayAmountBeforeLoadingMS = 1000;

/**
 * @param {import("./types").InfiniteLoadingRowTriggerProps} props
 */
export default function InfiniteLoadingRowTrigger(props) {
  const ref = useRef(/** @type {HTMLTableRowElement | null} */ (null));
  const delayAmountAfterSuccessMS =
    props.delayAmountAfterSuccessMS ?? defaultDelayAmountAfterSuccessMS;
  const delayAmountBeforeLoadingMS =
    props.delayAmountBeforeLoadingMS ?? defaultDelayAmountBeforeLoadingMS;

  const isDisabled = props.isPending || !props.hasMore || props.isDisabled;
  const isIntersecting = useIsIntersecting({ ref });
  const [status, setStatus] = useState(
    /**
     * @type {'idle' | 'loading' | 'success'}
     */
    ('idle'),
  );
  const loadMore = props.loadMore;

  useEffect(() => {
    if (status !== 'idle') {
      return;
    }

    if (!isIntersecting || isDisabled) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setStatus('loading');
      loadMore({ onSuccess: () => setStatus('success') });
    }, delayAmountBeforeLoadingMS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    delayAmountBeforeLoadingMS,
    isDisabled,
    isIntersecting,
    loadMore,
    status,
  ]);

  useEffect(() => {
    if (status !== 'success' || isDisabled) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setStatus('idle');
    }, delayAmountAfterSuccessMS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [delayAmountAfterSuccessMS, isDisabled, status]);

  return <tr ref={ref} />;
}
