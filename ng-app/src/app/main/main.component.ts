import { Component } from '@angular/core';
import { MainService } from './main.service';
import { Search } from './search';
import { MessageService } from '../message.service';


@Component({
  selector: 'app-main',
  templateUrl: 'main.component.html',
  providers: [ MainService ],
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  error: any;
  results = [];
  observations = [];
  selectedPatient = undefined;
  showObservations = false;

  constructor(private mainService: MainService) {}

  clear() {
    this.results = [];
    this.error = undefined;
    this.observations = [];

  }

  showSearchResults() {
    this.mainService.getSearchResults()
      .subscribe(
        (data)=> {
          for(let key in data){
            this.results.push(data[key]);
          }
        },
        //data => this.searchResults = { ...data }, // success path
        error => this.error = error // error path
      );
  }

  showObservationResults(patient) {
    debugger
    // for dev
    this.selectedPatient = patient;

    this.showObservations = true;
    this.observations = this.results;
  }

}
