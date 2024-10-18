import { restorePluginConfig } from '@/lib/plugin';
import { useAtomValue } from 'jotai';
import React, { type FC } from 'react';
import { cacheAtom } from '../states';
import JsonView from '@uiw/react-json-view';
import { cn } from '@/lib/utils';
import { css } from '@emotion/css';

const Condition: FC<{ condition: Plugin.Condition }> = ({ condition }) => {
  const cache = useAtomValue(cacheAtom(condition.id));

  return (
    <div>
      <JsonView value={{ id: condition.id, cache }} />
    </div>
  );
};

const Component: FC = () => {
  const pluginConfig = restorePluginConfig();

  return (
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
      <div className='z-10 bg-gray-900 text-white h-dvh overflow-auto sticky top-12'>
        <div className='mb-4 text-sm'>🐛 Debug Menu (Not displayed in production)</div>
        {pluginConfig.conditions.map((condition) => (
          <Condition key={condition.id} condition={condition} />
        ))}
      </div>
    </div>
  );
};

export default Component;
