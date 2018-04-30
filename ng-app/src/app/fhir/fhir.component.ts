import { Component, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import {MatTableDataSource} from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { FHIRPatientResource, FHIRObservationResource, FHIRService } from './fhir.service';

export interface Element {
  id: string;
  encounter: string;
  date: string;
  loincCode: string;
  testName: string;
  value: number;
  valueCode: string;
}

export interface AnalysisElement {
  id: number;
  priority: number;
  alt: number;
  ast: number;
  uln_alt: number;
  uln_ast: number;
  title: string;
  reference_str: string;
  reference_url: string;
  simple: string;
  detail: string;
}

@Component({
  selector: 'app-package-search',
  templateUrl: 'fhir.component.html',
  providers: [ FHIRService ],
  styleUrls: ['./fhir.component.css']
})

export class FHIRComponent implements OnInit {
  withRefresh = false;
  error: any;
  showSearchResults = false;
  showNoSearchResults = false;
  searchResults = [];
  showObservationsResults = false;
  showNoObservationsResults = false;
  observationsResults = [];
  lftLoincCodes = ['24324-6', '1751-7', '1975-2', '1968-7', '6768-6', '1920-8', '1742-6'];
  selectedPatient: any;
  displayedColumns = ['id', 'encounter', 'date', 'loincCode', 'testName', 'value', 'valueCode'];
  datsource: Element[];
  showSpinner = false;
  analysisResults = [];
  analysisDatasource: AnalysisElement[];
  showAnalysisResults = false;
  showNoAnalysisResults = false;
  analysidDisplayedColumns = ['title', 'reference_str', 'reference_url', 'simple', 'detail'];
  limit = 10;
  key = 0;

  ngOnInit() {

  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  doSearch(term: string) {

    let termUpperCase = new UpperCasePipe().transform(term);

    // term = term | UpperCasePipe
    this.fhirService.search(termUpperCase, this.withRefresh)
      .subscribe(
        (data)=> {
          //console.log(data);


            for (let key in data) {
              //this.searchResults.push(data[key]);

              let objPatient = {
                patientId: data[key].patient.resource !== undefined ? data[key].patient.resource.id : null,
                lastName: data[key].patient.resource !== undefined ? data[key].patient.resource.name[0].family[0] : null,
                firstName: data[key].patient.resource != undefined ? data[key].patient.resource.name[0].given[0] : null,
                dob: data[key].patient.resource != undefined ? data[key].patient.resource.birthDate : null,
                gender: data[key].patient.resource != undefined ? data[key].patient.resource.gender : null,
              }
              this.searchResults.push(objPatient);
            }
          // randomly get 10 patients
          //for(var i = 0; i < this.limit; i++){
          //  this.key = this.getRandomInt(0, 49);
          //  this.results.push(data[this.key]);
          //}
        },
        //data => this.searchResults = { ...data }, // success path
        error => this.error = error, // error path
        () => this.searchCompleted()
      );
  }

  searchCompleted() {
    if (this.searchResults.length > 0) {
      this.showSearchResults = true;
      this.showNoSearchResults = false;
    } else {
      this.showNoSearchResults = true;
      this.showSearchResults = false;
    }
  }



  showObservationResults(patient: any) {

    this.selectedPatient = patient;
    this.showSpinner = true;

    this.fhirService.findPatientObservations(this.selectedPatient.patientId, this.withRefresh)
      .subscribe(
        (data)=> {

          for(let key in data) {
            let dataLoincCode = data[key].patientObservations.resource.code.coding[0].code !== undefined ? data[key].patientObservations.resource.code.coding[0].code : null;

            if (dataLoincCode !== null && this.lftLoincCodes.indexOf(dataLoincCode) > -1) {

              // let objObservation: Element = {
              let objObservation = {
                  id: data[key].patientObservations.resource.id !== undefined ? data[key].patientObservations.resource.id: null,
                  encounter:  data[key].patientObservations.resource.encounter !== undefined ? data[key].patientObservations.resource.encounter.reference: null,
                  date: data[key].patientObservations.resource.effectiveDateTime !== undefined ? data[key].patientObservations.resource.effectiveDateTime : null,
                  loincCode: dataLoincCode,
                  testName: data[key].patientObservations.resource.code.coding[0].display !== undefined ? data[key].patientObservations.resource.code.coding[0].display : null,
                  value: data[key].patientObservations.resource.valueQuantity.value !== undefined ? data[key].patientObservations.resource.valueQuantity.value : null,
                  valueCode: data[key].patientObservations.resource.valueQuantity.code !== undefined ? data[key].patientObservations.resource.valueQuantity.code : null
              }
              this.observationsResults.push(objObservation);
            }
          }
          // console.log(this.observationsResults);
          // somewhat weird but table datasource need to be a  typed object
          this.datsource = this.observationsResults;
        },
        //data => this.searchResults = { ...data }, // success path
        error => this.error = error, // error path
        () => this.runLFTInterpretationAnalysis()
      );
  }

  runLFTInterpretationAnalysis() {

    if (this.datsource.length > 0) {
      this.showObservationsResults = true;
      this.showNoObservationsResults = false;

      // filter the AST, and get the value to use for analysis - just using max for now
      let datasourceAST = this.datsource
        .filter((element: Element) => element.loincCode === '1920-8');
      const ast = Math.max(...datasourceAST.map(element => element.value));

      // filter the ALT, and get the value to use for analysis - just using max for now
      let datasourceALT = this.datsource
        .filter((element: Element) => element.loincCode === '1742-6');
      const alt = Math.max(...datasourceALT.map(element => element.value));

      // upper limits
      let ULN_AST_MALE = 32;
      let ULN_AST_FEMALE = 26;
      let ULN_ALT_MALE = 30;
      let ULN_ALT_FEMALE = 19;

      // get ULNs to use
      let genderUpperCase = new UpperCasePipe().transform(this.selectedPatient.gender) ;
      let uln_ast = genderUpperCase == "MALE" ? ULN_AST_MALE : ULN_AST_FEMALE;
      let uln_alt = genderUpperCase == "MALE" ? ULN_ALT_MALE : ULN_ALT_FEMALE;

      // RULE_ID 2, Priority 100
      if(alt > (15 * uln_alt) || alt > 10000 || ast > (15 * uln_ast)) {

        let objAnalysis = {
          id: 2,
          priority: 100,
          alt: alt,
          ast: ast,
          uln_alt: uln_alt,
          uln_ast: uln_ast,
          title: 'Massive Elevation of AST and/or ALT',
          reference_str: 'ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries, Am J Gastroenterol 2017; 112:18–35; doi:10.1038/ajg.2016.517; published online 20 December 2016',
          reference_url: 'https://www.ncbi.nlm.nih.gov/pubmed/27995906',
          simple: 'ACG suggests that clinicians should consider acetaminophen toxicity and ischemic hepatopathy (shocked liver) for very high AST and/or ALT (> 15X UNL or ALT > 10,000IU/L)',
          detail: 'In those with ALT and/or AST levels >15X ULN, or massive elevation ALT of >10,000 IU/l, evaluation should also assess for acetaminophen toxicity and ischemic hepatopathy (shock liver). (Strong recommendation, very low level of evidence).'
        }
        this.analysisResults.push(objAnalysis);
      }

      // RULE_ID 3, Priority 70
      if(ast > uln_ast && ast < alt) {
        let objAnalysis = {
          id: 3,
          priority: 70,
          alt: alt,
          ast: ast,
          uln_alt: uln_alt,
          uln_ast: uln_ast,
          title: 'AST > ALT',
          reference_str: 'ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries, Am J Gastroenterol 2017; 112:18–35; doi:10.1038/ajg.2016.517; published online 20 December 2016',
          reference_url: 'https://www.ncbi.nlm.nih.gov/pubmed/27995906',
          simple: 'ACG suggests that AST > ALT should be considered for alcoholic liver disease (for those with alcohol consumption of > 140g/week in F or > 210g/week in M)',
          detail: 'Women consuming more than 140 g per week or men consuming more than 210 g per week who present with AST>ALT should be considered at risk for alcoholic liver disease and should be counseled for alcohol cessation. (Strong recommendation, very low level of evidence).'
        }
        this.analysisResults.push(objAnalysis);
      }

      // RULE_ID 1, Priority 50
      if((alt > uln_alt && alt < (5* uln_alt)) || (ast > uln_ast && ast < (5 * uln_ast))) {

        let objAnalysis = {
          id: 1,
          priority: 50,
          alt: alt,
          ast: ast,
          uln_alt: uln_alt,
          uln_ast: uln_ast,
          title: 'Moderate Elevation (< 5x UNL) in AST and/or ALT',
          reference_str: 'ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries, Am J Gastroenterol 2017; 112:18–35; doi:10.1038/ajg.2016.517; published online 20 December 2016',
          reference_url: 'https://www.ncbi.nlm.nih.gov/pubmed/27995906',
          simple: 'ACG suggests that elevated ALT or AST < 5x ULN should be assessed for various disorders including hepatitis and drug-related injury.',
          detail: 'In those with ALT and/or AST levels <5X ULN, the history and laboratory testing should assess for viral hepatitis B and C, alcoholic and NAFLD, hemochromatosis, Wilson’s disease, alpha-1-anti-trypsin deficiency, autoimmune hepatitis and consider drugs/supplement related injury. (Strong recommendation, very low level of evidence).'
        }
        this.analysisResults.push(objAnalysis);
      }

      if(this.analysisResults.length > 0) {
        // somewhat weird but table datasource need to be a typed object
        this.analysisDatasource = this.analysisResults;
        this.showAnalysisResults = true;
        this.showNoAnalysisResults = false;
      } else {
        this.showNoAnalysisResults = true;
        this.showAnalysisResults = false;
      }


    } else {
      this.showNoObservationsResults = true;
      this.showObservationsResults = false;

    }

    this.showSpinner = false;
  }

  constructor(private fhirService: FHIRService) { }

  clearSearch() {
    this.searchResults = [];
    this.showSearchResults = false;
    this.showNoSearchResults = false;
    this.error = undefined;
    this.selectedPatient = undefined;
    this.clearObservations();
  }

  clearObservations() {
    this.observationsResults = [];
    this.showObservationsResults = false;
    this.showNoObservationsResults = false;
    this.error = undefined;
    this.selectedPatient = undefined;
    this.analysisResults = [];
    this.showNoAnalysisResults = false;
    this.showAnalysisResults = false;
  }
}
