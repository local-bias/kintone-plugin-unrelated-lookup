import { IconButton, Skeleton, Tooltip } from '@mui/material';
import React, { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { seesState } from '../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import produce from 'immer';

import SelectSrcFields from '../form/condition/select-src-fields';
import { useConditionIndex } from './condition-index-provider';

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
              <AddIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          {sees.length > 1 && (
            <Tooltip title='この表示フィールドを削除する'>
              <IconButton size='small' onClick={() => removeField(i)}>
                <DeleteIcon fontSize='small' />
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 380px)', gap: '8px' }}>
          <Skeleton height={56} />
          <Skeleton height={56} />
          <Skeleton height={56} />
          <Skeleton height={56} />
          <Skeleton height={56} />
          <Skeleton height={56} />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

export default memo(Container);
