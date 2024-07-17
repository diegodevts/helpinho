import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { StepsComponent } from '../steps/steps.component'

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, StepsComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  user!: { name: string; email: string }
  item!: string

  ngOnInit(): void {
    this.user = { name: 'Diego Lima', email: 'diego@hotmail.com' }
  }

  setItem(itemName: string) {
    this.item = itemName
  }
}
