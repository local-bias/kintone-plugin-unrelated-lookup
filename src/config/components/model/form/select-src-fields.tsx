import { JotaiFieldSelect } from '@konomi-app/kintone-utilities-jotai';
import { FC } from 'react';
import { srcAppPropertiesState } from '../../../states/kintone';

type Props = {
  fieldCode: string;
  onChange: (code: string) => void;
  label?: string;
  disabled?: boolean;
};

const Component: FC<Props> = (props) => {
  return (
    <JotaiFieldSelect sx={{ width: 320 }} fieldPropertiesAtom={srcAppPropertiesState} {...props} />
  );
};

export default Component;
