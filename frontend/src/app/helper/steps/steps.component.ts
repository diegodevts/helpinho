import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { UserService } from '../../user/user.service'
import { HttpClient } from '@angular/common/http'
import { HttpService } from '../../http/http.service'
import { HelperDto } from '../../../../../shared/dtos/helper/helper.dto'

@Component({
  selector: 'app-steps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css'
})
export class StepsComponent implements OnInit {
  step: number = 1
  stepsSrc: string = `assets/Step_1.png`

  userHelper: Omit<HelperDto, 'userId'> = {
    description: '',
    image: 'assets/default_card.jpeg',
    title: '',
    value: '0',
    goal: '0',
    category: '',
    user: {
      name: '',
      email: ''
    }
  }

  quantities: {
    icon: string
    stringValue: string
    value: number
    active: boolean
  }[] = [
    {
      icon: 'assets/rocket.png',
      stringValue: 'R$ 100,00',
      value: 100,
      active: false
    },
    {
      icon: 'assets/rocket.png',
      stringValue: 'R$ 1.000,00',
      value: 1000,
      active: false
    },
    {
      icon: 'assets/rocket.png',
      stringValue: 'R$ 5.000,00',
      value: 5000,
      active: false
    },
    {
      icon: 'assets/heart.png',
      stringValue: 'R$ 10.000,00',
      value: 10000,
      active: false
    },
    {
      icon: 'assets/heart.png',
      stringValue: 'R$ 20.000,00',
      value: 20000,
      active: false
    },
    {
      icon: 'assets/heart.png',
      stringValue: 'R$ 50.000,00',
      value: 50000,
      active: false
    }
  ]

  constructor(private router: Router, private http: HttpService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!)

    if (!user) {
      this.router.navigate(['/'])
    }
    this.userHelper.user = user
  }

  submitHelper() {
    this.http.createHelper(this.userHelper).subscribe(
      (response) => {
        // this.notification.notify()
        if (response.name == 'TokenExpiredError') {
          this.router.navigate(['/'])
        }
      },
      (error) => {
        console.log(error)
      }
    )
    this.router.navigate(['/home'])
  }
  setCategory(categoryName: string) {
    this.userHelper.category = categoryName
  }

  nextStep() {
    this.step += 1
    this.stepsSrc = `assets/Step_${this.step}.png`
  }

  previousStep() {
    this.step -= 1
    this.stepsSrc = `assets/Step_${this.step}.png`
  }

  cancel() {
    this.router.navigate(['/home'])
  }

  selectValue(index: number) {
    this.quantities.forEach((item, idx) => {
      item.active = idx === index
    })

    this.userHelper.value = this.quantities[index].value.toString()
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.userHelper.image = reader.result?.toString() as string
      }
    }
  }
}
