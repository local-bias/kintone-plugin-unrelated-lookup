import React, { FC } from 'react';
import { OneOf as KintoneField } from '@kintone/rest-api-client/lib/KintoneFields/types/field';
import { sanitize } from 'dompurify';

type ContainerProps = Readonly<{ field: KintoneField }>;

const Container: FC<ContainerProps> = ({ field }) => {
  if (!field) {
    return null;
  }
  switch (field.type) {
    case 'CREATOR':
    case 'MODIFIER':
      return <>{field.value.name}</>;
    case 'CHECK_BOX':
    case 'MULTI_SELECT':
    case 'CATEGORY':
      return (
        <>
          {field.value.map((value, i) => (
            <div key={i}>{value}</div>
          ))}
        </>
      );
    case 'MULTI_LINE_TEXT':
      return (
        <>
          {field.value.split(/\r?\n/g).map((text, i) => (
            <div key={i}>{text}</div>
          ))}
        </>
      );
    case 'USER_SELECT':
    case 'ORGANIZATION_SELECT':
    case 'GROUP_SELECT':
    case 'STATUS_ASSIGNEE':
      return (
        <>
          {field.value.map((value, i) => (
            <div key={i}>{value.name}</div>
          ))}
        </>
      );
    case 'FILE':
      return (
        <>
          {field.value.map((value, i) => (
            <div key={i}>{value.name}</div>
          ))}
        </>
      );
    case 'RICH_TEXT':
      const __html = sanitize(field.value);
      return <div dangerouslySetInnerHTML={{ __html }} />;
    case 'SUBTABLE':
      return <>{field.value.length}行</>;
    default:
      return <>{field.value}</>;
  }
};

export default Container;
