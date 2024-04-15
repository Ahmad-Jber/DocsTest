import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {DashboardService} from "./dashboard.service";
import {GetAllDto} from "../../dtos/GetAllDto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  public files: GetAllDto[] | undefined
  constructor(
    @Inject(DashboardService)
    private _dashboardService: DashboardService,
    private _router:Router,
  ) {
    /*this._dashboardService.getAllFiles().then(r => {

    });*/
  }

  ngOnInit() {
    this._dashboardService.getAllFiles().subscribe(async (files) => {
      this.files =  files;
      console.log(this.files)
    });
  }

  onClickListener() {
    this._router.navigate(['/design']);
  }
}
