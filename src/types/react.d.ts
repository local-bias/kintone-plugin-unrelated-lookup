import React from 'react';

declare module 'react' {
  /** classNameを追加したファンクションコンポーネント型 */
  type FCX<P = Record<string, unknown>> = React.FunctionComponent<P & { className?: string }>;

  /** 子コンポーネントを含むファンクションコンポーネント型 */
  type FCwC<P = Record<string, unknown>> = FCX<P & { children?: React.ReactNode }>;
}
