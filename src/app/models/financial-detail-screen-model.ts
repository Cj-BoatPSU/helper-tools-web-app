import { FinancialDetailModel } from './financial-detail-model';
import { FinancialTypeModel } from './financial-type-model';

export interface FinancialDetailScreenModel {
    financialInfoId: number;
	infoTopic: string;
	salary: number;
	use: number;
	balance: number;
    financialTypeList: FinancialTypeModel[];
    financialDetailList: FinancialDetailModel[];
}