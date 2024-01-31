import React, { ChangeEvent } from 'react';
import { InlineField, TextArea } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const onQueryTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...query, queryText: event.target.value });
  };

  const { queryText } = query;

  return (
    <div className="gf-form" style={{width: 400, height: 400}}>
      <InlineField label="Query Text" labelWidth={16} tooltip="Not used yet">
        <TextArea onChange={onQueryTextChange} value={queryText || ''} style={{width: 399, height: 399}}/>
      </InlineField>
    </div>
  );
}
