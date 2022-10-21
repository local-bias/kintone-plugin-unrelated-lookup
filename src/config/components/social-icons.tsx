import React, { FC, FCX } from 'react';
import styled from '@emotion/styled';
import { Button, Fab, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import HomeIcon from '@mui/icons-material/Home';

import { URL_HOMEPAGE, URL_TWITTER, URL_GITHUB } from '@common/statics';

import GradientButton from './gradient-button';

const openNewTab = (path: string) => window.open(path, '_blank');

const Icon: FC<{ children: React.ReactNode; title: string; url: string }> = ({
  children,
  title,
  url,
}) => (
  <Tooltip title={title} aria-label={title}>
    <Fab size='small' onClick={() => openNewTab(url)}>
      {children as any}
    </Fab>
  </Tooltip>
);

const Component: FCX = ({ className }) => (
  <aside className={className}>
    <Icon title='ホームページ' url={URL_HOMEPAGE}>
      <HomeIcon />
    </Icon>
    <Icon title='ツイッター' url={URL_TWITTER}>
      <TwitterIcon />
    </Icon>
    <Icon title='GitHub' url={URL_GITHUB}>
      <GitHubIcon />
    </Icon>
    <Button
      color='inherit'
      variant='contained'
      disableElevation={true}
      onClick={() => openNewTab('https://form.konomi.app')}
    >
      お問い合わせ
    </Button>
    <div>
      <GradientButton onClick={() => openNewTab('https://kula.konomi.app')}>
        kintoneでブログが書けます
      </GradientButton>
    </div>
  </aside>
);

const StyledComponent = styled(Component)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  & > button {
    color: #78909c;
    box-shadow: none;
  }
`;

export default StyledComponent;
