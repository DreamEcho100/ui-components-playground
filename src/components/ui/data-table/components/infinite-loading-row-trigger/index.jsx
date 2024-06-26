import { useEffect, useRef, useState } from 'react';
import useIsIntersecting from './utils';

const defaultDelayAmountAfterSuccessMS = 1500;

/**
 * @param {import("./types").InfiniteLoadingRowTriggerProps} props
 */
export default function InfiniteLoadingRowTrigger(props) {
  const ref = useRef(/** @type {HTMLTableRowElement | null} */ (null));
  const delayAmountAfterSuccessMS =
    props.delayAmountAfterSuccessMS ?? defaultDelayAmountAfterSuccessMS;

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
    setStatus('loading');
    loadMore({
      onSuccess: () => {
        setStatus('success');
      },
    });
  }, [isDisabled, isIntersecting, loadMore, status]);

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
