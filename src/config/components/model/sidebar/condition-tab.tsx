import { Tab, TabProps } from '@mui/material';
import React, { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { dstFieldState, srcAppIdState, srcFieldState } from '../../../states/plugin';

type Props = TabProps & { index: number };

const Component: FC<Props> = ({ index, ...tabProps }) => {
  const srcAppId = useRecoilValue(srcAppIdState(index));
  const srcField = useRecoilValue(srcFieldState(index));
  const dstField = useRecoilValue(dstFieldState(index));

  return (
    <Tab
      label={`設定${index + 1}${
        !!srcAppId && !!srcField && !!dstField ? `(${srcField} → ${dstField})` : ''
      }`}
      {...tabProps}
    />
  );
};

const Container: FC<Props> = (props) => (
  <Suspense fallback={<Tab label={`設定${props.index + 1}`} {...props} />}>
    <Component {...props} />
  </Suspense>
);

export default Container;
