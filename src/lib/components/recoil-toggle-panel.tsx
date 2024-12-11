import { Slot } from '@radix-ui/react-slot';
import { ForwardedRef, HTMLAttributes, forwardRef } from 'react';
import { RecoilState, useRecoilValue } from 'recoil';

export interface RecoilTogglePanelProps<T> extends HTMLAttributes<HTMLDivElement> {
  atom: RecoilState<T>;
  asChild?: boolean;
  shouldShow?: (value: T) => boolean;
}

function RecoilTogglePanelInner<T>(
  {
    atom,
    asChild,
    shouldShow = (value: T) => Boolean(value),
    ...divProps
  }: RecoilTogglePanelProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const value = useRecoilValue(atom);
  if (!shouldShow(value)) {
    return null;
  }
  const Component = asChild ? Slot : 'div';
  return <Component ref={ref} {...divProps} />;
}

export const RecoilTogglePanel = forwardRef(RecoilTogglePanelInner) as <T>(
  props: RecoilTogglePanelProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof RecoilTogglePanelInner>;
