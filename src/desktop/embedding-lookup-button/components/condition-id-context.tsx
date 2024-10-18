import React, { createContext, useContext, type FC, type ReactNode } from 'react';
import invariant from 'tiny-invariant';

type ContextType = {
  conditionId: string;
};

const Context = createContext<ContextType | undefined>(undefined);

type InProviderProps = {};

type ProviderProps = Omit<ContextType, keyof InProviderProps> & {
  children: ReactNode;
};

export const ConditionIdProvider: FC<ProviderProps> = (props) => {
  const { children, ...rest } = props;

  return <Context.Provider value={{ ...rest }}>{children}</Context.Provider>;
};

export const useConditionId = () => {
  const context = useContext(Context);
  invariant(
    context,
    `${useConditionId.name} must be used within a ${ConditionIdProvider.displayName}`
  );
  return context.conditionId;
};
