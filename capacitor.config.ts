import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wawasanpakusop.app',
  appName: 'Wawasan Pak Usop',
  webDir: 'dist',
  exclude: [
    'server.cjs',
    'server.cjs.map'
  ],
  plugins: {
    StatusBar: {
      // Without this, the WebView draws edge-to-edge under the status bar,
      // so the fixed header (and the burger menu tap target inside it)
      // partially overlaps the notification bar — taps landing in that
      // overlapped area get swallowed by the status bar instead of the button.
      overlaysWebView: false,
      // 'DARK' style = light/white status bar icons, correct for a dark
      // background (Capacitor's naming refers to the status bar's overall
      // dark appearance, not the icon color). Matches the header's dark
      // espresso background (src/index.css --color-cream: #0B0807 /
      // .glass-header rgba(11, 8, 7, ...)) so the status bar strip isn't a
      // mismatched white band with unreadable dark-on-dark icons.
      style: 'DARK',
      backgroundColor: '#0B0807'
    }
  }
};

export default config;
