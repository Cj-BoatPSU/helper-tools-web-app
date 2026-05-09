import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialDetailScreenModel } from '../../models/financial-detail-screen-model';
import { FinancialDetailModel } from '../../models/financial-detail-model';
import { FinancialService } from '../../service/financial.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {

  data: FinancialDetailScreenModel = {
    financialInfoId: 0,
    infoTopic: '',
    salary: 0,
    use: 0,
    balance: 0,
    financialTypeList: [
      { typeId: 1, type: 'Need',   percent: 50, value: 0, financialInfoId: 0, use: 0, balance: 0 },
      { typeId: 2, type: 'Want',   percent: 30, value: 0, financialInfoId: 0, use: 0, balance: 0 },
      { typeId: 3, type: 'Saving', percent: 20, value: 0, financialInfoId: 0, use: 0, balance: 0 },
    ],
    financialDetailList: [],
  };

  mode: 'add' | 'edit' = 'add';
  private _id: string = '';
  _isEdit_Salary: boolean = false;

  constructor(
    private arouter: ActivatedRoute,
    private router: Router,
    private _service: FinancialService
  ) {
    this.arouter.params.subscribe(res => {
      if (res['id']) {
        this.mode = 'edit';
        this._id = res['id'];
      } else {
        this.mode = 'add';
      }
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this._loadData();
    }

    this.data.financialDetailList.forEach(el => {
      el._IsEdit = false;
    });

    this._recalcTypeValues();
  }

  // ---- Data ----

  private _loadData(): void {
    this._service.getFinancialDetail(this._id).subscribe(res => {
      this.data = res as any;
    });
  }

  // ---- Navigation ----

  back(): void {
    this.router.navigateByUrl('/home');
  }

  // ---- Salary ----

  editSalary(): void {
    this._isEdit_Salary = true;
  }

  saveSalary(): void {
    this._isEdit_Salary = false;
    this.cal();
  }

  // ---- Detail row actions ----

  editDetail(data: FinancialDetailModel): void {
    data._IsEdit = true;
  }

  saveChangeDetail(data: FinancialDetailModel): void {
    data._IsEdit = false;
    this.cal();
  }

  reserveBtn(data: FinancialDetailModel): void {
    data._IsEdit = false;
  }

  remove(data: FinancialDetailModel): void {
    this.data.financialDetailList = this.data.financialDetailList.filter(
      o => o.financialDetailId !== data.financialDetailId
    );
    this.cal();
  }

  add(): void {
    const newItem: FinancialDetailModel = {
      financialDetailId: 0,
      financialInfoId: this.data.financialInfoId,
      typeId: 1,
      topic: '',
      amount: 0,
      alreadyPaid: false,
      _IsEdit: true,
    };
    this.data.financialDetailList.push(newItem);
  }

  // ---- Calculate ----

  cal(): void {
    // Reset totals
    this.data.use = 0;
    this.data.balance = 0;
    this._recalcTypeValues();

    // Sum up all expenses
    this.data.use = Number(
      this.data.financialDetailList
        .reduce((sum, el) => sum + el.amount, 0)
        .toFixed(2)
    );
    this.data.balance = Number((this.data.salary - this.data.use).toFixed(2));

    // Sum per type
    this.data.financialTypeList.forEach(el => {
      const matchedItems = this.data.financialDetailList.filter(
        o => o.typeId == el.typeId
      );
      el.use = Number(
        matchedItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2)
      );
      el.balance = Number((el.value - el.use).toFixed(2));
    });
  }

  // ---- Save ----

  async save(): Promise<void> {
    this.cal();

    if (this.mode === 'edit') {
      this._service.saveFinancialDetail(this.data).subscribe(res => {
        this.data = res as any;
        alert('Save Success');
      });
    }

    if (this.mode === 'add') {
      this._service.createFinancialInfo(this.data).subscribe(() => {
        this.router.navigateByUrl('home');
      });
    }
  }

  // ---- Private helpers ----

  private _recalcTypeValues(): void {
    this.data.financialTypeList.forEach(el => {
      el.value = Number((this.data.salary * (el.percent / 100)).toFixed(0));
      el.use = 0;
      el.balance = 0;
    });
  }
}