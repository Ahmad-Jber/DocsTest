import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PdfViewerService} from "./pdf-viewer.service";
import {GetFileDto} from "../../dtos/GetFileDto";
import {Viewer} from "@pdfme/ui";

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit{
  @ViewChild("domContainer") private div!:ElementRef<HTMLDivElement>;
  public fileDto!:GetFileDto
  constructor(
    private _active:ActivatedRoute,
    private _viewerService:PdfViewerService
  ) {
  }

  ngOnInit() {
    const id = Number(this._active.snapshot.paramMap.get("id"));
    console.log(id)
    console.log(this._active.snapshot)
    this._viewerService.getAllFiles(id).subscribe((file)=>{
      console.log(file)
      this.fileDto=file
      console.log(this.fileDto)
      new Viewer({template:this._viewerService.getTemplate(this.fileDto.data), domContainer:this.div.nativeElement, inputs:[{}]})
    })
  }
}
