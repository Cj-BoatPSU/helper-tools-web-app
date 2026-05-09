import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FinancialInfoModel } from '../models/financial-info-model';
import { Router } from '@angular/router';
import { FinancialService } from '../service/financial.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  datas: FinancialInfoModel[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private _service: FinancialService
  ) {}

  ngOnInit(): void {
    this._loadData();
  }

  // ---- Computed properties สำหรับ Summary Cards ----

  get totalSalary(): number {
    return this.datas.reduce((sum, d) => sum + (d.salary ?? 0), 0);
  }

  get totalBalance(): number {
    return this.datas.reduce((sum, d) => sum + (d.balance ?? 0), 0);
  }

  // ---- Data ----

  private _loadData(): void {
    this._service.getFinancialInfoList().subscribe(res => {
      this.datas = res as any;
    });
  }

  // ---- Actions ----

  editBtn(financialInfoID: number = -1): void {
    if (financialInfoID === -1) this.router.navigateByUrl('detail');
    else this.router.navigateByUrl(`detail/${financialInfoID}`);
  }

  removeBtn(financialInfoID: string): void {
    this._service.removeFinancialInfo(financialInfoID).subscribe(() => {
      this._loadData();
      alert('Remove Success');
    });
  }

  add(): void {
    this.router.navigateByUrl('/detail');
  }

  duplicateBtn(financialInfoID: string): void {
    this._service.duplicateFinancialInfo(financialInfoID).subscribe(() => {
      this._loadData();
      alert('Duplicate Success');
    });
  }

  resetAutoIncreament(): void {
    this._service.resetAutoIncreament().subscribe(() => {
      this._loadData();
      alert('ResetAutoIncreament Success');
    });
  }
}