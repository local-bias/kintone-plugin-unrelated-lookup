import { IconButton, Skeleton, Tooltip } from '@mui/material';
import React, { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { seesState } from '../../../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { produce } from 'immer';

import SelectSrcFields from './select-src-fields';
import { useConditionIndex } from '../../../functional/condition-index-provider';

const Component: FCX = () => {
  const conditionIndex = useConditionIndex();
  const sees = useRecoilValue(seesState(conditionIndex));

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number, value: string) => {
        set(seesState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft[rowIndex] = value;
          })
        );
      },
    [conditionIndex]
  );

  const addField = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number) => {
        set(seesState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft.splice(rowIndex + 1, 0, '');
          })
        );
      },
    [conditionIndex]
  );

  const removeField = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number) => {
        set(seesState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft.splice(rowIndex, 1);
          })
        );
      },
    [conditionIndex]
  );

  return (
    <div className='rows'>
      {sees.map((value, i) => (
        <div key={i}>
          <SelectSrcFields
            conditionIndex={conditionIndex}
            label='表示するフィールド'
            fieldCode={value}
            onChange={(code) => onFieldChange(i, code)}
          />
          <Tooltip title='表示フィールドを追加する'>
            <IconButton size='small' onClick={() => addField(i)}>
              <AddIcon fontSize='small' fill='#0006' />
            </IconButton>
          </Tooltip>
          {sees.length > 1 && (
            <Tooltip title='この表示フィールドを削除する'>
              <IconButton size='small' onClick={() => removeField(i)}>
                <DeleteIcon fontSize='small' fill='#0006' />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

const Container: FC = () => {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col gap-2'>
          {new Array(3).fill('').map((_, i) => (
            <div key={i} className='flex gap-2 items-center'>
              <Skeleton width={350} height={56} />
              <AddIcon fontSize='small' fill='#0006' />
            </div>
          ))}
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

export default memo(Container);
