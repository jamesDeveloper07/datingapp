import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PagionationResult } from "../_models/pagination";

export function getPaginationResult<T>(url, params, http: HttpClient) {
  const paginationResult: PagionationResult<T> = new PagionationResult<T>();
  return http.get<T>(url, { observe: 'response', params }).pipe(
    map(response => {
      paginationResult.result = response.body;
      if (response.headers.get('Pagination') !== null) {
        paginationResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginationResult;
    })
  );
}

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());

  return params;
}
