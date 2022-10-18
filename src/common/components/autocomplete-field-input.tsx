import React, { FC, useCallback } from 'react';
import { TextField, Autocomplete } from '@mui/material';

import { kx } from '@type/kintone.api';

type ContainerProps = {
  fields: kx.FieldProperty[];
  fieldCode: string;
  onChange: (code: string) => void;
  label?: string;
};

type Props = {
  value: kx.FieldProperty | null;
  fields: kx.FieldProperty[];
  onFieldChange: (_: any, field: kx.FieldProperty | null) => void;
  label: string;
};

const Component: FC<Props> = ({ fields, value, onFieldChange, label }) => (
  <Autocomplete
    value={value}
    sx={{ width: '350px' }}
    options={fields}
    isOptionEqualToValue={(option, v) => option.code === v.code}
    getOptionLabel={(option) => `${option.label}(${option.code})`}
    onChange={onFieldChange}
    renderInput={(params) => (
      <TextField {...params} label={label} variant='outlined' color='primary' />
    )}
  />
);

const Container: FC<ContainerProps> = (props) => {
  const value = props.fields.find((field) => field.code === props.fieldCode) ?? null;

  const onFieldChange = useCallback(
    (_: any, field: kx.FieldProperty | null) => {
      props.onChange(field?.code ?? '');
    },
    [props.onChange]
  );

  return (
    <Component
      {...{ onFieldChange, value, fields: props.fields, label: props.label ?? '対象フィールド' }}
    />
  );
};

export const AutocompleteKintoneField = Container;
