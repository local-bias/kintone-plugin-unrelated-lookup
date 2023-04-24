import { AutocompleteKintoneField } from '@/common/components/autocomplete-field-input';
import { Skeleton } from '@mui/material';
import React, { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dstAppPropertiesState } from '../../../../states/kintone';
import { dstFieldState } from '../../../../states/plugin';
import { useConditionIndex } from '../../../functional/condition-index-provider';

const Component: FCX = () => {
  const conditionIndex = useConditionIndex();
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

const Container: FC = () => {
  return (
    <Suspense fallback={<Skeleton width={350} height={56} />}>
      <Component />
    </Suspense>
  );
};

export default memo(Container);
