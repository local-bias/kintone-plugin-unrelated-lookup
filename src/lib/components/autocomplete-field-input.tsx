import React, { FC, useCallback } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import { kintoneAPI } from '@konomi-app/kintone-utilities/dist/types/api';

type ContainerProps = {
  fields: kintoneAPI.FieldProperty[];
  fieldCode: string;
  onChange: (code: string) => void;
  label?: string;
  disabled?: boolean;
};

type Props = {
  value: kintoneAPI.FieldProperty | null;
  fields: kintoneAPI.FieldProperty[];
  onFieldChange: (_: any, field: kintoneAPI.FieldProperty | null) => void;
  label: string;
  disabled?: boolean;
};

const Component: FC<Props> = ({ fields, value, onFieldChange, label, disabled }) => (
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
    disabled={disabled}
  />
);

const Container: FC<ContainerProps> = (props) => {
  const value = props.fields.find((field) => field.code === props.fieldCode) ?? null;

  const onFieldChange = useCallback(
    (_: any, field: kintoneAPI.FieldProperty | null) => {
      props.onChange(field?.code ?? '');
    },
    [props.onChange]
  );

  return (
    <Component
      {...{
        onFieldChange,
        value,
        fields: props.fields,
        label: props.label ?? '対象フィールド',
        disabled: props.disabled,
      }}
    />
  );
};

export const AutocompleteKintoneField = Container;
