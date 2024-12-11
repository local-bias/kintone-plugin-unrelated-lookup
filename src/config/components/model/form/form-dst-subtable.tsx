import { AutocompleteKintoneField } from '@/lib/components/autocomplete-field-input';
import { Skeleton } from '@mui/material';
import { FC, FCX, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dstAppSubtablePropertiesState } from '../../../states/kintone';
import { dstSubtableFieldCodeState } from '../../../states/plugin';

const Component: FCX = () => {
  const fields = useRecoilValue(dstAppSubtablePropertiesState);
  const fieldCode = useRecoilValue(dstSubtableFieldCodeState);

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (value: string) => {
        set(dstSubtableFieldCodeState, value);
      },
    []
  );

  return (
    <AutocompleteKintoneField fields={fields} fieldCode={fieldCode} onChange={onFieldChange} />
  );
};

const DstSubtableForm: FC = () => {
  return (
    <Suspense fallback={<Skeleton variant='rounded' width={350} height={56} />}>
      <Component />
    </Suspense>
  );
};

export default DstSubtableForm;
