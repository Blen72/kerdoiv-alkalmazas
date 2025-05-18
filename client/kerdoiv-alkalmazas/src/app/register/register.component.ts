import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  static passMinLen: Number=6;
  getPassMinLen: Number=RegisterComponent.passMinLen; //BRUH

  constructor(private formBuilder: FormBuilder, private authService: AuthService){}

  ngOnInit() {
    this.registerForm=this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required, ]],
      passwordAgain: ["", [Validators.required]]
    }, {
      validators: [
        this.passCheck("password", "passwordAgain"),
        (formGroup: FormGroup)=>{
          const passControl=formGroup.controls["password"];
          if(passControl.value.length<RegisterComponent.passMinLen){
            passControl.setErrors({"length": passControl.value.length});
          } else {
            passControl.setErrors(null);
          }
        }
      ]
    });
  }

  passCheck(passControlName: string, passAgainControlName: string){
    return (formGroup: FormGroup)=>{
      const passControl=formGroup.controls[passControlName];
      const passAgainControl=formGroup.controls[passAgainControlName];
      if(passControl.value !== passAgainControl.value){
        passAgainControl.setErrors({"not_same": true});
      } else {
        passAgainControl.setErrors(null);
      }
    }
  }

  isErrorOccur(componentName: string, errorName: string){
    let error=this.registerForm.get(componentName)?.errors;
    if(error){
      return error[errorName];
    }
    return false;
  }

  onSubmit(){
    if(this.registerForm.valid){
      console.log(this.registerForm.value);
      this.authService.register(this.registerForm.get("username")?.value, this.registerForm.get("password")?.value).subscribe({
        next: (data)=>{
          console.log(data);
        }, error: (err)=>{
          console.error(err);
        }
      });
    } else {
      console.log("Nem validak az adatok.");
    }
  }
}
