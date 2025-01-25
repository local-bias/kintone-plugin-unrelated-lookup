import { getNewCondition } from '@/lib/plugin';
import { PluginCondition } from '@/schema/plugin-config';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { JotaiFieldSelect, useArray } from '@konomi-app/kintone-utilities-jotai';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormControlLabel, IconButton, Skeleton, Switch, Tooltip } from '@mui/material';
import { produce } from 'immer';
import { Atom, PrimitiveAtom, useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { FC, FCX, Suspense, useCallback } from 'react';
import SelectSrcFields from '../select-src-fields';

type Props = {
  appPropertiesAtom: Atom<Promise<kintoneAPI.FieldProperty[]>>;
  copiesAtom: PrimitiveAtom<PluginCondition['copies'] | PluginCondition['insubtableCopies']>;
};

const Component: FCX<Props> = ({ appPropertiesAtom, copiesAtom }) => {
  const copies = useAtomValue(copiesAtom);
  const { addItem, deleteItem } = useArray(copiesAtom);

  const onCopyFromChange = useAtomCallback(
    useCallback((_, set, rowIndex: number, value: string) => {
      set(copiesAtom, (current) =>
        produce(current, (draft) => {
          draft[rowIndex].from = value;
        })
      );
    }, [])
  );

  const onCopyToChange = useAtomCallback(
    useCallback((_, set, rowIndex: number, value: string) => {
      set(copiesAtom, (current) =>
        produce(current, (draft) => {
          draft[rowIndex].to = value;
        })
      );
    }, [])
  );

  const onDisabledChange = useAtomCallback(
    useCallback((_, set, rowIndex: number, value: boolean) => {
      set(copiesAtom, (current) =>
        produce(current, (draft) => {
          draft[rowIndex].disabled = value;
        })
      );
    }, [])
  );

  return (
    <div className='flex flex-col gap-4'>
      {copies.map(({ from, to }, i) => (
        <div key={i} className='flex items-center gap-2'>
          <SelectSrcFields
            label='コピー元'
            fieldCode={from}
            onChange={(code) => onCopyFromChange(i, code)}
          />
          <ArrowForwardIcon />
          <JotaiFieldSelect
            sx={{ width: 320 }}
            label='コピー先'
            fieldPropertiesAtom={appPropertiesAtom}
            fieldCode={to}
            onChange={(code) => onCopyToChange(i, code)}
          />
          <FormControlLabel
            sx={{ whiteSpace: 'nowrap', ml: '16px' }}
            control={
              <Switch
                checked={copies[i].disabled}
                onChange={(_, checked) => onDisabledChange(i, checked)}
              />
            }
            label='編集を禁止する'
          />
          <Tooltip title='コピー設定を追加する'>
            <IconButton
              size='small'
              onClick={() =>
                addItem({
                  index: i + 1,
                  newItem: getNewCondition().copies[0],
                })
              }
            >
              <AddIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          {copies.length > 1 && (
            <Tooltip title='このコピー設定を削除する'>
              <IconButton size='small' onClick={() => deleteItem(i)}>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

const ConditionCopiesForm: FC<Props> = (props) => {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Skeleton variant='rounded' width={350} height={56} />
            <ArrowForwardIcon />
            <Skeleton variant='rounded' width={350} height={56} />
            <AddIcon fontSize='small' />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton variant='rounded' width={350} height={56} />
            <ArrowForwardIcon />
            <Skeleton variant='rounded' width={350} height={56} />
            <AddIcon fontSize='small' />
          </div>
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default ConditionCopiesForm;
