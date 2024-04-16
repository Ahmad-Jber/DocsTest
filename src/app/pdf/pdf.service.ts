import {Inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Designer,} from "@pdfme/ui";
import {
  signature
} from "../../graphics/signature";
import
  image
  from "../../graphics/image";
import {generate} from "@pdfme/generator";
import {arrayBufferUtilities} from "../../utilities/ArrayBufferUtilities";
import {AddFileDto} from "../../dtos/AddFileDto";
import {GetFileDto} from "../../dtos/GetFileDto";

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private _url: string = "assets/AQU.pdf";
  private _designer: Designer | undefined;
  private _blob: Blob;
  private file1?: FileReader;
  private _file!: AddFileDto;

  // private _file: string | ArrayBuffer;

  constructor(
    @Inject(HttpClient)
    private http: HttpClient
  ) {
    this._blob = new Blob();
    this._designer?.onChangeTemplate(template => {
      this._designer?.getPageCursor()
    })
  }

  private getFileApi(): Observable<HttpResponse<Blob>> {
    return this.http.get(this._url, {responseType: "blob", observe: "response"});
  }

  async getPdfTemplate(div: any): Promise<Designer | void> {
    this.getFileApi().subscribe(async (file) => {
      this._blob = new Blob(
        [file.body as Blob],
        {type: file.body?.type}
      );
      this.file1 = new FileReader()
      this.file1.readAsDataURL(this._blob)
      this._designer = new Designer({
        template: {
          basePdf: arrayBufferUtilities(await this._blob.arrayBuffer()),
          schemas: []
        },
        domContainer: div,
        plugins: {
          image,
          signature
        },
        options: {
          theme: {
            token: {
              colorPrimary: "#5F374B",
            },
          },
          lang:"ar"
        }
      });
    }).add(() => {
      return this._designer
    });
  }

  async save(name:string) {
    this._designer?.onSaveTemplate(async (template) => {
      if (template.sampledata) {
        console.log(template)
        await generate({
          template: template,
          plugins: {
            image,
            signature
          },
          inputs: template.sampledata
          //comment
        }).then(r => {
          let fileName = name+".pdf"
          let newFile = arrayBufferUtilities(r);
          const link = document.createElement("a");
          link.href = newFile
          link.download = fileName
          link.click();
          this.sendFileDataToServer({name:name,data:arrayBufferUtilities(r)});
        })
      }
    });
    this._designer?.saveTemplate();
  }

  private async sendFileDataToServer(file:AddFileDto) {
    return this.http.post("https://localhost:7264/api/File/add", file).subscribe(async (response) => {
      console.log(response)
    });
  }
}
