import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class toastrService {
  constructor(private toastr: ToastrService) {}

  public showToastrMessage(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    title?: string,
  ) {
    const opt = {
      closeButton: true,
      progressBar: true,
      disableTimeOut: false,
    };

    switch (type) {
      case 'success':
        return this.toastr.success(message, title || 'Success', opt);
      case 'error':
        return this.toastr.error(message, title || 'Error', opt);
      case 'warning':
        return this.toastr.warning(message, title || 'Warning', opt);
      case 'info':
        return this.toastr.info(message, title || 'Info', opt);
      default:
        return this.toastr.show(message, title || '', opt);
    }
  }
}
