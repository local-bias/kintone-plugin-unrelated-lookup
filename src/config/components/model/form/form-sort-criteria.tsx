import { srcAppPropertiesState } from '@/config/states/kintone';
import { sortCriteriaState } from '@/config/states/plugin';
import { RecoilFieldSelect, useArray } from '@konomi-app/kintone-utilities-recoil';
import { IconButton, MenuItem, TextField, Tooltip } from '@mui/material';
import { type FC } from 'react';
import { useRecoilValue } from 'recoil';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const SortOrder = [
  { label: '昇順', value: 'asc' },
  { label: '降順', value: 'desc' },
] as const;

const SortCriteriaForm: FC = () => {
  const sortCriteria = useRecoilValue(sortCriteriaState);
  const { addItem, deleteItem, updateItem } = useArray(sortCriteriaState);

  return (
    <div className='grid gap-4'>
      {sortCriteria.map((criteria, index) => (
        <div key={index} className='flex items-center gap-4'>
          <RecoilFieldSelect
            label='対象フィールド'
            state={srcAppPropertiesState}
            fieldCode={criteria.fieldCode}
            onChange={(fieldCode) => updateItem({ index, newItem: { ...criteria, fieldCode } })}
          />
          <TextField
            select
            label='並び順'
            value={criteria.order}
            onChange={(e) => {
              updateItem({
                index,
                newItem: {
                  ...criteria,
                  order: e.target.value as (typeof SortOrder)[number]['value'],
                },
              });
            }}
          >
            {SortOrder.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Tooltip title='並び替え条件を追加する'>
            <IconButton
              size='small'
              onClick={() =>
                addItem({ index: index + 1, newItem: { fieldCode: '', order: 'asc' } })
              }
            >
              <AddIcon fontSize='small' fill='#0006' />
            </IconButton>
          </Tooltip>
          {sortCriteria.length > 1 && (
            <Tooltip title='この条件を削除する'>
              <IconButton size='small' onClick={() => deleteItem(index)}>
                <DeleteIcon fontSize='small' fill='#0006' />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

export default SortCriteriaForm;
