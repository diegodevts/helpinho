import { Component } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterOutlet } from '@angular/router'
import { NotificationComponent } from './notification/notification.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend'
}
