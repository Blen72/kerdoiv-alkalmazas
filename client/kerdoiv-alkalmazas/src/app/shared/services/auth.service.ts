import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  logout(){
    return this.http.get("http://localhost:5000/logout", {withCredentials: true});
  }

  login(username: string, password: string){
    const body=new URLSearchParams();
    body.set("username", username);
    body.set("password", password);
    const header=new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post("http://localhost:5000/login", body, {headers: header, withCredentials: true});
  }

  register(username: string, password: string){
    const body=new URLSearchParams();
    body.set("username", username);
    body.set("password", password);
    const header=new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post("http://localhost:5000/register", body, {headers: header});
  }

  isUserLoggedIn(){
    return this.http.get("http://localhost:5000/isUserLoggedIn", {withCredentials: true});
  }
}
