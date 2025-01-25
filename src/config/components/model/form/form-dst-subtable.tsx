import { JotaiFieldSelect } from '@konomi-app/kintone-utilities-jotai';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { FC, FCX, Suspense, useCallback } from 'react';
import { dstAppSubtablePropertiesState } from '../../../states/kintone';
import { dstSubtableFieldCodeAtom } from '../../../states/plugin';

const Component: FCX = () => {
  const fieldCode = useAtomValue(dstSubtableFieldCodeAtom);

  const onFieldChange = useAtomCallback(
    useCallback((_, set, value: string) => {
      set(dstSubtableFieldCodeAtom, value);
    }, [])
  );

  return (
    <JotaiFieldSelect
      fieldPropertiesAtom={dstAppSubtablePropertiesState}
      fieldCode={fieldCode}
      onChange={onFieldChange}
    />
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
