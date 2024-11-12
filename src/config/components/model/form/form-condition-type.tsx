import { conditionTypeState } from '@/config/states/plugin';
import { FormControlLabel, Switch } from '@mui/material';
import { type FC } from 'react';
import { useRecoilState } from 'recoil';

const ConditionTypeForm: FC = () => {
  const [mode, setMode] = useRecoilState(conditionTypeState);

  const onChange = (_: any, checked: boolean) => {
    setMode(checked ? 'subtable' : 'single');
  };

  return (
    <div>
      <FormControlLabel
        control={<Switch checked={mode === 'subtable'} onChange={onChange} />}
        label='サブテーブル内で使用する'
      />
    </div>
  );
};

export default ConditionTypeForm;
