import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {GetAllDto} from "../../dtos/GetAllDto";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _files : GetAllDto[]
  private readonly _url:string = "https://localhost:7264/api/File/all"
  constructor(
    @Inject(HttpClient)
    private _http: HttpClient,
  ) {
    this._files = []
  }
  public getAllFiles():Observable<GetAllDto[]>{
    return this._http.get<GetAllDto[]>(this._url);
  }
/*  public async getAllFiles():GetAllDto[]{
    this._getAllFiles().subscribe(async response => {
      this._files = await response.body as GetAllDto[]
      console.log(this._files)
    })
  }*/
  public getFiles(){
    return this._files
  }
}
