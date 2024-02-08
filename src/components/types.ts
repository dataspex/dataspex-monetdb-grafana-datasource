import type { QueryEditorProps } from '@grafana/data';
import type { DataSource } from 'datasource';
import type { MyDataSourceOptions, MyQuery } from '../types';

export type EditorProps = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export type ChangeOptions<T> = {
  propertyName: keyof T;
};
