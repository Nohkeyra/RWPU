import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

// Routes that are considered "top level" — pressing hardware back here should
// exit the app rather than trying to go back further, since there is nowhere
// meaningful left to return to within the SPA.
const ROOT_PATHS = ['/', '/main'];

/**
 * Wires the Android hardware/gesture back button to React Router's own
 * navigation history instead of the native WebView's canGoBack()/goBack().
 *
 * Why this is needed: HashRouter navigations (e.g. Landing -> Order) update
 * React Router's history via history.pushState(), but Android's native
 * WebView history stack does not reliably register these hash-only
 * navigations as "back-able" entries. That caused MainActivity's previous
 * canGoBack()-based back handling to incorrectly report no history and exit
 * the app straight from pages like /order, instead of returning to the
 * previous in-app page.
 *
 * Registering a 'backButton' listener here tells Capacitor's App plugin to
 * stop deciding this natively — it hands control to this JS listener instead
 * (see @capacitor/app AppPlugin.java: once a 'backButton' listener exists,
 * the native side no longer calls WebView.goBack() itself). We then use
 * React Router's navigate(-1), which follows the SPA's actual route history.
 */
export function useNativeBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let listenerHandle: { remove: () => void } | undefined;

    App.addListener('backButton', () => {
      if (ROOT_PATHS.includes(location.pathname)) {
        App.exitApp();
      } else {
        navigate(-1);
      }
    }).then((handle) => {
      listenerHandle = handle;
    });

    return () => {
      listenerHandle?.remove();
    };
  }, [navigate, location.pathname]);
}
