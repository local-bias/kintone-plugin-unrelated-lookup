import { JotaiFieldSelect } from '@konomi-app/kintone-utilities-jotai';
import { Skeleton } from '@mui/material';
import { produce } from 'immer';
import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { nanoid } from 'nanoid';
import { FC, FCX, memo, Suspense, useCallback } from 'react';
import { srcAppPropertiesState } from '../../../states/kintone';
import { selectedConditionAtom, srcFieldAtom } from '../../../states/plugin';

const Component: FCX = () => {
  const fieldCode = useAtomValue(srcFieldAtom);

  const onFieldChange = useAtomCallback(
    useCallback((_, set, value: string) => {
      set(selectedConditionAtom, (prev) =>
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
    }, [])
  );

  return (
    <JotaiFieldSelect
      fieldPropertiesAtom={srcAppPropertiesState}
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
