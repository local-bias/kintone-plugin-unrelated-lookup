import { copyableDstAppPropertiesState } from '../../../../states/kintone';
import { copiesAtom } from '../../../../states/plugin';
import CommonForm from './common';

export default () => (
  <CommonForm appPropertiesAtom={copyableDstAppPropertiesState} copiesAtom={copiesAtom} />
);
