import { STATUS } from "../common/constants";

export class PurchaseOrderInitialState {
    Id: number = undefined;
    Title: string = "PO";
    VendorName: any = null;
    VendorNameId: number = undefined;
    ProjectName: string = "";
    OrderNumber: string = (Math.floor((Math.random() * 9999) + 1000)).toString();
    Date: Date = null;
    PurchaseItem: string = "";
    PurchaseOrderTotal: number = 0.00
    ReceivedItem: string = "";
    Status: string = STATUS.Unfulfilled;
    OrderStatus: boolean = false;
}

export class PurchaseOrderItemState {
    SKU: any = null;
    OrderQty: number = 1;
    UnitPrice: number = 0.00;
    SubTotal: number = 0.00;
}



export class PurchaseOrderFilterInitialState {
    FromDate: Date = null;
    ToDate: Date = null;
    Vendor: any = null;
}