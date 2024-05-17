import { TAG_TRACE_PREFIX } from '../trace/trace.model';

/**
 * CONFIGURATION VARIABLES (general):
 *  - configuration variables are ID-value pairs
 *  - variables have ID, value, type
 *  - supported types are here: {@link ConfigType}
 *  - configuration variables are managed by *ConfigService services
 */

/**
 * Supported configuration variable types
 */
export enum ConfigType {
  String = 'S',
  Number = 'N',
  Boolean = 'B',
  Date = 'D',
  Timestamp = 'T',
  Array = 'A',
  Object = 'O',
}

/**
 * Variable descriptor
 */
export interface ConfigInfo<ID> {
  configId: ID;
  type: ConfigType;
  defaultValue?: string;
  tag?: string;
}

export interface ConfigVariable<ID> extends ConfigInfo<ID> {
  value: any;
}

export type AppConfigInfo = ConfigInfo<AppConfigId>;
export type AppConfig = ConfigVariable<AppConfigId>;

/**
 * IDs of application configuration variables.
 *
 * NOTE: It's mandatory to create a descriptor for a variable into {@link APP_CONFIG_VARIABLES}).
 */
export enum AppConfigId {
  // Trace enabled
  TraceAppConfig = 'TRACE_APP_CONFIG',
  TraceWebSocket = 'TRACE_WEB_SOCKET',
  TraceBroadcast = 'TRACE_BROADCAST',

  // Trace data enabled
  TraceAppConfigData = 'TRACE_APP_CONFIG_DATA',
  TraceWebSocketData = 'TRACE_WEB_SOCKET_DATA',
  TraceBroadcastData = 'TRACE_BROADCAST_DATA',
}

/**
 * Descriptors of application variables.
 *
 * MOTE: It's mandatory to create a descriptor for a variable here - not enough to add it to {@link AppConfigId} enum.
 */
export const APP_CONFIG_VARIABLES: AppConfigInfo[] = [
  // Trace
  { configId: AppConfigId.TraceAppConfig, type: ConfigType.Boolean, tag: TAG_TRACE_PREFIX + 'Config' },
  { configId: AppConfigId.TraceWebSocket, type: ConfigType.Boolean },
  { configId: AppConfigId.TraceBroadcast, type: ConfigType.Boolean },
  // Data for trace
  { configId: AppConfigId.TraceAppConfigData, type: ConfigType.Boolean },
  { configId: AppConfigId.TraceWebSocketData, type: ConfigType.Boolean },
  { configId: AppConfigId.TraceBroadcastData, type: ConfigType.Boolean },
];

export type ConfigId = AppConfigId;
export type ConfigVar = AppConfig;
