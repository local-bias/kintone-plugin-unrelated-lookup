import { FormControlLabel, Switch, Tooltip } from '@mui/material';
import { type FC } from 'react';

const ConditionTypeForm: FC = () => {
  return (
    <div>
      <Tooltip title='この機能は拡張ルックアップ プラスでのみご利用いただけます'>
        <FormControlLabel
          control={<Switch checked={false} disabled />}
          label='サブテーブル内で使用する'
        />
      </Tooltip>
    </div>
  );
};

export default ConditionTypeForm;
