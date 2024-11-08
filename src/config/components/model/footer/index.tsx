import React, { FC, useState, FCX, useCallback, ChangeEventHandler } from 'react';
import { useRecoilCallback } from 'recoil';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import { PluginFooterBundle } from '@konomi-app/kintone-utilities-react';

import { storeStorage } from '@konomi-app/kintone-utilities';

import { storageState } from '../../../states/plugin';

import { PLUGIN_NAME } from '@/lib/statics';
import { createConfig, migrateConfig } from '@/lib/plugin';

const Container: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const onBackButtonClick = useCallback(() => history.back(), []);

  const onSaveButtonClick = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          const storage = await snapshot.getPromise(storageState);

          storeStorage(storage!, () => true);
          enqueueSnackbar('設定を保存しました', {
            variant: 'success',
            action: (
              <Button color='inherit' size='small' variant='outlined' onClick={onBackButtonClick}>
                プラグイン一覧に戻る
              </Button>
            ),
          });
        } finally {
          setLoading(false);
        }
      },
    []
  );

  const onImportButtonClick: ChangeEventHandler<HTMLInputElement> = useRecoilCallback(
    ({ set }) =>
      async (event) => {
        try {
          const { files } = event.target;
          if (!files?.length) {
            return;
          }
          const [file] = Array.from(files);
          const fileEvent = await onFileLoad(file);
          const text = (fileEvent.target?.result ?? '') as string;
          set(storageState, migrateConfig(JSON.parse(text)));
          enqueueSnackbar('設定情報をインポートしました', { variant: 'success' });
        } catch (error) {
          enqueueSnackbar(
            '設定情報のインポートに失敗しました、ファイルに誤りがないか確認してください',
            { variant: 'error' }
          );
          throw error;
        }
      },
    []
  );

  const onExportButtonClick = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          setLoading(true);
          const storage = await snapshot.getPromise(storageState);
          const blob = new Blob([JSON.stringify(storage, null)], {
            type: 'application/json',
          });
          const url = (window.URL || window.webkitURL).createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${PLUGIN_NAME}-config.json`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          enqueueSnackbar('プラグインの設定情報をエクスポートしました', { variant: 'success' });
        } catch (error) {
          enqueueSnackbar(
            'プラグインの設定情報のエクスポートに失敗しました。プラグイン開発者にお問い合わせください。',
            { variant: 'error' }
          );
          throw error;
        } finally {
          setLoading(false);
        }
      },
    []
  );

  const reset = useRecoilCallback(
    ({ set }) =>
      () => {
        set(storageState, createConfig());
        enqueueSnackbar('設定をリセットしました', { variant: 'success' });
      },
    []
  );

  return (
    <PluginFooterBundle
      {...{
        loading,
        onSaveButtonClick,
        onImportButtonClick,
        onExportButtonClick,
        reset,
        onBackButtonClick,
      }}
    />
  );
};

export default Container;

const onFileLoad = (file: File | Blob, encoding = 'UTF-8') => {
  return new Promise<ProgressEvent<FileReader>>((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.readAsText(file, encoding);

      reader.onload = (event) => resolve(event);
      reader.onerror = (event) => reject(event);
    } catch (error) {
      reject(error);
    }
  });
};
