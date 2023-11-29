import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialDetailScreenModel } from '../../models/financial-detail-screen-model';
import { FinancialDetailModel } from '../../models/financial-detail-model';
import { FinancialService } from '../../service/financial.service';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  data: FinancialDetailScreenModel = {
    financialInfoId: 0,
    infoTopic: '',
    salary: 0,
    use: 0,
    balance: 0,
    financialTypeList: [
      {
        typeId: 1,
        type: 'Need',
        percent: 50,
        value: 0,
        financialInfoId: 0,
        use: 0,
        balance: 0
      },
      {
        typeId: 2,
        type: 'Want',
        percent: 30,
        value: 0,
        financialInfoId: 0,
        use: 0,
        balance: 0
      },
      {
        typeId: 3,
        type: 'Saving',
        percent: 20,
        value: 0,
        financialInfoId: 0,
        use: 0,
        balance: 0
      }
    ],
    financialDetailList: []
  };
  // data: FinancialDetailScreenModel = {
  //   financialInfoId: 1,
  //   infoTopic: 'December 2023',
  //   salary: 55000,
  //   use: 0,
  //   balance: 0,
  //   financialTypeList: [
  //     {
  //       typeId: 1,
  //       type: 'Need',
  //       percent: 50,
  //       value: 0,
  //       financialInfoId: 1,
  //       use: 0,
  //       balance: 0
  //     },
  //     {
  //       typeId: 2,
  //       type: 'Want',
  //       percent: 30,
  //       value: 0,
  //       financialInfoId: 1,
  //       use: 0,
  //       balance: 0
  //     },
  //     {
  //       typeId: 3,
  //       type: 'Saving',
  //       percent: 20,
  //       value: 0,
  //       financialInfoId: 1,
  //       use: 0,
  //       balance: 0
  //     }
  //   ],
  //   financialDetailList: [
  //     {
  //       financialDetailId: 1,
  //       financialInfoId: 1,
  //       typeId: 1,
  //       topic: 'ให้น้อง',
  //       amount: 3000,
  //       _IsEdit: false
  //     },
  //     {
  //       financialDetailId: 2,
  //       financialInfoId: 1,
  //       typeId: 2,
  //       topic: 'งบเที่ยว',
  //       amount: 4000,
  //       _IsEdit: false
  //     },
  //     {
  //       financialDetailId: 3,
  //       financialInfoId: 1,
  //       typeId: 3,
  //       topic: 'เก็บ',
  //       amount: 5000,
  //       _IsEdit: false
  //     }
  //   ]
  // };
  mode: 'add' | 'edit' = 'add';
  private _id: string = '';
  _isEdit_Salary: boolean = false;

  constructor(private arouter: ActivatedRoute, private router: Router, private _service: FinancialService) {
    this.arouter.params.subscribe(res => {
      if (res.id) {
        this.mode = 'edit';
        this._id = res.id
      }
      else {
        this.mode = 'add';
      }
    })
    console.log('mode: ', this.mode);
    console.log('_id: ', this._id);
  }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this._loadData();
    }

    this.data.financialDetailList.forEach(el => {
      el._IsEdit = false;
    });

    this.data.financialTypeList.forEach(el => {
      el.value = this.data.salary * (el.percent / 100);
    });
  }

  private async _loadData() {
    this._service.getFinancialDetail(this._id).subscribe(async res => {
      this.data = res as any;
    });
  }

  back() {
    this.router.navigateByUrl('/home');
  }

  editSalary() {
    this._isEdit_Salary = true;
  }

  saveSalary() {
    this._isEdit_Salary = false;
    this.cal();
  }

  editDetail(data: FinancialDetailModel) {
    data._IsEdit = true;
  }

  reserveBtn(data: FinancialDetailModel) {
    data._IsEdit = false;
  }

  async cal() {
    //reset
    this.data.use = 0;
    this.data.balance = 0;
    await this.data.financialTypeList.forEach(el => {
      el.value = Number((this.data.salary * (el.percent / 100)).toFixed(0));
      el.use = 0;
      el.balance = 0;
    });
    //calcurate
    await this.data.financialDetailList.forEach(el => {
      this.data.use = Number((this.data.use + el.amount).toFixed(2));
    });
    this.data.use = Number((this.data.use).toFixed(2));
    this.data.balance = Number((this.data.salary - this.data.use).toFixed(2));

    await this.data.financialTypeList.forEach(el => {
      let type: FinancialDetailModel[] = this.data.financialDetailList.filter(o => o.typeId == el.typeId);
      type.forEach(item => {
        el.use = Number((el.use + item.amount).toFixed(2));
      });
      el.balance = Number((el.value - el.use).toFixed(2));
    });
  }

  add() {
    let new_item: FinancialDetailModel = {
      financialDetailId: 0,
      financialInfoId: this.data.financialInfoId,
      typeId: 1, //default
      topic: '',
      amount: 0,
      _IsEdit: true
    };

    this.data.financialDetailList.push(new_item);
  }

  async save() {
    await this.cal();
    console.log('data: ', this.data);
    if (this.mode === 'edit') {
      this._service.saveFinancialDetail(this.data).subscribe(async res => {
        this.data = res as any;
      });
    }

    if (this.mode === 'add') {
      this._service.createFinancialInfo(this.data).subscribe(async res => {
        this.data = res as any;
      });

      this.router.navigateByUrl(`home`);
    }

    // alert("Save Success");
  }

  remove(data: FinancialDetailModel) {
    this.data.financialDetailList = this.data.financialDetailList.filter(o => o.financialDetailId != data.financialDetailId);
    this.cal();
  }

  saveChangeDetail(data: FinancialDetailModel) {
    data._IsEdit = false;
    this.cal();
  }
}
