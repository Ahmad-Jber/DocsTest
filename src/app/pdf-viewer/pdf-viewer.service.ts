import {Inject, Injectable} from '@angular/core';
import {Template} from "@pdfme/common";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {arrayBufferUtilities} from "../../utilities/ArrayBufferUtilities";
import {Observable} from "rxjs";
import {GetAllDto} from "../../dtos/GetAllDto";
import {GetFileDto} from "../../dtos/GetFileDto";
import {Viewer} from "@pdfme/ui";

@Injectable({
  providedIn: 'root'
})
export class PdfViewerService {
  private _url: string = "https://localhost:7264/api/File/get-file"
  private _fileDto: GetFileDto | undefined;
  constructor(
    @Inject(HttpClient)
    private _http: HttpClient,
  ) {
  }
  public getTemplate(basePdf: string) : Template{
    return {
      basePdf: basePdf,
      schemas: []
    }
  }
  public getAllFiles(Id:number):Observable<GetFileDto>{
    return this._http.get<GetFileDto>(this._url, {params:new HttpParams().set("Id",Id)});
  }
  /*public viewPdf(div: HTMLDivElement):Viewer|void{
    this._getAllFiles(this._id).subscribe(async (file) => {
      this._fileDto = file;
      console.log(this._fileDto)
    })
      return new Viewer({domContainer: div, template: this.getTemplate(this._fileDto?this._fileDto?.data:""), options: {lang: "ar"}})
  }*/
}
