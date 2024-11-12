import { AutocompleteKintoneField } from '@/lib/components/autocomplete-field-input';
import { Skeleton } from '@mui/material';
import { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dstAppSubtablePropertiesState } from '../../../states/kintone';
import { conditionTypeState, dstSubtableFieldCodeState } from '../../../states/plugin';
import {
  PluginFormDescription,
  PluginFormSection,
  PluginFormTitle,
} from '@konomi-app/kintone-utilities-react';

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
  const conditionType = useRecoilValue(conditionTypeState);

  if (conditionType !== 'subtable') {
    return null;
  }

  return (
    <PluginFormSection>
      <PluginFormTitle>対象となるサブテーブル</PluginFormTitle>
      <PluginFormDescription last>
        ルックアップを設定するサブテーブルを選択してください。
      </PluginFormDescription>
      <Suspense fallback={<Skeleton variant='rounded' width={350} height={56} />}>
        <Component />
      </Suspense>
    </PluginFormSection>
  );
};

export default DstSubtableForm;
