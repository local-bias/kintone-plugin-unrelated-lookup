import { store } from '@/lib/store';
import { cn } from '@/lib/utils';
import { PluginCondition } from '@/schema/plugin-config';
import { css } from '@emotion/css';
import { getCurrentRecord, kintoneAPI } from '@konomi-app/kintone-utilities';
import { Fab } from '@mui/material';
import JsonView from '@uiw/react-json-view';
import { Provider, useAtomValue } from 'jotai';
import { memo, useEffect, useMemo, useState, type FC } from 'react';
import { AttachmentProps } from '../embedding-lookup-button/app';
import {
  alreadyCacheAtom,
  isRecordCacheEnabledAtom,
  searchInputAtom,
} from '../embedding-lookup-button/states';
import { isDialogShownAtom } from '../embedding-lookup-button/states/dialog';
import { srcAllHandledRecordsAtom } from '../embedding-lookup-button/states/records';
import {
  isAlreadyLookupedAtom,
  isCacheStartedAtom,
  pluginConfigAtom,
  valueAtLookupAtom,
  valueAtStartAtom,
} from '../states';

const Attachment: FC<AttachmentProps> = memo((props) => {
  const valueAtStart = useAtomValue(valueAtStartAtom(props));
  const valueAtLookup = useAtomValue(valueAtLookupAtom(props));
  const isDialogShown = useAtomValue(isDialogShownAtom(props));
  const isAlreadyLookuped = useAtomValue(isAlreadyLookupedAtom(props));
  const searchInput = useAtomValue(searchInputAtom(props));

  return (
    <JsonView
      value={{
        ...props,
        値: {
          開始時: valueAtStart,
          ルックアップ時: valueAtLookup,
        },
        isDialogShown,
        isAlreadyLookuped,
        ダイアログ: {
          入力値: searchInput,
        },
      }}
    />
  );
});

const SubtableMode: FC<{ condition: PluginCondition }> = ({ condition }) => {
  const [record, setRecord] = useState<kintoneAPI.RecordData | null>(null);

  useEffect(() => {
    const current = getCurrentRecord();
    if (current?.record) {
      setRecord(current.record);
    }
  }, []);

  if (!record) {
    return null;
  }

  const subtable = record[condition.dstSubtableFieldCode] as kintoneAPI.field.Subtable;

  return (
    <div>
      {subtable.value.map(({ value }, i) => (
        <Attachment key={i} conditionId={condition.id} rowIndex={i} />
      ))}
    </div>
  );
};

const SingleTypeCondition: FC<{ condition: PluginCondition }> = ({ condition }) => {
  return <Attachment conditionId={condition.id} />;
};

const Condition: FC<{ condition: PluginCondition }> = ({ condition }) => {
  const id = useMemo(() => condition.id, [condition.id]);
  const isRecordCacheComplete = useAtomValue(alreadyCacheAtom(id));
  const allSrcRecords = useAtomValue(srcAllHandledRecordsAtom(id));
  const isRecordCacheEnabled = useAtomValue(isRecordCacheEnabledAtom(id));
  const isCacheStarted = useAtomValue(isCacheStartedAtom(id));

  return (
    <div>
      <details>
        <summary>
          {condition.id}({condition.type})
        </summary>
        <JsonView
          value={{
            キャッシュ: {
              設定: isRecordCacheEnabled ? '有効' : '無効',
              ステータス: isRecordCacheComplete ? '完了' : isCacheStarted ? '開始' : '開始前',
              件数: allSrcRecords.length,
            },
          }}
        />
        {condition.type === 'single' ? (
          <SingleTypeCondition condition={condition} />
        ) : (
          <SubtableMode condition={condition} />
        )}
      </details>
    </div>
  );
};

const DebugContent: FC = memo(() => {
  const pluginConfig = useAtomValue(pluginConfigAtom);
  return (
    <div>
      {pluginConfig.conditions.map((condition) => (
        <Condition key={condition.id} condition={condition} />
      ))}
    </div>
  );
});

const DebugContainer: FC = () => {
  const [shown, setShown] = useState(false);

  const onButtonClick = () => {
    setShown((prev) => !prev);
  };

  return (
    <Provider store={store}>
      <div className='🐸'>
        <div
          className={cn(
            'transition-all opacity-100 fixed right-0 top-0 z-40 bg-white/60 backdrop-blur-sm text-gray-800 p-4 overflow-auto h-screen',
            {
              'opacity-0 pointer-events-none': !shown,
            },
            css`
              --w-rjv-background-color: transparent;
            `
          )}
        >
          <div className='box-border p-4 overflow-auto'>
            <div className='mb-4 text-sm text-green-800 font-bold'>
              Plugin Debug Menu
              <span className='text-xs'>(Not displayed in production)</span>
            </div>
            {shown && <DebugContent />}
          </div>
        </div>
        <Fab
          onClick={onButtonClick}
          color='warning'
          size='small'
          className='fixed right-3 bottom-3 z-50'
        >
          🐛
        </Fab>
      </div>
    </Provider>
  );
};

export default DebugContainer;
