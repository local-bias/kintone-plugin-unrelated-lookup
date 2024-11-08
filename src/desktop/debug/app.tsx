import { restorePluginConfig } from '@/lib/plugin';
import { Provider, useAtomValue } from 'jotai';
import React, { type FC } from 'react';
import { cacheAtom } from '../states';
import JsonView from '@uiw/react-json-view';
import { cn } from '@/lib/utils';
import { css } from '@emotion/css';
import { alreadyCacheAtom, isRecordCacheEnabledAtom } from '../embedding-lookup-button/states';
import { srcAllRecordsAtom } from '../embedding-lookup-button/states/records';
import { isDialogShownAtom } from '../embedding-lookup-button/states/dialog';
import { store } from '@/lib/store';

const Condition: FC<{ condition: Plugin.Condition }> = ({ condition }) => {
  const id = condition.id;
  const cache = useAtomValue(cacheAtom(id));
  const isRecordCacheComplete = useAtomValue(alreadyCacheAtom(id));
  const allSrcRecords = useAtomValue(srcAllRecordsAtom(id));
  const isRecordCacheEnabled = useAtomValue(isRecordCacheEnabledAtom(id));
  const isDialogShown = useAtomValue(isDialogShownAtom(id));

  return (
    <div>
      <JsonView
        value={{
          id: condition.id,
          cache,
          isRecordCacheComplete,
          isRecordCacheEnabled,
          srcRecordsLength: allSrcRecords.length,
          isDialogShown,
        }}
      />
    </div>
  );
};

const Component: FC = () => {
  const pluginConfig = restorePluginConfig();

  return (
    <Provider store={store}>
      <div
        className={cn(
          '🐸',
          css`
            --w-rjv-color: #9cdcfe;
            --w-rjv-key-number: #268bd2;
            --w-rjv-key-string: #9cdcfe;
            --w-rjv-background-color: #1e1e1e;
            --w-rjv-line-color: #36334280;
            --w-rjv-arrow-color: #838383;
            --w-rjv-edit-color: #9cdcfe;
            --w-rjv-info-color: #9c9c9c7a;
            --w-rjv-update-color: #9cdcfe;
            --w-rjv-copied-color: #9cdcfe;
            --w-rjv-copied-success-color: #28a745;
            --w-rjv-curlybraces-color: #d4d4d4;
            --w-rjv-colon-color: #d4d4d4;
            --w-rjv-brackets-color: #d4d4d4;
            --w-rjv-ellipsis-color: #cb4b16;
            --w-rjv-quotes-color: #9cdcfe;
            --w-rjv-quotes-string-color: #ce9178;
            --w-rjv-type-string-color: #ce9178;
            --w-rjv-type-int-color: #b5cea8;
            --w-rjv-type-float-color: #b5cea8;
            --w-rjv-type-bigint-color: #b5cea8;
            --w-rjv-type-boolean-color: #569cd6;
            --w-rjv-type-date-color: #b5cea8;
            --w-rjv-type-url-color: #3b89cf;
            --w-rjv-type-null-color: #569cd6;
            --w-rjv-type-nan-color: #859900;
            --w-rjv-type-undefined-color: #569cd6;
          `
        )}
      >
        <div className='fixed left-full top-0 z-10 w-[25dvw] box-border p-4 bg-gray-900 text-white h-[125dvh] overflow-auto'>
          <div className='flex gap-2'>
            <div className='text-3xl'>🐛</div>
            <div className='mb-4 text-sm text-green-300 font-bold'>
              Plugin Debug Menu
              <div className='text-xs'>(Not displayed in production)</div>
            </div>
          </div>
          {pluginConfig.conditions.map((condition) => (
            <Condition key={condition.id} condition={condition} />
          ))}
        </div>
      </div>
    </Provider>
  );
};

export default Component;
