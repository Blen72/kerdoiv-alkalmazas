import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  username: string="";
  password: string="";

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit() {
  }

  login(){
    if(this.username&&this.password){
      this.authService.login(this.username, this.password).subscribe({
        next: (data)=>{
          this.router.navigateByUrl("/szerkesztes");
          console.log(data);
        }, error: (err)=>{
          console.error(err);
        }
      });
    }
  }
}
