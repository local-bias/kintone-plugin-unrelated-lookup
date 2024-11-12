import { AutocompleteKintoneField } from '@/lib/components/autocomplete-field-input';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { Skeleton } from '@mui/material';
import { FC, FCX, Suspense } from 'react';
import { RecoilState, RecoilValueReadOnly, useRecoilCallback, useRecoilValue } from 'recoil';

type Props = {
  appPropertiesState: RecoilValueReadOnly<kintoneAPI.FieldProperty[]>;
  fieldCodeState: RecoilState<string>;
};

const Component: FCX<Props> = ({ appPropertiesState, fieldCodeState }) => {
  const fields = useRecoilValue(appPropertiesState);
  const fieldCode = useRecoilValue(fieldCodeState);

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (value: string) => {
        set(fieldCodeState, value);
      },
    []
  );

  return (
    <AutocompleteKintoneField fields={fields} fieldCode={fieldCode} onChange={onFieldChange} />
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
