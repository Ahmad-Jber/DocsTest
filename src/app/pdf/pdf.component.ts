import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PdfService} from "./pdf.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements AfterViewInit{
  @ViewChild("domContainer") domContainer!: ElementRef<HTMLDivElement>;
  @ViewChild("inputElement") nameInput!:ElementRef<HTMLInputElement>;
  constructor(
    private _service:PdfService,
    private _router:Router
  ) {
  }

  async ngAfterViewInit() {
    await this._service.getPdfTemplate(this.domContainer.nativeElement).then(e => console.log(e));
  }
  async onClickListener(){
    await this._service.save(this.nameInput.nativeElement.value).then(async e => {
      await this._router.navigate(['dashboard'])
    });
  }

  /*async addSignatureListener() {
    await this._service.addSignature(/!*this.domContainer.nativeElement*!/);
  }*/
}
