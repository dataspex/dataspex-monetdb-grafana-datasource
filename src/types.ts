import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  queryText?: string;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  queryText: "SELECT current_timestamp(), 42"
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  username?: string;
  hostname?: string;
  port?: number;
  database?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  password?: string;
}
