import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KerdoivService } from '../shared/services/kerdoiv.service';
import { CommonModule } from '@angular/common';
import { KerdesComponent } from '../shared/components/kerdes/kerdes.component';

@Component({
  selector: 'app-nyilvanos-kerdoivek',
  imports: [CommonModule, FormsModule, KerdesComponent],
  templateUrl: './nyilvanos-kerdoivek.component.html',
  styleUrl: './nyilvanos-kerdoivek.component.scss'
})
export class NyilvanosKerdoivekComponent implements OnInit{
  kerdoivek: any=[];
  kerdoid: any=undefined;
  kerdoKeszito: string="";
  kerdoNev: string="";
  kerdesValaszok: any={};
  kerdesek: any=[];
  kerdesAdatok: { [kerdesId: string]: string[][] }={};
  vanadat=false;
  kerdesIds: {[key: string]: string }={};

  constructor(private kerdoivService: KerdoivService){}

  ngOnInit(): void {
    this.getKerdoivek();
  }

  getKerdoivek(){
    this.kerdoivService.getAllKerdoiv().subscribe({
      next: (data: any)=>{
        this.kerdoivek=data["kerdoivek"];
        for(let i=0;i<this.kerdoivek.length;i++){
          this.kerdoivek[i]["username"]=data["users"][i];
        }
        console.log(data);
        console.log(this.kerdoivek)
      },
      error: (err)=>{
        console.log(err);
      }
    });
  }

  getKerdoiv(kerdoid: string, keszito: string){
    this.kerdoivService.getKerdoiv(kerdoid, true).subscribe({
      next: (data: any)=>{
        this.vanadat=false;
        this.kerdoid=kerdoid;
        this.kerdoNev=data["kerdoiv"]["nev"];
        this.kerdoKeszito=keszito;
        this.kerdesek=data["kerdesek"];
        for(let kerdes of this.kerdesek){
          if(kerdes["type"]!=="text")kerdes["valaszok"]=JSON.parse(kerdes["valaszok"]);
        }
      }, error: (err)=>{
        console.error(err);
      }
    });
  }

  getKitoltesek(kerdoid: string){
    this.kerdoivService.getKerdesAdatok(kerdoid).subscribe({
      next: (data: any)=>{
        this.vanadat=true;
        this.kerdoid=undefined;
        console.log(data);
        this.kerdesAdatok = JSON.parse(data["valaszok"]);
        const rawData = JSON.parse(data["valaszok"]) as { [key: string]: string[] };
        for (let kerdesId in rawData) {
          this.kerdesAdatok[kerdesId] = rawData[kerdesId].map((valaszStr: string) => JSON.parse(valaszStr));
        }
        console.log(this.kerdesAdatok);
        this.kerdesIds=data["kerdesek"];
      },
      error: (err)=>{
        console.log(err);
      }
    });
  }

  handleKitoltesData($event: any, kerdesid: any) {
    this.kerdesValaszok[kerdesid]=$event;
    console.log(JSON.stringify(this.kerdesValaszok))
  }

  send(){
    this.kerdoivService.sendKitoltes(this.kerdoid, this.kerdesValaszok).subscribe({
      next: (data: any)=>{
        console.log(data);
      },
      error: (err)=>{
        console.log(err);
      }
    });
  }
}
