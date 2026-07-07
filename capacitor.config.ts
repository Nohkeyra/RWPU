import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wawasanpakusop.app',
  appName: 'Wawasan Pak Usop',
  webDir: 'dist',
  exclude: [
    'server.cjs',
    'server.cjs.map'
  ]
};

export default config;
