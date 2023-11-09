import { AutocompleteKintoneField } from '@/common/components/autocomplete-field-input';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { srcAppPropertiesState } from '../../../states/kintone';

type Props = {
  fieldCode: string;
  onChange: (code: string) => void;
  label?: string;
};

const Component: FC<Props> = (props) => {
  const srcFields = useRecoilValue(srcAppPropertiesState);

  return <AutocompleteKintoneField fields={srcFields} {...props} />;
};

export default Component;
