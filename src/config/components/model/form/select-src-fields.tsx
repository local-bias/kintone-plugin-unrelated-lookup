import { FC } from 'react';
import { srcAppPropertiesState } from '../../../states/kintone';
import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-recoil';

type Props = {
  fieldCode: string;
  onChange: (code: string) => void;
  label?: string;
  disabled?: boolean;
};

const Component: FC<Props> = (props) => {
  return <RecoilFieldSelect state={srcAppPropertiesState} {...props} />;
};

export default Component;
