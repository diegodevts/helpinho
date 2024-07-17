import { Component, Injectable } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
@Injectable({
  providedIn: 'root'
})
export class NotificationComponent {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string) {
    this.toastr.success(message, 'Success')
  }

  showError(message: string) {
    this.toastr.error(message, 'Error')
  }

  showInfo(message: string) {
    this.toastr.info(message, 'Info')
  }

  showWarning(message: string) {
    this.toastr.warning(message, 'Warning')
  }
}
