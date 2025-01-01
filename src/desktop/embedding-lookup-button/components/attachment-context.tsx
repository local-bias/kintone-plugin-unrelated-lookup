import { createContext, useContext, type FC, type ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { AttachmentProps } from '../app';

type ContextType = AttachmentProps;

const Context = createContext<ContextType | undefined>(undefined);

type InProviderProps = {};

type ProviderProps = Omit<ContextType, keyof InProviderProps> & {
  children: ReactNode;
};

export const AttachmentPropsProvider: FC<ProviderProps> = (props) => {
  const { children, ...rest } = props;
  return <Context.Provider value={{ ...rest }}>{children}</Context.Provider>;
};

export const useAttachmentProps = () => {
  const context = useContext(Context);
  invariant(
    context,
    `${useAttachmentProps.name} must be used within a ${AttachmentPropsProvider.displayName}`
  );
  return context;
};

export const useConditionId = () => {
  const context = useContext(Context);
  invariant(
    context,
    `${useConditionId.name} must be used within a ${AttachmentPropsProvider.displayName}`
  );
  return context.conditionId;
};
