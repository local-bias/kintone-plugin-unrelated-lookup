import { Skeleton } from '@mui/material';
import React, { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { conditionsState } from '../../../states/plugin';

type Props = { index: number };

const Component: FC<Props> = ({ index }) => {
  const conditions = useRecoilValue(conditionsState);
  const { srcAppId, srcField, dstField } = conditions[index];

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
