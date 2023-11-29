import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FinancialInfoModel } from '../models/financial-info-model';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../service/financial.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  datas: FinancialInfoModel[] = [];
  // datas: FinancialInfoModel[] = [
  //   {
  //     financialInfoID: 1,
  //     infoTopic: 'December 2023',
  //     salary: 55000,
  //     use: 0,
  //     balance: 0
  //   },
  //   {
  //     financialInfoID: 2,
  //     infoTopic: 'January 2023',
  //     salary: 55000,
  //     use: 0,
  //     balance: 0
  //   }
  // ];

  constructor(private authService: AuthService, private router: Router, private _service: FinancialService) { }

  ngOnInit(): void {
    this._loadData();
  }

  private async _loadData() {
    this._service.getFinancialInfoList().subscribe(async res => {
      this.datas = res as any;
    });
  }

  // logout(): void {
  //   this.authService.logout();
  //   // Redirect to login page after logout
  //   // You may use Angular Router for navigation
  //   console.log('Logout successful!');
  // }

  editBtn(financialInfoID: number = -1) {
    if (financialInfoID == -1) this.router.navigateByUrl('detail');
    else this.router.navigateByUrl(`detail/${financialInfoID}`);
  }

  async removeBtn(financialInfoID: string) {
    await this._service.removeFinancialInfo(financialInfoID).subscribe(async res => {
      this.datas = res as any;
      this._loadData();
      alert("Remove Success");
    });
  }

  add() {
    this.router.navigateByUrl('/detail');
  }

  async duplicateBtn(financialInfoID: string) {
    await this._service.duplicateFinancialInfo(financialInfoID).subscribe(async res => {
      this.datas = res as any;
      await this._loadData();
      alert("Duplicate Success");
    });
  }

  async resetAutoIncreament(){
    await this._service.resetAutoIncreament().subscribe(async res => {
      this.datas = res as any;
      alert("ResetAutoIncreament Success");
    });
  }
}
