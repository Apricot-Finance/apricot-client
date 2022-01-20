export const INFO_LOG_ENV = 'APRICOT_LOG_INFO';
export const TAG_INFO = 'INFO:';
export const TAG_WARN = 'WARN:';
export const TAG_ALERT = 'ALERT:';
export const TAG_EMERGENCY = 'EMERGENCY:';

export function LogInfo(content: string) {
  // info logging is silenced by default. Requires the APRICOT_LOG_INFO env to be set to actually log
  if (process.env[INFO_LOG_ENV]) {
    console.log(TAG_INFO + content);
  }
}

export function LogWarning(content: string) {
  console.log(TAG_WARN + content);
}

export function LogAlert(content: string) {
  console.log(TAG_ALERT + content);
}

export function LogEmergency(content: string) {
  console.log(TAG_EMERGENCY+ content);
}