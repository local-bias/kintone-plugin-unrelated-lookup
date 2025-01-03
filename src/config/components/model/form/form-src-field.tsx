import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-recoil';
import { Skeleton } from '@mui/material';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { srcAppPropertiesState } from '../../../states/kintone';
import { selectedConditionState, srcFieldState } from '../../../states/plugin';

const Component: FCX = () => {
  const fieldCode = useRecoilValue(srcFieldState);

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (value: string) => {
        set(selectedConditionState, (prev) =>
          produce(prev, (draft) => {
            draft.srcField = value;
            const index = draft.displayFields.findIndex((field) => field.isLookupField);
            if (index === -1) {
              draft.displayFields.unshift({ id: nanoid(), fieldCode: value, isLookupField: true });
              return draft;
            }
            draft.displayFields[index].fieldCode = value;
          })
        );
      },
    []
  );

  return (
    <RecoilFieldSelect
      state={srcAppPropertiesState}
      fieldCode={fieldCode}
      onChange={onFieldChange}
    />
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
