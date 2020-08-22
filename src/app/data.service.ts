import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from "./models/global-data";
import { DateConsider } from './models/date-consider';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/08-21-2020.csv';
  private dateUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  constructor(private http : HttpClient) { }
   
  getGlobalData() {
    return this.http.get(this.globalDataUrl , {responseType : 'text'}).pipe(
      map(result=> {
        let data : GlobalDataSummary[] = [];
        let raw = {}
        let rows = result.split('\n');
        rows.splice(0, 1);
        rows.forEach(row=> {
          let cols = row.split(/,(?=\S)/)

          let crumb = {
            country : cols[3],
            confirmed : +cols[7],
            deaths : +cols[8],
            recovered : +cols[9],
            active : +cols[10],
          };

          let temp : GlobalDataSummary = raw[crumb.country];
          if(temp) {
            temp.active = crumb.active + temp.active
            temp.confirmed = crumb.confirmed + temp.confirmed
            temp.deaths = crumb.deaths + temp.deaths
            temp.recovered = crumb.recovered + temp.recovered

            raw[crumb.country] = temp;
          } else {
            raw[crumb.country] = crumb;
          }
        })
        return <GlobalDataSummary[]>Object.values(raw);
      })
    )
  }
  getDateData() {
    return this.http.get(this.dateUrl, {responseType : 'text'})
      .pipe(map(result => {
        let rows = result.split('\n');
        let main = [];
        let header = rows[0];
        let dates = header.split(/,(?=\S)/)
        dates.splice(0, 4);
        rows.splice(0, 1);

        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)
          let con = cols[1];
          cols.splice(0, 4);  
          main[con] = [];
          cols.forEach((value, index) => {
            let dw : DateConsider = {
              cases : +value,
              country : con,
              date : new Date(Date.parse(dates[index]))
            }
            main[con].push(dw)
          })
        })
        return main;
      }))
  }
}
