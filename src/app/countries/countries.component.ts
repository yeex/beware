import { DashboardComponent } from './../dashboard/dashboard.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { DateConsider } from './../models/date-consider';
import { GlobalDataSummary } from './../models/global-data';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { map } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data : GlobalDataSummary[];
  countries : string[] = []; 
  confirmedCases = 0;
  activeCases = 0;
  deathsCases = 0;
  recoveredCases = 0;
  table = [];
  countrySelected : DateConsider[];
  dateConsider;
  loading = true;
  linechart = 'LineChart'


  constructor(private service : DataService) { }

  ngOnInit(): void {

    merge(
      this.service.getDateData().pipe(
        map(result=> {
          this.dateConsider = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map(result=> {
          this.data = result;
          this.data.forEach(cs => {
            this.countries.push(cs.country)
          })
        })
      )
    ).subscribe(
      {
        complete : () => {
          // this.fetch('Rwanda')
          this.loading = false;
        }
      }
    )

    
  }

  chartUpdate() {
    let tableData = [];
    // tableData.push(["Date" , 'Cases'])
    this.countrySelected.forEach(cs=> {
      tableData.push([cs.date , cs.cases])
    })

    console.log(tableData);
    this.table = tableData;

    // this.lineChart = {
    //   chartType : 'LineChart',
    //   dataTable : tableData,
    //   options: {
    //     height : 500,
    //     animation : {
    //       duration : 1000,
    //       easing : 'out',
    //     },
    //   },
    // }
  }

  fetch(country : string) {
    console.log(country);
    this.data.forEach(cs => {
      if(cs.country == country) {
        this.activeCases = cs.active
        this.confirmedCases = cs.confirmed
        this.recoveredCases = cs.recovered
        this.deathsCases = cs.deaths
      }
    })
    this.countrySelected = this.dateConsider[country];
    console.log(this.countrySelected);
    this.chartUpdate();
  }

}
