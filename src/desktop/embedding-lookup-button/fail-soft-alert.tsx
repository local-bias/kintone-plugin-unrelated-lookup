import { useAtomValue } from 'jotai';
import { type FC } from 'react';
import { failSoftModeAtom } from '../states';
import { useAttachmentProps } from './components/attachment-context';
import { css } from '@emotion/css';
import { Tooltip } from '@mui/material';

const FailSoftAlert: FC = () => {
  const { conditionId } = useAttachmentProps();
  const failSoftMode = useAtomValue(failSoftModeAtom(conditionId));

  if (!failSoftMode) {
    return null;
  }

  return (
    <div
      className={css`
        box-sizing: border-box;
        position: absolute;
        top: 16px;
        right: 16px;
        border-radius: 9999px;
        background-color: #ffedd5;
        padding: 4px;
      `}
    >
      <Tooltip title='フェールソフトモードが起動しました。プラグインの設定に誤りがある可能性があります。'>
        <div>🚨</div>
      </Tooltip>
    </div>
  );
};

export default FailSoftAlert;
