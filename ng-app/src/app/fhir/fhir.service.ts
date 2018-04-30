import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

export interface FHIRPatientResource {
  patient: any;
}

export interface FHIRObservationResource {
  patientObservations: any;
}

// e.g.: http://ehr.hdap.gatech.edu:8080/gt-fhir-webapp/base/Patient?family=DEL
export const fhriPaientUrlHTTP = 'http://ehr.hdap.gatech.edu:8080/gt-fhir-webapp/base/Patient';
export const fhriPaientUrlHTTPS  = 'https://ehr.hdap.gatech.edu/gt-fhir-webapp/base/Patient';
//export const fhriPaientUrl = 'http://ehr.hdap.gatech.edu:8080/gt-exact/base/Patient';
//export const fhriPaientUrl = 'https://hapi.fhir.org/baseDstu3/Patient';

// e.g.: http://ehr.hdap.gatech.edu:8080/gt-fhir-webapp/base/Observation
export const fhriObservationUrlHTTP = 'http://ehr.hdap.gatech.edu:8080/gt-fhir-webapp/base/Observation';
export const fhriObservationUrlHTTPS = 'https://ehr.hdap.gatech.edu/gt-fhir-webapp/base/Observation';
//export const fhriObservationUrl = 'http://ehr.hdap.gatech.edu:8080/gt-exact/base/Observation';

export const searchUrl = 'https://npmsearch.com/query';

const httpOptions = {
  headers: new HttpHeaders({
    'x-refresh':  'true'
  })
};

function createSearchHttpOptions(familyName: string, refresh = false) {
  // family name search api
  // e.g., http://hapi.fhir.org/baseDstu3/Patient/?family=Smith
  const params = new HttpParams({ fromObject: { family: familyName } });
  const headerMap = refresh ? {'x-refresh': 'true'} : {};
  const headers = new HttpHeaders(headerMap) ;
  return { headers, params };
}

function createObservationHttpOptions(patientId: string, refresh = false) {
  // family name search api
  // e.g., http://hapi.fhir.org/baseDstu3/Patient/?family=Smith
  const params = new HttpParams({ fromObject: { 'patient._id': patientId } });
  const headerMap = refresh ? {'x-refresh': 'true'} : {};
  const headers = new HttpHeaders(headerMap) ;
  return { headers, params };
}

@Injectable()
export class FHIRService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('FHIRService');
  }

  search (term: string, refresh = false): Observable<FHIRPatientResource[]> {
    // clear if no name
    // if (!term.trim()) { return of([]); }

    const options = createSearchHttpOptions(term, refresh);

    return this.http.get(fhriPaientUrlHTTPS, options).pipe(
    // return this.http.get(fhriUrl).pipe(
      map((data: any) => {
        return data.entry.map(item => ({
          patient: item
          } as FHIRPatientResource )
        );
      }),
      catchError(this.handleError('search', []))
    );

  }


  findPatientObservations (patientId: string, refresh = false): Observable<FHIRObservationResource[]> {
    // clear if no name
    // if (!term.trim()) { return of([]); }

    const options = createObservationHttpOptions(patientId, refresh);

    return this.http.get(fhriObservationUrlHTTPS, options).pipe(
      // return this.http.get(fhriUrl).pipe(
      map((data: any) => {
        return data.entry.map(item => ({
          patientObservations: item
          } as FHIRObservationResource )
        );
      }),
      catchError(this.handleError('findPatientObservations', []))
    );

  }

}
