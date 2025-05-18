import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KerdoivService } from '../shared/services/kerdoiv.service';
import { CommonModule } from '@angular/common';
import { KerdesComponent } from '../shared/components/kerdes/kerdes.component';

@Component({
  selector: 'app-kerdoiv-szerkesztes',
  imports: [FormsModule, CommonModule, KerdesComponent],
  templateUrl: './kerdoiv-szerkesztes.component.html',
  styleUrl: './kerdoiv-szerkesztes.component.scss'
})
export class KerdoivSzerkesztesComponent implements OnInit{
  nev: string="";
  nyilvanos: boolean=false;
  kerdoid: any=undefined;
  kerdoNev: string="";
  kerdoNyilvanossag: boolean=false;
  kerdoivek: any=[];
  kerdesek: any=[
    //{kerdes:"Mi az első kérdés?", valaszok:"A kerdes.", type:"text"},
    //{kerdes:"Aki mond A-t mondjon ... is.", valaszok:["A","B","C","D"], type:"radio", _id:"asd"}
  ];
  ujkerdes: {
    kerdes: string;
    valaszok: any[];
    type: string;
    [key: string]: any; // 🔑 engedélyezi az egyéb kulcsokat is
  }={kerdes:"", valaszok:[], type:"text"};
  /* const KerdesSchema: Schema<IKerdes>=new Schema({
      kerdoid: {type: Schema.Types.ObjectId, required: true},
      kerdes: {type: String, required: true},
      type: {type: String, required: true},
      valaszok: {type: String}
    }); */
  selectedKerdoiv: any;
  editData: any;

  constructor(private kerdoivService: KerdoivService){}

  reload(){
    window.location.reload();
  }

  ngOnInit(): void {
    this.kerdoivService.getSelfKerdoivek().subscribe({
      next: (data: any)=>{
        this.kerdoivek=data["kerdoivek"];
      },
      error: (err)=>{
        console.error(err);
      }
    });
    this.kerdoivek;
  }

  addKerdoiv(){
    //console.log(typeof this.nyilvanos);//HOGY LETT BOOLEAN???????
    //console.log(!!this.nyilvanos);
    this.kerdoivService.addKerdoiv(this.nev, this.nyilvanos?"true":"false").subscribe({
      next: (data)=>{
        console.log(data);
        this.reload();
      }, error: (err)=>{
        console.error(err);
      }
    });
  }

  addKerdes(){
    this.kerdoivService.addKerdes(this.kerdoid, this.ujkerdes).subscribe({
      next: (data)=>{
        console.log(data);
        this.onChange();
      }, error: (err)=>{
        console.error(err);
      }
    });
  }

  getEditData($event: any){
    this.editData=$event;
  }

  editKerdes(kerdesid: any) {
    this.kerdoivService.modKerdes(kerdesid, this.editData).subscribe({
      next: (data: any)=>{
        console.log("Edited kerdes");
        this.onChange();
      }, error: (err)=>{
        console.error(err);
      }
    });
  }

  deleteKerdes(kerdesid: any) {
    this.kerdoivService.delKerdes(kerdesid).subscribe({
      next: (data: any)=>{
        console.log("Deleted kerdes");
        this.onChange();
      }, error: (err)=>{
        console.error(err);
      }
    });
  }

  editKerdoiv() {
    this.kerdoivService.modKerdoiv(this.kerdoid, this.kerdoNev, this.kerdoNyilvanossag?"true":"false").subscribe({
      next: (data: any)=>{
        console.log("Edited kerdoiv");
        this.reload();
      }, error: (err)=>{
        console.error(err);
      }
    });
  }

  deleteKerdoiv() {
    this.kerdoivService.delKerdoiv(this.kerdoid).subscribe({
      next: (data: any)=>{
        console.log("Deleted kerdoiv");
        this.reload();
      }, error: (err)=>{
        console.error(err);
      }
    });
  }

  onChange() {
    this.getKerdesek(this.kerdoid);
  }

  getKerdesek(id: any){
    this.kerdoivService.getKerdoiv(id, true).subscribe({
      next: (data: any)=>{
        this.kerdoNev=data["kerdoiv"]["nev"];
        this.kerdoNyilvanossag=data["kerdoiv"]["nyilvanos"];
        console.log(data["kerdoiv"]["nyilvanos"])
        this.kerdesek=data["kerdesek"];
        for(let kerdes of this.kerdesek){
          if(kerdes["type"]!=="text")kerdes["valaszok"]=JSON.parse(kerdes["valaszok"]);
        }
      }, error: (err)=>{
        console.error(err);
      }
    });
  }

  handleNewKerdes($event: {[key:string]:any}){
    for(let k in $event){
      let key: string=k;
      this.ujkerdes[key]=$event[key];
    }
  }
}
