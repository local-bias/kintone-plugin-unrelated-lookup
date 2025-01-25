import { PLUGIN_NAME } from '@/lib/constants';
import { createConfig, migrateConfig } from '@/lib/plugin';
import { storeStorage } from '@konomi-app/kintone-utilities';
import { PluginFooterBundle } from '@konomi-app/kintone-utilities-react';
import { Button } from '@mui/material';
import { useAtomCallback } from 'jotai/utils';
import { useSnackbar } from 'notistack';
import { ChangeEventHandler, FC, useCallback, useState } from 'react';
import { pluginConfigAtom } from '../../../states/plugin';

const Container: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const onBackButtonClick = useCallback(() => history.back(), []);

  const onSaveButtonClick = useAtomCallback(
    useCallback(async (get) => {
      try {
        const storage = await get(pluginConfigAtom);

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
    }, [])
  );

  const onImportButtonClick: ChangeEventHandler<HTMLInputElement> = useAtomCallback(
    useCallback(async (_, set, event) => {
      try {
        const { files } = event.target;
        if (!files?.length) {
          return;
        }
        const [file] = Array.from(files);
        const fileEvent = await onFileLoad(file);
        const text = (fileEvent.target?.result ?? '') as string;
        set(pluginConfigAtom, migrateConfig(JSON.parse(text)));
        enqueueSnackbar('設定情報をインポートしました', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(
          '設定情報のインポートに失敗しました、ファイルに誤りがないか確認してください',
          { variant: 'error' }
        );
        throw error;
      }
    }, [])
  );

  const onExportButtonClick = useAtomCallback(
    useCallback(async (get) => {
      try {
        setLoading(true);
        const storage = await get(pluginConfigAtom);
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
    }, [])
  );

  const reset = useAtomCallback(
    useCallback((_, set) => {
      set(pluginConfigAtom, createConfig());
      enqueueSnackbar('設定をリセットしました', { variant: 'success' });
    }, [])
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
