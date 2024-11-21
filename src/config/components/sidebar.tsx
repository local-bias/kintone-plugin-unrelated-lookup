import { conditionsState, selectedConditionIdState } from '@/config/states/plugin';
import { getNewCondition, PluginCondition, validateCondition } from '@/lib/plugin';
import { BundledSidebar } from '@konomi-app/kintone-utilities-react';
import { useSnackbar } from 'notistack';
import { FC, useCallback } from 'react';
import { useRecoilState } from 'recoil';

const Sidebar: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [conditions, setConditions] = useRecoilState(conditionsState);
  const [selectedConditionId, setSelectedConditionId] = useRecoilState(selectedConditionIdState);
  const label = useCallback((params: { condition: PluginCondition; index: number }) => {
    const { condition, index } = params;

    let label = '未設定';
    if (
      condition.type === 'single' &&
      condition.srcAppId &&
      condition.srcField &&
      condition.dstField
    ) {
      label = `${condition.srcField} → ${condition.dstField}`;
    }
    if (
      condition.type === 'subtable' &&
      condition.srcAppId &&
      condition.srcField &&
      condition.dstSubtableFieldCode &&
      condition.dstInsubtableFieldCode
    ) {
      label = `${condition.srcField} → ${condition.dstInsubtableFieldCode}(${condition.dstSubtableFieldCode})`;
    }

    return (
      <div>
        <div className='text-[11px] text-gray-400'>{`設定${index + 1}`}</div>
        <div>{label}</div>
      </div>
    );
  }, []);

  const onSelectedConditionChange = (condition: PluginCondition | null) => {
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
      context={{
        onCopy: () => {
          console.log('copied');
          enqueueSnackbar('設定情報をコピーしました', { variant: 'success' });
        },
        onPaste: () => {
          enqueueSnackbar('設定情報を貼り付けました', { variant: 'success' });
          return null;
        },
        onPasteFailure: () => {
          enqueueSnackbar('設定情報の形式が正しくありません', { variant: 'error' });
        },
        onPasteValidation: (condition) => {
          try {
            validateCondition(condition);
          } catch (error) {
            return false;
          }
          return true;
        },
        onPasteValidationError: () => {
          enqueueSnackbar('設定情報の形式が正しくありません', { variant: 'error' });
        },
      }}
    />
  );
};

export default Sidebar;
