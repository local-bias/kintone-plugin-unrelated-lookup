import { Skeleton } from '@mui/material';
import React, { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { dstFieldState, srcAppIdState, srcFieldState } from '../../../states/plugin';

type Props = { index: number };

const Component: FC<Props> = ({ index }) => {
  const srcAppId = useRecoilValue(srcAppIdState(index));
  const srcField = useRecoilValue(srcFieldState(index));
  const dstField = useRecoilValue(dstFieldState(index));

  if (!srcAppId || !srcField || !dstField) {
    return null;
  }
  return (
    <>
      ({srcField} → {dstField})
    </>
  );
};

const PlaceHolder: FC = () => (
  <>
    (<Skeleton variant='text' width={100} /> → <Skeleton variant='text' width={100} />)
  </>
);

const Container: FC<Props> = (props) => (
  <Suspense fallback={<PlaceHolder />}>
    <Component {...props} />
  </Suspense>
);

export default Container;
