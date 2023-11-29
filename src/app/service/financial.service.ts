import { Injectable } from '@angular/core';
import { JHttp } from './jhttp';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FinancialDetailScreenModel } from '../models/financial-detail-screen-model';
import { FinancialInfoModel } from '../models/financial-info-model';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  apiName: string = 'ManageData';

  constructor(private http: JHttp) { }

  getFinancialInfoList(): Observable<FinancialInfoModel[]> {
    return this.http.get(this.apiName, 'GetFinancialInfoList')
      .pipe(
        map(o => {
          return o.data as FinancialInfoModel[];
        })
      )
  }

  getFinancialDetail(financialInfoID: string): Observable<FinancialInfoModel[]> {
    let param = {financialInfoID: financialInfoID}
    return this.http.get(this.apiName, 'GetFinancialDetail', param)
      .pipe(
        map(o => {
          return o.data as FinancialInfoModel[];
        })
      )
  }

  saveFinancialDetail(obj: FinancialDetailScreenModel): Observable<FinancialDetailScreenModel> {
    return this.http.post(this.apiName, 'SaveFinancialDetail', obj)
      .pipe(
        map(o => {
          return o as FinancialDetailScreenModel;
        })
      )
  }

  createFinancialInfo(obj: FinancialDetailScreenModel): Observable<boolean> {
    return this.http.post(this.apiName, 'CreateFinancialInfo', obj)
      .pipe(
        map(o => {
          return o as boolean;
        })
      )
  }

  duplicateFinancialInfo(financialInfoID: string): Observable<boolean> {
    let param = {financialInfoID: financialInfoID}
    return this.http.get(this.apiName, 'DuplicateFinancialInfo', param)
      .pipe(
        map(o => {
          return o.data as boolean;
        })
      )
  }

  removeFinancialInfo(financialInfoID: string): Observable<boolean> {
    let param = {financialInfoID: financialInfoID}
    return this.http.get(this.apiName, 'RemoveFinancialInfo', param)
      .pipe(
        map(o => {
          return o.data as boolean;
        })
      )
  }

  resetAutoIncreament(): Observable<boolean> {
    return this.http.get(this.apiName, 'ResetAutoIncreament')
      .pipe(
        map(o => {
          return o.data as boolean;
        })
      )
  }
}