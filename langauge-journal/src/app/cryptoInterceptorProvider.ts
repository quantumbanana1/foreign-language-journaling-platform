import { Provider } from '@angular/core';

// Injection token for the Http Interceptors multi-provider
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { cryptoInterceptor } from './crypto.interceptor';

/** Provider for the Noop Interceptor. */
export const cryptoInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: cryptoInterceptor,
  multi: true,
};
