import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class JHttp {
    constructor(
        private http: HttpClient,
        private route: Router
    ) { }


    get(controller: string, action: string, param?: any): Observable<any> {
        let requestUrl = environment.apiUrl + 'Cj-Web-Service/api/' + controller + '/' + action;
        return this.http.get(requestUrl, { params: param });
    }
    post<T>(controller: string, action: string, body?: any, isAlertError: boolean = true): Observable<T> {
        return new Observable<T>(observer => {
            let requestUrl = environment.apiUrl + 'Cj-Web-Service/api/' + controller + '/' + action;
            this.http.post(requestUrl, body).subscribe((result: T) => {
                observer.next(result);
                observer.complete();
            }, error => {
                console.log('error', error)
            });
        });
    }

}