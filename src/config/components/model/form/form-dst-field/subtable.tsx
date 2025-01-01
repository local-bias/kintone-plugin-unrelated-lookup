import { dstAppInsubtablePropertiesState } from '../../../../states/kintone';
import { dstInsubtableFieldCodeState } from '../../../../states/plugin';
import CommonForm from './common';

export default () => (
  <CommonForm
    appPropertiesState={dstAppInsubtablePropertiesState}
    fieldCodeState={dstInsubtableFieldCodeState}
  />
);
