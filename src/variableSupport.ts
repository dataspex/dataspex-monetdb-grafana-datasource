
import {
  CustomVariableSupport,
  DataQueryRequest,
  DataQueryResponse,
  // MetricFindValue,
} from '@grafana/data';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataSource } from './datasource';
import {
  MonetDBVariableQuery,
  VariableQueryEditor,
} from './components/VariableQueryEditor';

export class MonetDBVariableSupport extends CustomVariableSupport<
  DataSource,
  MonetDBVariableQuery
> {
  editor = VariableQueryEditor;

  constructor(private readonly datasource: DataSource) {
    super();
  }

  query(
    request: DataQueryRequest<MonetDBVariableQuery>
  ): Observable<DataQueryResponse> {
    const variableQuery = request.targets[0];

    return from(
      this.datasource.query({
        ...request,
        targets: [
          {
            ...variableQuery,
            refId: variableQuery.refId || 'A',
            queryText: variableQuery.queryText || '',
          },
        ],
      })
    ).pipe(
      map((response) => response)
    );
  }
}

