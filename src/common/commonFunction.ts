
import { getAllSPListItems, getSPListItems } from "../services/SPServices";
import { GET_LIST_QUERY_PARAMS, LISTS } from "./constants";

export const getMasterListsData = async (listName: string, selectProperties: any = ["*"], expandProperties: any = [""]) => {
    let queryParams = new GET_LIST_QUERY_PARAMS();
    // queryParams.filterQuery = `Inactive eq '${false}'`;
    const listData = await getSPListItems(
        listName,
        selectProperties,
        expandProperties,
        queryParams.filterQuery,
        queryParams.topCount,
        queryParams.orderByColumn,
        queryParams.orderBy
    );

    return listData;
};

export const getAllStoneItems = async () => {
    let queryParams = new GET_LIST_QUERY_PARAMS();
    queryParams.selectProperties = ["*,Attachments,AttachmentFiles,StoneTypeId/Id,StoneTypeId/StoneTypeName,StoneShapeId/Id,StoneShapeId/StoneShapeName,StoneSizeId/Id,StoneSizeId/StoneSizeName,StoneCutTypeId/Id,StoneCutTypeId/StoneCutTypeName,StoneQualityId/Id,StoneQualityId/StoneQualityName,VendorId1/Id,VendorId1/VendorName,VendorId2/Id,VendorId2/VendorName"];
    queryParams.expandProperties = ["AttachmentFiles,StoneTypeId,StoneShapeId,StoneSizeId,StoneCutTypeId,StoneQualityId,VendorId1,VendorId2"];
    // queryParams.filterQuery = `Inactive eq '${false}'`;
    let allStoneItems = await getAllSPListItems(
        LISTS.STONE_LISTS.NAME,
        queryParams.selectProperties,
        queryParams.expandProperties,
        queryParams.filterQuery,
        queryParams.topCount,
        queryParams.orderByColumn,
        queryParams.orderBy
    );

    return allStoneItems;
}

export const getAllPurchaseOrder = async () => {
    let queryParams = new GET_LIST_QUERY_PARAMS();
    queryParams.selectProperties = ["*,Attachments,AttachmentFiles,VendorName/Id,VendorName/VendorName"];
    queryParams.expandProperties = ["AttachmentFiles,VendorName"];
    const purchaseOrder = await getAllSPListItems(
        LISTS.PURCHASE_ORDER.NAME,
        queryParams.selectProperties,
        queryParams.expandProperties,
        queryParams.filterQuery,
        queryParams.topCount,
        queryParams.orderByColumn,
        queryParams.orderBy
    );
    return purchaseOrder;
}

export const getAllSalesOrder = async () => {
    let queryParams = new GET_LIST_QUERY_PARAMS();
    queryParams.selectProperties = ["*,Attachments,AttachmentFiles,Customer/Id,Customer/CustomerName,PricingScheme/Id,PricingScheme/Title"];
    queryParams.expandProperties = ["AttachmentFiles,Customer,PricingScheme"];
    const allSalesOrder = await getAllSPListItems(
        LISTS.SALES_ORDER.NAME,
        queryParams.selectProperties,
        queryParams.expandProperties,
        queryParams.filterQuery,
        queryParams.topCount,
        queryParams.orderByColumn,
        queryParams.orderBy
    );

    return allSalesOrder;
}

export const getAllInventories = async () => {
    let queryParams = new GET_LIST_QUERY_PARAMS();
    queryParams.selectProperties = ["*,Attachments,AttachmentFiles,Category/Id,Category/CatName,Vendor/Id,Vendor/VendorName,MetalType/Id,MetalType/MetalTypeName,Length/Id,Length/Title,Width/Id,Width/Title,BoxType/Id,BoxType/Title,InsertType/Id,InsertType/Title,ChainType/Id,ChainType/Title,BackingType/Id,BackingType/Title,Subcategory/Id,Subcategory/SubCatName,Vendor2/Id,Vendor2/VendorName"];
    queryParams.expandProperties = ["AttachmentFiles,Category,Vendor,MetalType,Length,Width,BoxType,InsertType,ChainType,BackingType,Subcategory,Vendor2"];
    let allInventoryItems = await getAllSPListItems(
        LISTS.INVENTORY.NAME,
        queryParams.selectProperties,
        queryParams.expandProperties,
        queryParams.filterQuery,
        queryParams.topCount,
        queryParams.orderByColumn,
        queryParams.orderBy
    );

    return allInventoryItems;
}

export const setOtherLookupData = async (mainData, remainingLookUpData) => {

    const allData = mainData.map(x => {
        remainingLookUpData.forEach(ele => {
            x[ele.name] = ele.data && ele.data.length > 0 ? ele.data.filter(item => item.Id === x[ele.name + "Id"])[0] : null
        });

        return x;
    })

    return allData;
}

export const formatCurrency = (value) => {
    if (value) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
};

export const formatCurrency3 = (value) => {
    if (value) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 3, maximumFractionDigits: 3 });
    }
};
