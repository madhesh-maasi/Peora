import { STATUS } from "../common/constants";

export class SalesOrderInitialState {
    Id: number = undefined;
    Title: string = "SO";
    Customer: any = null;
    CustomerId: number = undefined;
    OrderNumber: string = "";
    Date: Date = null;
    Status: string = STATUS.Unfulfilled;
    PricingScheme: any = null;
    PricingSchemeId: number = undefined;
    Contact: string = "";
    Phone: string = "";
    BillingAddress: string = "";
    ShippingAddress: string = "";
    SalesOrderItems: string = "";
    SalesOrderTotal: number = 0.00;
}

export class SalesOrderItemState {
    SKUId: number = undefined;
    SKU: any = null;
    OrderQty: number = undefined;
    UnitPrice: number = undefined;
    SubTotal: number = 0.00;
}

export class SalesOrderFilterInitialState {
    FromDate: Date = null;
    ToDate: Date = null;
    Customer: string = "";
}