import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input('confirmedCases')
  confirmedCases;
  @Input('recoveredCases')
  recoveredCases;
  @Input('deathsCases')
  deathsCases;
  @Input('activeCases')
  activeCases;
  constructor() { }

  ngOnInit() {
  }

}
