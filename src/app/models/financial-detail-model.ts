export interface FinancialDetailModel {
    financialDetailId: number;
	financialInfoId: number;
	typeId: number;
	topic: string;
	amount: number;
	alreadyPaid: boolean;

	_IsEdit: boolean;
}