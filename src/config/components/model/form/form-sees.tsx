import { IconButton, Skeleton, Tooltip } from '@mui/material';
import React, { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { seesState } from '../../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { produce } from 'immer';

import SelectSrcFields from './select-src-fields';

const Component: FCX = () => {
  const sees = useRecoilValue(seesState);

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number, value: string) => {
        set(seesState, (current) =>
          produce(current, (draft) => {
            draft[rowIndex] = value;
          })
        );
      },
    []
  );

  const addField = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number) => {
        set(seesState, (current) =>
          produce(current, (draft) => {
            draft.splice(rowIndex + 1, 0, '');
          })
        );
      },
    []
  );

  const removeField = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number) => {
        set(seesState, (current) =>
          produce(current, (draft) => {
            draft.splice(rowIndex, 1);
          })
        );
      },
    []
  );

  return (
    <div className='flex flex-col gap-4'>
      {sees.map((value, i) => (
        <div key={i} className='flex items-center gap-2'>
          <SelectSrcFields
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
              <Skeleton variant='rounded' width={350} height={56} />
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
