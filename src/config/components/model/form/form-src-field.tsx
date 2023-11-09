import { AutocompleteKintoneField } from '@/common/components/autocomplete-field-input';
import { Skeleton } from '@mui/material';
import React, { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { srcAppPropertiesState } from '../../../states/kintone';
import { srcFieldState } from '../../../states/plugin';

const Component: FCX = () => {
  const fields = useRecoilValue(srcAppPropertiesState);
  const fieldCode = useRecoilValue(srcFieldState);

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (value: string) => {
        set(srcFieldState, value);
      },
    []
  );

  return (
    <AutocompleteKintoneField fields={fields} fieldCode={fieldCode} onChange={onFieldChange} />
  );
};

const Container: FC = () => {
  return (
    <Suspense fallback={<Skeleton variant='rounded' width={350} height={56} />}>
      <Component />
    </Suspense>
  );
};

export default memo(Container);
