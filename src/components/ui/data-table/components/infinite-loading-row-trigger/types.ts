export interface InfiniteLoadingRowTriggerProps {
  loadMore: (options: { onSuccess: () => void }) => Promise<void>;
  isPending: boolean;
  isDisabled?: boolean;
  hasMore: boolean;
  delayAmountAfterSuccessMS?: number;
  delayAmountAfterErrorMS?: number;
}
