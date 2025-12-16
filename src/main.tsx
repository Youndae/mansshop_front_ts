// sockjs-client global polyfill
if (typeof global === 'undefined') {
  (window as any).global = window;
}
if (typeof process === 'undefined') {
  (window as any).process = { env: {} };
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from '@/app/store'
import { CookiesProvider } from "react-cookie";

import dayjs from "dayjs";
import isLeapYear from 'dayjs/plugin/isLeapYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(isLeapYear, relativeTime);
dayjs.locale('ko');



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
        <CookiesProvider>
          <App />
        </CookiesProvider>
    </Provider>
  </StrictMode>,
)
