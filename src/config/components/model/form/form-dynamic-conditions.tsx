import { getConditionPropertyAtom } from '@/config/states/plugin';
import { ArrowRight } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { useAtomValue } from 'jotai';
import { Suspense, type FC } from 'react';

const state = getConditionPropertyAtom('dynamicConditions');

const DynamicConditionsFormComponent: FC = () => {
  const dynamicConditions = useAtomValue(state);

  return (
    <Tooltip title='この機能は拡張ルックアップ プラスでのみご利用いただけます'>
      <div className='grid gap-4'>
        {new Array(2).fill('').map((_, index) => (
          <div key={index} className='flex items-center gap-4'>
            <TextField label='検索の値として使用するフィールド' sx={{ width: '350px' }} disabled />
            <ArrowRight />
            <TextField label='検索対象フィールド' sx={{ width: '350px' }} disabled />
            <Tooltip title='動的絞り込みを追加する'>
              <IconButton disabled size='small'>
                <AddIcon fontSize='small' fill='#0006' />
              </IconButton>
            </Tooltip>
            {dynamicConditions.length > 1 && (
              <Tooltip title='この条件を削除する'>
                <IconButton disabled size='small'>
                  <DeleteIcon fontSize='small' fill='#0006' />
                </IconButton>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
    </Tooltip>
  );
};

const DynamicConditionsForm: FC = () => (
  <div>
    <Suspense>
      <DynamicConditionsFormComponent />
    </Suspense>
  </div>
);

export default DynamicConditionsForm;
