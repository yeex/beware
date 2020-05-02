import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from "../models/global-data";
// import { GoogleChartsModule } from 'angular-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  confirmedCases = 0;
  activeCases = 0;
  deathsCases = 0;
  recoveredCases = 0;
  table = [];
  globalData : GlobalDataSummary[];
  loading = true;
  pie =  'PieChart'
  column = 'ColumnChart'

  constructor(private data : DataService) { }


  ngOnInit(): void {
    this.data.getGlobalData()
      .subscribe(
        {
          next : (result)=>{
            console.log(result);
            this.globalData = result;
            result.forEach(crumb=> {
              if(!Number.isNaN(crumb.confirmed)) {
                this.activeCases += crumb.active
                this.confirmedCases += crumb.confirmed
                this.deathsCases += crumb.deaths
                this.recoveredCases += crumb.recovered
              }
            })
            this.initChart('confirmed');
          },
          complete : () => {
            this.loading = false;
          }
        }
      )
  }


  update(input : HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value)
  }

  initChart(typecase : string){

    let tableData = [];
    // tableData.push(["Country", "Cases"])

    this.globalData.forEach(crumb => {
      let value : number;
      if(typecase == 'confirmed')
        if(crumb.confirmed > 2000)
          value = crumb.confirmed

      if(typecase == 'recovered')
        if(crumb.recovered > 2000)
          value = crumb.recovered
          
      if(typecase == 'death')
        if(crumb.deaths > 2000)
          value = crumb.deaths
          
      if(typecase == 'active')
        if(crumb.active > 2000)
          value = crumb.active

        if(value) {
          tableData.push([
            crumb.country, 
            value
          ])
        }  
    })
    console.log(tableData);
    this.table = tableData;

    // this.pieChart = {
    //   chartType: 'PieChart',
    //   dataTable: tableData,
    //   firstRowdata : true
    //   options : {
    //     'Country': 
    //     'Cases', 
    //     height: 400,
    //     animation : {
    //       duration : 1000,
    //       easing : 'out',
    //     },
    //   },
    // },
    // this.columnChart = {
    //   chartType: 'ColumnChart',
    //   dataTable: tableData,
    //   firstRowdata : true
    //   options : {
    //     'Country': 
    //     'Cases', 
    //     height: 400,
    //     animation : {
    //       duration : 1000,
    //       easing : 'out',
    //     },
    //   },
    // }
  }



}
