export const LISTS = {
    CATEGORY: {
        NAME: "Category",
        URL: "/Category"
    },
    SUB_CATEGORY: {
        NAME: "SubCategory",
        URL: "/SubCategory"
    },
    METAL_TYPE: {
        NAME: "MetalType",
        URL: "/MetalType"
    },
    VENDOR: {
        NAME: "Vendor",
        URL: "/Vendor"
    },
    STONE_TYPE: {
        NAME: "StoneType",
        URL: "/StoneType"
    },
    STONE_CUT_TYPE: {
        NAME: "StoneCutType",
        URL: "/StoneCutType"
    },
    STONE_QUALITY: {
        NAME: "StoneQuality",
        URL: "/StoneQuality"
    },
    STONE_SHAPE: {
        NAME: "StoneShape",
        URL: "/StoneShape"
    },
    STONE_SIZE: {
        NAME: "StoneSize",
        URL: "/StoneSize"
    },
    STONE_BASE: {
        NAME: "BaseStone",
        URL: "/BaseStone"
    },
    STONE_LISTS: {
        NAME: 'StoneList',
        URL: '/StoneList'
    },
    INVENTORY: {
        NAME: 'Inventory',
        URL: '/Inventory'
    },
    PURCHASE_ORDER: {
        NAME: "PurchaseOrder",
        URL: "/PurchaseOrder"
    },
    LENGTH: {
        NAME: "Length",
        URL: "/Length"
    },
    WIDTH: {
        NAME: "Width",
        URL: "/Width"
    },
    CUSTOMER: {
        NAME: "Customer",
        URL: "/Customer"
    },
    PRICING_SCHEME: {
        NAME: "PricingScheme",
        URL: "/PricingScheme"
    },
    SALES_ORDER: {
        NAME: "SalesOrder",
        URL: "/SalesOrder"
    },
    HEADER: {
        NAME: "Header",
        URL: "/Header"
    },
    BASE_METAL: {
        NAME: "BaseMetal",
        URL: "/BaseMetal"
    },
    BOX_TYPE: {
        NAME: "BoxType",
        URL: "/BoxType"
    },
    CHAIN_TYPE: {
        NAME: "ChainType",
        URL: "/ChainType"
    },
    INSERT_TYPE: {
        NAME: "InsertType",
        URL: "/InsertType"
    },
    PARENTAGE: {
        NAME: "Parentage",
        URL: "/Parentage"
    },
    BACKING_TYPE: {
        NAME: "BackingType",
        URL: "/BackingType"
    },
    RECOVERABLE_COST: {
        NAME: "RecoverableCost",
        URL: "/RecoverableCost"
    },
    REPAIR_REASON: {
        NAME: "RepairReason",
        URL: "/RepairReason"
    },
    RETURN_DISPOSITION: {
        NAME: "ReturnDisposition",
        URL: "/ReturnDisposition"
    },
    ADJUSTMENT_REASON: {
        NAME: "AdjustmentReason",
        URL: "/AdjustmentReason"
    },
    SELLING_PRICE: {
        NAME: "SellingPrice",
        URL: "/SellingPrice"
    },
}

// master data list link
export const CATEGORY_LIST_LINK = "/Lists" + LISTS.CATEGORY.URL + "/AllItems.aspx";
export const SUB_CATEGORY_LIST_LINK = "/Lists" + LISTS.SUB_CATEGORY.URL + "/AllItems.aspx";
export const METAL_TYPE_LIST_LINK = "/Lists" + LISTS.METAL_TYPE.URL + "/AllItems.aspx";
export const VENDOR_LIST_LINK = "/Lists" + LISTS.VENDOR.URL + "/AllItems.aspx";
export const STONE_TYPE_LIST_LINK = "/Lists" + LISTS.STONE_TYPE.URL + "/AllItems.aspx";
export const STONE_CUT_TYPE_LIST_LINK = "/Lists" + LISTS.STONE_CUT_TYPE.URL + "/AllItems.aspx";
export const STONE_QUALITY_LIST_LINK = "/Lists" + LISTS.STONE_QUALITY.URL + "/AllItems.aspx";
export const STONE_SHAPE_LIST_LINK = "/Lists" + LISTS.STONE_SHAPE.URL + "/AllItems.aspx";
export const STONE_SIZE_LIST_LINK = "/Lists" + LISTS.STONE_SIZE.URL + "/AllItems.aspx";
export const STONE_BASE_LIST_LINK = "/Lists" + LISTS.STONE_BASE.URL + "/AllItems.aspx";
export const PRICING_SCHEME_LIST_LINK = "/Lists" + LISTS.PRICING_SCHEME.URL + "/AllItems.aspx";
export const BASE_METAL_LIST_LINK = "/Lists" + LISTS.BASE_METAL.URL + "/AllItems.aspx";
export const LENGTH_LIST_LINK = "/Lists" + LISTS.LENGTH.URL + "/AllItems.aspx";
export const WIDTH_LIST_LINK = "/Lists" + LISTS.WIDTH.URL + "/AllItems.aspx";
export const BOX_TYPE_LIST_LINK = "/Lists" + LISTS.BOX_TYPE.URL + "/AllItems.aspx";
export const CHAIN_TYPE_LIST_LINK = "/Lists" + LISTS.CHAIN_TYPE.URL + "/AllItems.aspx";
export const INSERT_TYPE_LIST_LINK = "/Lists" + LISTS.INSERT_TYPE.URL + "/AllItems.aspx";
export const PARENTAGE_LIST_LINK = "/Lists" + LISTS.PARENTAGE.URL + "/AllItems.aspx";
export const BACKING_TYPE_LIST_LINK = "/Lists" + LISTS.BACKING_TYPE.URL + "/AllItems.aspx";
export const RECOVERABLE_COST_LIST_LINK = "/Lists" + LISTS.RECOVERABLE_COST.URL + "/AllItems.aspx";
export const REPAIR_REASON_LIST_LINK = "/Lists" + LISTS.REPAIR_REASON.URL + "/AllItems.aspx";
export const RETURN_DISPOSITION_LIST_LINK = "/Lists" + LISTS.RETURN_DISPOSITION.URL + "/AllItems.aspx";
export const ADJUSTMENT_REASON_LIST_LINK = "/Lists" + LISTS.ADJUSTMENT_REASON.URL + "/AllItems.aspx";
export const SELLING_PRICE_LIST_LINK = "/Lists" + LISTS.SELLING_PRICE.URL + "/AllItems.aspx";

export class GET_LIST_QUERY_PARAMS {
    public selectProperties: any = ["*"];
    public expandProperties: any = [""];
    public filterQuery: string = ``;
    public topCount: number = 5000;
    public orderByColumn: string = `Id`;
    public orderBy: boolean = true;
};

export const ADMIN_USER_GROUP = "IMS Admin";

export const STATUS = {
    Unfulfilled: "Unfulfilled",
    Fulfilled: "Fulfilled"
};

export const STONE_FIELDS_DATA = [
    "StoneCode",
    "StoneTypeId",
    "StoneShapeId",
    "StoneSizeId",
    "StoneCutTypeId",
    "StoneQualityId",
    "VendorId1",
    "VendorId2",
    "WtEa",
    "WtEaRd",
    "Pct",
    "FOBEa",
    "LanEa",
    "Inactive"
];

export const PRODUCT_FIELDS_DATA = [
    "SKU",
    "MFNSKU",
    "FBASKU",
    "Category",
    "Vendor1",
    "VendorRef1",
    "MtWtFOB",
    "MtWtFeed",
    "MetalType",
    "OnFBA",
    "TierLevel",
    "AmzLaunch",
    "OfficeQty",
    "FBAQty",
    "OnOrder",
    "RestockLevel",
    "ReserveQty",
    "OfficeQtyZeroDate",
    "FBAQtyZeroDate",
    "Return",
    "RingSize",
    "Length",
    "Width",
    "SellingPrice",
    "FOBMountingCost",
    "LDMountCost",
    "MiscCost1",
    "MiscCost1Desc",
    "MiscCost2",
    "MiscCost2Desc",
    "StoneDetails",
    "Description",
    "BagComments",
    "BaseMetal",
    "BaseStone",
    "VIPSKU",
    "BoxType",
    "InsertType",
    "ChainType",
    "BackingType",
    "Gender",
    "Subcategory",
    "Vendor2",
    "VendorRef2",
    "Retired",
    "RetiredDate",
    "WatchList",
    "WatchListDate",
    "ModifiedDate",
    "Parentage",
    "RecoverableCost",
    "Inactive"
];

export const PRODUCT_STONE_DETAILS_FIELDS_DATA = [
    "StoneCode1",
    "StoneQty1",
    "StoneCost1",
    "StoneCode2",
    "StoneQty2",
    "StoneCost2",
    "StoneCode3",
    "StoneQty3",
    "StoneCost3",
    "StoneCode4",
    "StoneQty4",
    "StoneCost4",
    "StoneCode5",
    "StoneQty5",
    "StoneCost5",
    "StoneCode6",
    "StoneQty6",
    "StoneCost6",
    "StoneCode7",
    "StoneQty7",
    "StoneCost7"
];

export const PRODUCT_SELLING_PRICE_FIELDS_DATA = [
    "AmazonSuggested",
    "AmazonActual",
    "PeoraSuggested",
    "PeoraActual",
    "OravoSuggested",
    "OravoActual",
    "SMSuggested",
    "SMActual",
    "ROSuggested",
    "ROActual"
];

export const SAVE_METHOD = {
    save: "Save",
    markAllReceived: "MarkAllReceived",
    fulFilled: "fulFilled",
    unFulFilled: "unFulFilled"
}

export const PURCHASE_ORDER_FIELDS_DATA = [
    "SKU",
    "OrderQty",
    "VendorName",
    "OrderNumber",
    "ProjectName",
    "Date",
    "ReceivedQty",
    "ReceivedDate",
];
export const SHEET_COLUMNS = [
    {
        header: "Picture",
        key: "img",
        width: 15,
    },
    { header: "No", key: "no", width: 10 },
    {
        header: "SKU",
        key: "SKU",
        width: 15,
    },
    {
        header: "Ref No",
        key: "refNo",
        width: 15,
    },
    {
        header: "Ring Size",
        key: "ringSize",
        width: 15,
    },
    {
        header: "Metal Type",
        key: "metalType",
        width: 20,
    },
    {
        header: "Jewelry Qty",
        key: "orderQty",
        width: 15,
    },
    {
        header: "Stone No",
        key: "stoneNo",
        width: 10,
    },
    {
        header: "Type",
        key: "stoneType",
        width: 15,
    },
    {
        header: "Shape",
        key: "stoneShape",
        width: 15,
    },
    {
        header: "Size",
        key: "stoneSize",
        width: 15,
    },
    {
        header: "Cutting",
        key: "stoneCutting",
        width: 15,
    },
    {
        header: "Pcs per jewelry",
        key: "pec",
        width: 15,
    },
    {
        header: "Quality",
        key: "stoneQuality",
        width: 15,
    },
    {
        header: "Total Stone Qty",
        key: "stoneQty",
        width: 15,
    },
    {
        header: "Vendor Code 1",
        key: "vendor1",
        width: 15,

    },
];
