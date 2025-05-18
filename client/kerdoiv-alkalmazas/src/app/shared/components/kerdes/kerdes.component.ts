import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kerdes',
  imports: [CommonModule, FormsModule],
  templateUrl: './kerdes.component.html',
  styleUrl: './kerdes.component.scss'
})
export class KerdesComponent implements OnInit {
  @Output() selected = new EventEmitter<Array<any>>();
  selected2: any=[];
  @Output() editdata = new EventEmitter<any>();
  @Input() kerdesid: string="";
  @Input() editMode: boolean=false;
  @Input() kerdes: any="";
  @Input() type: string="";
  @Input() valaszok: Array<string>=[];
  kerdesEdit: string="";
  valaszokEdit: string="";
  tipusEdit: string="";

  ngOnInit(): void {
    this.kerdesEdit=this.kerdes;
    if(this.type!=="text")this.valaszokEdit=this.valaszok.join(";");
    this.tipusEdit=this.type;
  }

  onChange(valasz: string) {
    this.selected.emit([valasz]);
  }

  onClick(kerdesid: string, valasz: string) {
    if(this.type==="radio"){
      this.selected2=[valasz];
      this.selected.emit([valasz]);
       return;
    }
    let index=this.selected2.indexOf(valasz);
    if(index===-1){
      this.selected2.push(valasz);
    } else {
      this.selected2.splice(index, 1);
    }
    this.selected.emit(this.selected2);
  }

  onEdit(){
    this.editdata.emit({kerdes: this.kerdesEdit, valaszok: this.tipusEdit!=="text"?this.valaszokEdit.split(";"):undefined, type: this.tipusEdit});
  }
}


/*

const KerdesSchema: Schema<IKerdes>=new Schema({
    kerdoid: {type: Schema.Types.ObjectId, required: true},
    kerdes: {type: String, required: true},
    type: {type: String, required: true},
    valaszok: {type: String}
});

const KerdesAdatSchema: Schema<IKerdesAdat>=new Schema({
    kerdesid: {type: Schema.Types.ObjectId, required: true},
    userid: {type: Schema.Types.ObjectId},
    valasz: {type: String, required: true}
});

*/