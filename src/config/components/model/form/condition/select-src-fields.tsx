import { AutocompleteKintoneField } from '@common/components/autocomplete-field-input';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { srcAppPropertiesState } from '../../../../states/kintone';

type Props = {
  conditionIndex: number;
  fieldCode: string;
  onChange: (code: string) => void;
  label?: string;
};

const Component: FC<Props> = (props) => {
  const { conditionIndex, ...inputProps } = props;
  const srcFields = useRecoilValue(srcAppPropertiesState(conditionIndex));

  return <AutocompleteKintoneField fields={srcFields} {...inputProps} />;
};

export default Component;
