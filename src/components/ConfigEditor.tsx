import React, { ChangeEvent } from 'react';
import { InlineField, Input, SecretInput } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      username: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onHostnameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      hostname: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onPortChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      port: Number(event.target.value),
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onDatabaseChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      database: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  // Secure field (only sent to the backend)
  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonData: {
        password: event.target.value,
      },
    });
  };

  const onResetPassword = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        password: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        password: '',
      },
    });
  };

  const { jsonData, secureJsonFields } = options;
  const secureJsonData = (options.secureJsonData || {}) as MySecureJsonData;

  return (
    <div className="gf-form-group">
      <InlineField label="Username" labelWidth={12}>
        <Input
          onChange={onUsernameChange}
          value={jsonData.username || 'monetdb'}
          placeholder="json field returned to frontend"
          width={40}
        />
      </InlineField>
      <InlineField label="Password" labelWidth={12}>
        <SecretInput
          isConfigured={(secureJsonFields && secureJsonFields.password) as boolean}
          value={secureJsonData.password || ''}
          placeholder="secure json field (backend only)"
          width={40}
          onReset={onResetPassword}
          onChange={onPasswordChange}
        />
      </InlineField>
      <InlineField label="Hostname" labelWidth={12}>
        <Input
          onChange={onHostnameChange}
          value={jsonData.hostname || 'localhost'}
          placeholder="json field returned to frontend"
          width={40}
        />
      </InlineField>
      <InlineField label="Port" labelWidth={12}>
        <Input
          onChange={onPortChange}
          value={jsonData.port || 50000}
          placeholder="json field returned to frontend"
          width={40}
        />
      </InlineField>
      <InlineField label="Database" labelWidth={12}>
        <Input
          onChange={onDatabaseChange}
          value={jsonData.database || 'monetdb'}
          placeholder="json field returned to frontend"
          width={40}
        />
      </InlineField>
    </div>
  );
}
