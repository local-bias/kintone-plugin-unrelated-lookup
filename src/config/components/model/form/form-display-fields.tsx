import { cn } from '@/lib/utils';
import { PluginCondition } from '@/schema/plugin-config';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  JotaiDndContext,
  JotaiSortableContext,
  useArray,
} from '@konomi-app/kintone-utilities-jotai';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Skeleton, Tooltip } from '@mui/material';
import { useAtomValue } from 'jotai';
import { GripVertical } from 'lucide-react';
import { nanoid } from 'nanoid';
import { FC, FCX, Suspense } from 'react';
import { displayFieldsAtom } from '../../../states/plugin';
import SelectSrcFields from './select-src-fields';

type DisplayField = PluginCondition['displayFields'][number];

const Row: FC<{
  displayField: DisplayField;
  index: number;
  onFieldChange: (index: number, row: DisplayField) => void;
  addRow: (index: number) => void;
  deleteRow: (index: number) => void;
  deletable: boolean;
}> = ({ displayField, index, onFieldChange, addRow, deleteRow, deletable }) => {
  const {
    isDragging,
    setActivatorNodeRef,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: displayField.id });

  return (
    <div
      ref={setNodeRef}
      className={cn('flex items-center gap-4', {
        'z-50': isDragging,
      })}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div
        className='grid place-items-center p-4 outline-none'
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        tabIndex={-1}
      >
        <GripVertical className='w-5 h-5 text-gray-400' />
      </div>
      <SelectSrcFields
        label='表示するフィールド'
        fieldCode={displayField.fieldCode}
        onChange={(code) => onFieldChange(index, { ...displayField, fieldCode: code })}
        disabled={displayField.isLookupField}
      />
      <Tooltip title='表示フィールドを追加する'>
        <IconButton size='small' onClick={() => addRow(index)}>
          <AddIcon fontSize='small' fill='#0006' />
        </IconButton>
      </Tooltip>
      {!displayField.isLookupField && deletable && (
        <Tooltip title='この表示フィールドを削除する'>
          <IconButton size='small' onClick={() => deleteRow(index)}>
            <DeleteIcon fontSize='small' fill='#0006' />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

const Component: FCX = () => {
  const displayFields = useAtomValue(displayFieldsAtom);
  const { addItem, deleteItem, updateItem } = useArray(displayFieldsAtom);

  const addRow = (index: number) =>
    addItem({ index: index + 1, newItem: { id: nanoid(), fieldCode: '', isLookupField: false } });

  const changeRow = (index: number, row: DisplayField) => updateItem({ index, newItem: row });

  return (
    <div className='flex flex-col gap-4'>
      {displayFields.map((value, i) => (
        <Row
          key={value.id}
          displayField={value}
          index={i}
          deletable={displayFields.length > 1}
          onFieldChange={changeRow}
          addRow={addRow}
          deleteRow={deleteItem}
        />
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

const DnDContainer: FC = () => {
  return (
    <>
      <JotaiDndContext atom={displayFieldsAtom}>
        <JotaiSortableContext atom={displayFieldsAtom}>
          <Container />
        </JotaiSortableContext>
      </JotaiDndContext>
    </>
  );
};

export default DnDContainer;
