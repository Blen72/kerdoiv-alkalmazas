import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KerdoivService {

  constructor(private http: HttpClient) { }

  getAllKerdoiv(){
    return this.http.get("http://localhost:5000/getAllKerdoiv", {});
  }

  getKerdoiv(kerdoid: string, doGetKerdes: boolean=false){
    const body=new URLSearchParams();
    body.set("kerdoid", kerdoid);
    body.set("doGetKerdes", doGetKerdes.toString());
    const header=new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post("http://localhost:5000/getKerdoiv", body, {headers: header, withCredentials: true});
  }

  getSelfKerdoivek(){
    return this.http.get("http://localhost:5000/getSelfKerdoivek", {withCredentials: true});
  }

  addKerdoiv(nev: string, nyilvanos: string){
    const body=new URLSearchParams();
    body.set("nev", nev);
    body.set("nyilvanos", nyilvanos);
    const header=new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post("http://localhost:5000/addKerdoiv", body, {headers: header, withCredentials: true});
  }

  modKerdoiv(kerdoid: string, nev: string, nyilvanos: string){
    const body=new URLSearchParams();
    body.set("kerdoid", kerdoid);
    body.set("nev", nev);
    body.set("nyilvanos", nyilvanos);
    const header=new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post("http://localhost:5000/modKerdoiv", body, {headers: header, withCredentials: true});
  }

  delKerdoiv(kerdoid: string){
    const body=new URLSearchParams();
    body.set("kerdoid", kerdoid);
    const header=new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post("http://localhost:5000/delKerdoiv", body, {headers: header, withCredentials: true});
  }

  addKerdes(kerdoid: string, ujkerdes: any){
    const body=new URLSearchParams();
    body.set("kerdoid", kerdoid);
    body.set("kerdes", ujkerdes["kerdes"]);
    body.set("type", ujkerdes["type"]);
    body.set("valaszok", JSON.stringify(ujkerdes["valaszok"]));
    const header=new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post("http://localhost:5000/addKerdes", body, {headers: header, withCredentials: true});
  }

  delKerdes(kerdesid: string){
    const body=new URLSearchParams();
    body.set("kerdesid", kerdesid);
    const header=new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post("http://localhost:5000/delKerdes", body, {headers: header, withCredentials: true});
  }

  modKerdes(kerdesid: string, editData: any){
    const body=new URLSearchParams();
    body.set("kerdesid", kerdesid);
    body.set("kerdes", editData["kerdes"]);
    body.set("type", editData["type"]);
    body.set("valaszok", JSON.stringify(editData["valaszok"]));
    const header=new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post("http://localhost:5000/modKerdes", body, {headers: header, withCredentials: true});
  }

  sendKitoltes(kerdoid: string, valaszok: {[_: string]: string[]|string}){
    const body=new URLSearchParams();
    body.set("kerdoid", kerdoid);
    for(let v_kerdesid in valaszok){
      valaszok[v_kerdesid]=JSON.stringify(valaszok[v_kerdesid]);
    }
    body.set("valaszok", JSON.stringify(valaszok));
    const header=new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post("http://localhost:5000/sendKitoltes", body, {headers: header, withCredentials: true});
  }

  getKerdesAdatok(kerdoid: string){
    const body=new URLSearchParams();
    body.set("kerdoid", kerdoid);
    const header=new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post("http://localhost:5000/getKerdesAdatok", body, {headers: header, withCredentials: true});
  }
}
