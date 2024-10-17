import { conditionsState, selectedConditionIdState } from '@/config/states/plugin';
import { getNewCondition } from '@/lib/plugin';
import { BundledSidebar } from '@konomi-app/kintone-utilities-react';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback } from 'react';
import { useRecoilState } from 'recoil';

const Sidebar: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [conditions, setConditions] = useRecoilState(conditionsState);
  const [selectedConditionId, setSelectedConditionId] = useRecoilState(selectedConditionIdState);
  const label = useCallback((params: { condition: Plugin.Condition; index: number }) => {
    const { condition, index } = params;

    let label = '未設定';
    if (condition.srcAppId && condition.srcField && condition.dstField) {
      label = `${condition.srcField} → ${condition.dstField}`;
    }

    return (
      <div>
        <div className='text-[11px] text-gray-400'>{`設定${index + 1}`}</div>
        <div>{label}</div>
      </div>
    );
  }, []);

  const onSelectedConditionChange = (condition: Plugin.Condition | null) => {
    setSelectedConditionId(condition?.id ?? null);
  };

  const onConditionDelete = () => {
    enqueueSnackbar('設定情報を削除しました', { variant: 'success' });
  };

  return (
    <BundledSidebar
      conditions={conditions}
      setConditions={setConditions}
      getNewCondition={getNewCondition}
      labelComponent={label}
      onSelectedConditionChange={onSelectedConditionChange}
      selectedConditionId={selectedConditionId}
      onConditionDelete={onConditionDelete}
    />
  );
};

export default Sidebar;
