import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection
} from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http'
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        progressBar: true
      })
    )
  ]
}
