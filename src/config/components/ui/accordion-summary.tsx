import { AccordionSummary } from '@mui/material';
import React, { FC, memo } from 'react';
import { useRecoilValue } from 'recoil';
import { dstFieldState, srcAppIdState, srcFieldState } from '../../states/plugin';
import { useConditionIndex } from '../functional/condition-index-provider';

const Component: FC = () => {
  const conditionIndex = useConditionIndex();
  const srcAppId = useRecoilValue(srcAppIdState(conditionIndex));
  const srcField = useRecoilValue(srcFieldState(conditionIndex));
  const dstField = useRecoilValue(dstFieldState(conditionIndex));

  return (
    <AccordionSummary>
      設定{conditionIndex + 1}
      {!!srcAppId && !!srcField && !!dstField && ` [${srcField} → ${dstField}]`}
    </AccordionSummary>
  );
};

export default memo(Component);
