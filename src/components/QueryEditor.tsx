import React, { ReactElement } from 'react';
import { css } from '@emotion/css';
import { CodeEditor, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import type { EditorProps } from './types';
import { useChangeString } from './useChangeString';

export function QueryEditor(props: EditorProps): ReactElement {
  const { query } = props;

  const onChangeQueryText = useChangeString(props, {
    propertyName: 'queryText',
  });

  const styles = useStyles2(getStyles);

  return (
    <>
      <div className={styles.editor}>
        <CodeEditor
          height="300px"
          showLineNumbers={true}
          language="sql"
          onBlur={onChangeQueryText}
          value={query.queryText}
        />
      </div>
    </>
  );

  }

  function getStyles(theme: GrafanaTheme2) {
    return {
      editor: css`
        margin: ${theme.spacing(0, 0.5, 0.5, 0)};
      `,
    };
  }
