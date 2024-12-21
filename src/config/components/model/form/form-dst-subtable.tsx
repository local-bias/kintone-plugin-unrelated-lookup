import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-recoil';
import { Skeleton } from '@mui/material';
import { FC, FCX, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dstAppSubtablePropertiesState } from '../../../states/kintone';
import { dstSubtableFieldCodeState } from '../../../states/plugin';

const Component: FCX = () => {
  const fieldCode = useRecoilValue(dstSubtableFieldCodeState);

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (value: string) => {
        set(dstSubtableFieldCodeState, value);
      },
    []
  );

  return (
    <RecoilFieldSelect
      state={dstAppSubtablePropertiesState}
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
