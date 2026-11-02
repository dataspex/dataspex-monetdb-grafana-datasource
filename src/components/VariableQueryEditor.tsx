import React from 'react';
import { TextArea } from '@grafana/ui';
// import { DataQuery } from '@grafana/data';

export interface MonetDBVariableQuery /* extends DataQuery */ {
    refId: string;
    queryText: string;
}

interface Props {
  query: MonetDBVariableQuery;
  onChange: (query: MonetDBVariableQuery, definition: string) => void;
}

export function VariableQueryEditor({ query, onChange }: Props) {
  const handleChange = (queryText: string) => {
    onChange(
      { ...query, queryText },
      queryText
    );
  };

  return (
    <TextArea
      aria-label="MonetDB SQL query"
      placeholder="SELECT value FROM my_table"
      value={query.queryText ?? ''}
      onChange={(event) => handleChange(event.currentTarget.value)}
      rows={5}
    />
  );
}

