import { AutocompleteKintoneField } from '@common/components/autocomplete-field-input';
import { Skeleton } from '@mui/material';
import React, { FC, FCX, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dstAppPropertiesState } from '../../../states/kintone';
import { dstFieldState } from '../../../states/plugin';

type Props = { conditionIndex: number };

const Component: FCX<Props> = ({ conditionIndex }) => {
  const fields = useRecoilValue(dstAppPropertiesState);
  const fieldCode = useRecoilValue(dstFieldState(conditionIndex));

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (value: string) => {
        set(dstFieldState(conditionIndex), value);
      },
    [conditionIndex]
  );

  return (
    <AutocompleteKintoneField fields={fields} fieldCode={fieldCode} onChange={onFieldChange} />
  );
};

const Container: FC<Props> = (props) => {
  return (
    <Suspense fallback={<Skeleton width={400} height={80} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default Container;
