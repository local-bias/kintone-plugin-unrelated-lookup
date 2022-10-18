import { AutocompleteKintoneField } from '@common/components/autocomplete-field-input';
import { Skeleton } from '@mui/material';
import React, { FC, FCX, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { srcAppPropertiesState } from '../../../states/kintone';
import { srcFieldState } from '../../../states/plugin';

type Props = { conditionIndex: number };

const Component: FCX<Props> = ({ conditionIndex }) => {
  const fields = useRecoilValue(srcAppPropertiesState(conditionIndex));
  const fieldCode = useRecoilValue(srcFieldState(conditionIndex));

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (value: string) => {
        set(srcFieldState(conditionIndex), value);
      },
    [conditionIndex]
  );

  return (
    <AutocompleteKintoneField fields={fields} fieldCode={fieldCode} onChange={onFieldChange} />
  );
};

const Container: FC<Props> = (props) => {
  return (
    <Suspense fallback={<Skeleton width={350} height={56} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default Container;
