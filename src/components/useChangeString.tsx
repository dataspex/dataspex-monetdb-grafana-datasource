import { useCallback } from 'react';
import type { MyQuery } from '../types';
import type { ChangeOptions, EditorProps } from './types';

type OnChangeType = (value: string) => void;

export function useChangeString(props: EditorProps, options: ChangeOptions<MyQuery>): OnChangeType {
  const { onChange, onRunQuery, query } = props;
  const { propertyName, runQuery } = options;

  return useCallback(
    (value: string) => {
      if (!value) {
        return;
      }

      onChange({
        ...query,
        [propertyName]: value,
      });

      if (runQuery) {
        onRunQuery();
      }
    },
    [onChange, onRunQuery, query, propertyName, runQuery]
  );
}
