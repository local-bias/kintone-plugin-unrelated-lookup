import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import { useAtomValue } from 'jotai';
import { FC, FCX } from 'react';
import { useAttachmentProps } from './attachment-context';
import { isAlreadyLookupedAtom } from '@/desktop/states';
import { isMobile } from '@konomi-app/kintone-utilities';

type Props = Readonly<{ visible: boolean }>;

const LookupStatusBadgeComponent: FCX<Props> = ({ className }) => (
  <div {...{ className }} data-is-mobile={isMobile() ? '' : undefined}>
    <CheckIcon />
  </div>
);

const StyledLookupStatusBadgeComponent = styled(LookupStatusBadgeComponent)`
  position: absolute;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  transform: ${({ visible }) => (visible ? 'scale(1)' : 'scale(0)')};
  transition: transform 0.2s ease;

  right: 120px;
  top: -8px;
  width: 24px;
  height: 24px;
  background-color: #80beaf;
  color: #fff;

  &[data-is-mobile] {
    right: 0;
    top: -8px;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const LookupStatusBadgeContainer: FC = () => {
  const attachmentProps = useAttachmentProps();
  const visible = useAtomValue(isAlreadyLookupedAtom(attachmentProps));
  return <StyledLookupStatusBadgeComponent {...{ visible }} />;
};

export default LookupStatusBadgeContainer;
