import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { JotaiFieldSelect } from '@konomi-app/kintone-utilities-jotai';
import { Skeleton } from '@mui/material';
import { Atom, PrimitiveAtom, useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { FC, FCX, Suspense, useCallback } from 'react';

type Props = {
  appPropertiesAtom: Atom<Promise<kintoneAPI.FieldProperty[]>>;
  fieldCodeAtom: PrimitiveAtom<string>;
};

const Component: FCX<Props> = ({ appPropertiesAtom, fieldCodeAtom }) => {
  const fieldCode = useAtomValue(fieldCodeAtom);

  const onFieldChange = useAtomCallback(
    useCallback((_, set, value: string) => {
      set(fieldCodeAtom, value);
    }, [])
  );

  return (
    <JotaiFieldSelect
      fieldPropertiesAtom={appPropertiesAtom}
      fieldCode={fieldCode}
      onChange={onFieldChange}
    />
  );
};

const Container: FC<Props> = (props) => {
  return (
    <Suspense fallback={<Skeleton variant='rounded' width={350} height={56} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default Container;
