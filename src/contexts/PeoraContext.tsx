import * as  React from 'react';
import { createContext, useState, useEffect } from 'react';
import { getAllInventories, getAllPurchaseOrder, getAllSalesOrder, getAllStoneItems, getMasterListsData } from '../common/commonFunction';
import { LISTS } from '../common/constants';

export const PeoraContext = createContext(null);

const PeoraContextProvider = (props: any) => {

    const [product, setProduct] = useState([]);
    const [productCategoryData, setProductCategoryData] = useState([]);
    const [productSubCategoryData, setProductSubCategoryData] = useState([]);
    const [productMetalTypeData, setProductMetalTypeData] = useState([]);
    const [stoneTypeData, setStoneTypeData] = useState([]);
    const [stoneShapeData, setStoneShapeData] = useState([]);
    const [stoneSizeData, setStoneSizeData] = useState([]);
    const [stoneCutTypeData, setStoneCutTypeData] = useState([]);
    const [stoneQualityData, setStoneQualityData] = useState([]);
    const [allVendorData, setAllVendorData] = useState([]);
    const [allStoneData, setAllStoneData] = useState([]);
    const [allLengthData, setAllLengthData] = useState([]);
    const [allWidthData, setAllWidthData] = useState([]);
    const [allInventoryData, setAllInventoryData] = useState([]);
    const [allPricingSchemeData, setAllPricingSchemeData] = useState([]);
    const [allCustomerData, setAllCustomerData] = useState([]);
    const [allSalesOrderData, setAllSalesOrderData] = useState([]);
    const [allMenuData, setAllMenuData] = useState([]);
    const [allRecoverableCost, setAllRecoverableCost] = useState([]);
    const [allSellingPrice, setAllSellingPrice] = useState([]);



    const [allBaseMetal, setAllBaseMetal] = useState([]);
    const [allBaseStone, setAllBaseStone] = useState([]);
    const [allBoxType, setAllBoxType] = useState([]);
    const [allInsertType, setAllInsertType] = useState([]);
    const [allChainType, setAllChainType] = useState([]);
    const [allBackingType, setAllBackingType] = useState([]);
    const [allParentage, setAllParentage] = useState([]);

    // Refactor dropdown data useState
    const [refactorStoneTypeData, setRefactorStoneTypeData] = useState([]);
    const [refactorStoneShapeData, setRefactorStoneShapeData] = useState([]);
    const [refactorStoneSizeData, setRefactorStoneSizeData] = useState([]);
    const [refactorStoneCutTypeData, setRefactorStoneCutTypeData] = useState([]);
    const [refactorStoneQualityData, setRefactorStoneQualityData] = useState([]);
    const [refactorAllVendorData, setRefactorAllVendorData] = useState([]);
    const [refactorProductCategoryData, setRefactorProductCategoryData] = useState([]);
    const [refactorProductSubCategoryData, setRefactorProductSubCategoryData] = useState([]);
    const [refactorMetalData, setRefactorMetalData] = useState([]);
    const [refactorLengthData, setRefactorLengthData] = useState([]);
    const [refactorWidthData, setRefactorWidthData] = useState([]);
    const [refactorAllPricingSchemeData, setRefactorAllPricingSchemeData] = useState([]);
    const [refactorAllCustomerData, setRefactorAllCustomerData] = useState([]);
    const [refactorAllInventoryData, setRefactorAllInventoryData] = useState([]);

    const [refactorAllBaseMetal, setRefactorAllBaseMetal] = useState([]);
    const [refactorAllBaseStone, setRefactorAllBaseStone] = useState([]);
    const [refactorAllBoxType, setRefactorAllBoxType] = useState([]);
    const [refactorAllInsertType, setRefactorAllInsertType] = useState([]);
    const [refactorAllChainType, setRefactorAllChainType] = useState([]);
    const [refactorAllBackingType, setRefactorAllBackingType] = useState([]);
    const [refactorAllParentage, setRefactorAllParentage] = useState([]);

    const [refactorAllRecoverableCost, setRefactorAllRecoverableCost] = useState([]);

    const [refactorAllSellingPrice, setRefactorAllSellingPrice] = useState([]);

    // Purchase Order useState
    const [purchaseOrderData, setPurchaseOrderData] = useState(null);
    const [allPurchaseOrder, setAllPurchaseOrder] = useState([]);

    const [masterDataTabIndex, setMasterDataTabIndex] = useState(0);
    const [masterDataRoute, setMasterDataRoute] = useState(null);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        getAllProductCategoryData();
        getAllProductSubCategoryData();
        getAllProductMetalTypeData();
        getAllStoneTypeData();
        getAllStoneShapeData();
        getAllStoneSizeData();
        getAllStoneCutTypeData();
        getAllStoneQualityData();
        getAllVendorData();
        getAllStones();
        getPurchaseOrder();
        getLengthData();
        getWidthData();
        getAllPricingScheme();
        getAllCustomer();
        getAllSalesOrderData();
        getAllBaseMetal();
        getAllBaseStone();
        getAllBoxType();
        getAllInsertType();
        getAllChainType();
        getAllBackingType();
        getAllParentage();
        getAllInventory();
        getHeaderMenuData();
        getRecoverableCost();
        getAllSellingPrice();
    }, []);

    const getAllProductCategoryData = async () => {
        const categoryData = await getMasterListsData(LISTS.CATEGORY.NAME);
        let preparedCategoryData = categoryData?.map((ele) => {
            return { Id: ele?.Id, CatName: ele?.CatName }
        });
        preparedCategoryData.sort((a, b) => {
            if (a.CatName < b.CatName) {
                return -1;
            }
            if (a.CatName > b.CatName) {
                return 1;
            }
            return 0;
        });
        setProductCategoryData(categoryData);
        setRefactorProductCategoryData(preparedCategoryData);
    };

    const getAllProductSubCategoryData = async () => {
        const subCategoryData = await getMasterListsData(LISTS.SUB_CATEGORY.NAME);
        const preparedSubCategoryData = subCategoryData?.map((ele) => {
            return { Id: ele?.Id, SubCatName: ele?.SubCatName }
        });
        preparedSubCategoryData.sort((a, b) => {
            if (a.SubCatName < b.SubCatName) {
                return -1;
            }
            if (a.SubCatName > b.SubCatName) {
                return 1;
            }
            return 0;
        });
        setProductSubCategoryData(subCategoryData);
        setRefactorProductSubCategoryData(preparedSubCategoryData);
    };

    const getAllProductMetalTypeData = async () => {
        const metalData = await getMasterListsData(LISTS.METAL_TYPE.NAME);
        const preparedMetalData = metalData?.map((ele) => {
            return { Id: ele?.Id, MetalTypeName: ele?.MetalTypeName }
        });
        preparedMetalData.sort((a, b) => {
            if (a.MetalTypeName < b.MetalTypeName) {
                return -1;
            }
            if (a.MetalTypeName > b.MetalTypeName) {
                return 1;
            }
            return 0;
        });
        setProductMetalTypeData(metalData);
        setRefactorMetalData(preparedMetalData);
    };

    const getAllStoneTypeData = async () => {
        const stoneTypeData = await getMasterListsData(LISTS.STONE_TYPE.NAME);
        setStoneTypeData(stoneTypeData);
        const preparedStoneTypesData = stoneTypeData?.map((ele) => {
            return { Id: ele?.Id, StoneTypeName: ele?.StoneTypeName }
        });
        setRefactorStoneTypeData(preparedStoneTypesData);
    };

    const getAllStoneShapeData = async () => {
        const stoneShapeData = await getMasterListsData(LISTS.STONE_SHAPE.NAME);
        setStoneShapeData(stoneShapeData);
        const preparedStoneShapeData = stoneShapeData?.map((ele) => {
            return { Id: ele?.Id, StoneShapeName: ele?.StoneShapeName }
        });
        preparedStoneShapeData.sort((a, b) => {
            if (a.StoneShapeName < b.StoneShapeName) {
                return -1;
            }
            if (a.StoneShapeName > b.StoneShapeName) {
                return 1;
            }
            return 0;
        });
        setRefactorStoneShapeData(preparedStoneShapeData);
    };

    const getAllStoneSizeData = async () => {
        const stoneSizeData = await getMasterListsData(LISTS.STONE_SIZE.NAME);
        setStoneSizeData(stoneSizeData);
        const preparedStoneSizeData = stoneSizeData?.map((ele) => {
            return { Id: ele?.Id, StoneSizeName: ele?.StoneSizeName }
        });
        preparedStoneSizeData.sort((a, b) => {
            if (a.StoneSizeName < b.StoneSizeName) {
                return -1;
            }
            if (a.StoneSizeName > b.StoneSizeName) {
                return 1;
            }
            return 0;
        });
        setRefactorStoneSizeData(preparedStoneSizeData);
    };

    const getAllStoneCutTypeData = async () => {
        const stoneCutData = await getMasterListsData(LISTS.STONE_CUT_TYPE.NAME);
        setStoneCutTypeData(stoneCutData);
        const preparedStoneCutTypeData = stoneCutData?.map((ele) => {
            return { Id: ele?.Id, StoneCutTypeName: ele?.StoneCutTypeName }
        });
        preparedStoneCutTypeData.sort((a, b) => {
            if (a.StoneCutTypeName < b.StoneCutTypeName) {
                return -1;
            }
            if (a.StoneCutTypeName > b.StoneCutTypeName) {
                return 1;
            }
            return 0;
        });
        setRefactorStoneCutTypeData(preparedStoneCutTypeData);
    };

    const getAllStoneQualityData = async () => {
        const stoneQualityData = await getMasterListsData(LISTS.STONE_QUALITY.NAME);
        setStoneQualityData(stoneQualityData);
        const preparedStoneQualityData = stoneQualityData?.map((ele) => {
            return { Id: ele?.Id, StoneQualityName: ele?.StoneQualityName }
        });
        preparedStoneQualityData.sort((a, b) => {
            if (a.StoneQualityName < b.StoneQualityName) {
                return -1;
            }
            if (a.StoneQualityName > b.StoneQualityName) {
                return 1;
            }
            return 0;
        });
        setRefactorStoneQualityData(preparedStoneQualityData);
    };

    const getAllVendorData = async () => {
        const vendorMasterData = await getMasterListsData(LISTS.VENDOR.NAME);
        setAllVendorData(vendorMasterData);
        const preparedAllVendorData = vendorMasterData?.map((ele) => {
            return { Id: ele?.Id, VendorName: ele?.VendorName }
        });
        preparedAllVendorData.sort((a, b) => {
            if (a.VendorName < b.VendorName) {
                return -1;
            }
            if (a.VendorName > b.VendorName) {
                return 1;
            }
            return 0;
        });
        setRefactorAllVendorData(preparedAllVendorData);
    };

    const getAllStones = async () => {
        const stoneData = await getAllStoneItems();
        setAllStoneData(stoneData);
    };

    const getPurchaseOrder = async () => {
        const allPurchaseOrder = await getAllPurchaseOrder();
        setAllPurchaseOrder(allPurchaseOrder);
    }

    const getLengthData = async () => {
        const allLengthData = await getMasterListsData(LISTS.LENGTH.NAME);
        const preparedLengthData = allLengthData?.map((ele) => {
            return { Id: ele?.Id, Title: ele?.Title }
        });
        preparedLengthData.sort((a, b) => {
            if (a.Title < b.Title) {
                return -1;
            }
            if (a.Title > b.Title) {
                return 1;
            }
            return 0;
        });
        setAllLengthData(allLengthData);
        setRefactorLengthData(preparedLengthData);
    }

    const getWidthData = async () => {
        const allWidthData = await getMasterListsData(LISTS.WIDTH.NAME);
        const preparedWidthData = allWidthData?.map((ele) => {
            return { Id: ele?.Id, Title: ele?.Title }
        });
        preparedWidthData.sort((a, b) => {
            if (a.Title < b.Title) {
                return -1;
            }
            if (a.Title > b.Title) {
                return 1;
            }
            return 0;
        });
        setAllWidthData(allWidthData);
        setRefactorWidthData(preparedWidthData);
    }

    const getAllInventory = async () => {
        const inventory = await getAllInventories();
        setAllInventoryData(inventory);
        const preparedAllInventoryData = inventory?.map((ele) => {
            return { Id: ele?.Id, Title: ele?.Title, Description: ele?.Description, OfficeQty: ele?.OfficeQty, TotalCost: ele?.TotalCost }
        });

        setRefactorAllInventoryData(preparedAllInventoryData);
    };

    const getAllPricingScheme = async () => {
        const allPricingScheme = await getMasterListsData(LISTS.PRICING_SCHEME.NAME);
        setAllPricingSchemeData(allPricingScheme);
        const preparedAllPricingSchemeData = allPricingScheme?.map((ele) => {
            return { Id: ele?.Id, Title: ele?.Title }
        });
        setRefactorAllPricingSchemeData(preparedAllPricingSchemeData);
    };

    const getAllCustomer = async () => {
        const allCustomers = await getMasterListsData(LISTS.CUSTOMER.NAME);
        setAllCustomerData(allCustomers);
        const preparedAllCustomerData = allCustomers?.map((ele) => {
            return { Id: ele?.Id, CustomerName: ele?.CustomerName }
        });
        setRefactorAllCustomerData(preparedAllCustomerData);
    };

    const getAllSalesOrderData = async () => {
        const salesOrderData = await getAllSalesOrder();
        setAllSalesOrderData(salesOrderData);
    };

    const getAllBaseMetal = async () => {
        const allBaseMetal = await getMasterListsData(LISTS.BASE_METAL.NAME);
        setAllBaseMetal(allBaseMetal);

        const preparedAllBaseMetal = allBaseMetal?.map((ele) => {
            return { Id: ele?.Id, Title: ele?.Title }
        });
        preparedAllBaseMetal.sort((a, b) => {
            if (a.Title < b.Title) {
                return -1;
            }
            if (a.Title > b.Title) {
                return 1;
            }
            return 0;
        });

        setRefactorAllBaseMetal(preparedAllBaseMetal);
    };

    const getAllBaseStone = async () => {
        const allBaseStone = await getMasterListsData(LISTS.STONE_BASE.NAME);
        setAllBaseStone(allBaseStone);

        const preparedAllBaseStone = allBaseStone?.map((ele) => {
            return { Id: ele?.Id, Title: ele?.Title }
        });

        setRefactorAllBaseStone(preparedAllBaseStone);
    };

    const getAllBoxType = async () => {
        const selectProperties = ["*,BaseMetal/Title,BaseMetal/Id"];
        const expandProperties = ["BaseMetal"];

        const allBoxType = await getMasterListsData(LISTS.BOX_TYPE.NAME, selectProperties, expandProperties);
        setAllBoxType(allBoxType);

        const preparedAllBoxType = allBoxType?.map((ele) => {
            return { Id: ele?.Id, Title: ele?.Title }
        });

        preparedAllBoxType.sort((a, b) => {
            if (a.Title < b.Title) {
                return -1;
            }
            if (a.Title > b.Title) {
                return 1;
            }
            return 0;
        });

        setRefactorAllBoxType(preparedAllBoxType);
    };

    const getAllInsertType = async () => {

        const selectProperties = ["*,BaseMetal/Title,BaseMetal/Id,Category/CatName,Category/Id"];
        const expandProperties = ["BaseMetal,Category"];

        const allInsertType = await getMasterListsData(LISTS.INSERT_TYPE.NAME, selectProperties, expandProperties);
        setAllInsertType(allInsertType);
        const preparedAllInsertType = allInsertType?.map((ele) => {
            return { Id: ele?.Id, Title: ele?.Title }
        });

        preparedAllInsertType.sort((a, b) => {
            if (a.Title < b.Title) {
                return -1;
            }
            if (a.Title > b.Title) {
                return 1;
            }
            return 0;
        });

        setRefactorAllInsertType(preparedAllInsertType);
    };

    const getAllChainType = async () => {

        const selectProperties = ["*,Metal/MetalTypeName,Metal/Id,Category/CatName,Category/Id"];
        const expandProperties = ["Metal,Category"];

        const allChainType = await getMasterListsData(LISTS.CHAIN_TYPE.NAME, selectProperties, expandProperties);
        setAllChainType(allChainType);

        const preparedAllChainType = allChainType?.map((ele) => {
            return { Id: ele?.Id, Title: ele?.Title }
        });
        preparedAllChainType.sort((a, b) => {
            if (a.Title < b.Title) {
                return -1;
            }
            if (a.Title > b.Title) {
                return 1;
            }
            return 0;
        });

        setRefactorAllChainType(preparedAllChainType);
    };

    const getAllBackingType = async () => {

        const selectProperties = ["*,Metal/MetalTypeName,Metal/Id,Category/CatName,Category/Id"];
        const expandProperties = ["Metal,Category"];

        const allBackingType = await getMasterListsData(LISTS.BACKING_TYPE.NAME, selectProperties, expandProperties);
        setAllBackingType(allBackingType);

        const preparedAllBackingType = allBackingType?.map((ele) => {
            return { Id: ele?.Id, Title: ele?.Title }
        });
        preparedAllBackingType.sort((a, b) => {
            if (a.Title < b.Title) {
                return -1;
            }
            if (a.Title > b.Title) {
                return 1;
            }
            return 0;
        });

        setRefactorAllBackingType(preparedAllBackingType);
    };

    const getAllParentage = async () => {
        const allParentage = await getMasterListsData(LISTS.PARENTAGE.NAME);
        setAllParentage(allParentage);

        const preparedAllParentage = allParentage?.map((ele) => {
            return { Id: ele?.Id, Title: ele?.Title }
        });

        setRefactorAllParentage(preparedAllParentage);
    };

    const getHeaderMenuData = async () => {
        const allMenu = await getMasterListsData(LISTS.HEADER.NAME);
        setAllMenuData(allMenu);
    }

    const getRecoverableCost = async () => {

        const selectProperties = ["*,Category/CatName,Category/Id"];
        const expandProperties = ["Category"];

        const allRecoverableCost = await getMasterListsData(LISTS.RECOVERABLE_COST.NAME, selectProperties, expandProperties);
        setAllRecoverableCost(allRecoverableCost);

        const preparedAllRecoverableCost = allRecoverableCost?.map((ele) => {
            return { Id: ele?.Id, Cost: ele?.Cost, Category: ele?.Category }
        });

        setRefactorAllRecoverableCost(preparedAllRecoverableCost);
    }

    const getAllSellingPrice = async () => {

        const selectProperties = ["*,BaseMetal/Title,BaseMetal/Id"];
        const expandProperties = ["BaseMetal"];

        const allSellingPrice = await getMasterListsData(LISTS.SELLING_PRICE.NAME, selectProperties, expandProperties);
        setAllSellingPrice(allSellingPrice);

        const preparedAllSellingPrice = allSellingPrice?.map((ele) => {
            return { Id: ele?.Id, ChanelName: ele?.ChanelName, MultiplyBy: ele?.MultiplyBy, DivideBy: ele?.DivideBy, Plus: ele?.Plus, BaseMetal: ele?.BaseMetal }
        });

        setRefactorAllSellingPrice(preparedAllSellingPrice);
    }

    return (
        <PeoraContext.Provider
            value={{
                product,
                setProduct,
                productCategoryData,
                setProductCategoryData,
                productSubCategoryData,
                setProductSubCategoryData,
                productMetalTypeData,
                setProductMetalTypeData,
                stoneTypeData,
                setStoneTypeData,
                stoneShapeData,
                setStoneShapeData,
                stoneSizeData,
                setStoneSizeData,
                stoneCutTypeData,
                setStoneCutTypeData,
                stoneQualityData,
                setStoneQualityData,
                allVendorData,
                setAllVendorData,
                allStoneData,
                setAllStoneData,
                purchaseOrderData,
                setPurchaseOrderData,
                allPurchaseOrder,
                setAllPurchaseOrder,
                allInventoryData,
                setAllInventoryData,
                allPricingSchemeData,
                setAllPricingSchemeData,
                allCustomerData,
                setAllCustomerData,
                refactorStoneTypeData,
                setRefactorStoneTypeData,
                refactorStoneShapeData,
                setRefactorStoneShapeData,
                refactorStoneSizeData,
                setRefactorStoneSizeData,
                refactorStoneCutTypeData,
                setRefactorStoneCutTypeData,
                refactorStoneQualityData,
                setRefactorStoneQualityData,
                refactorAllVendorData,
                setRefactorAllVendorData,
                refactorProductCategoryData,
                refactorProductSubCategoryData,
                refactorMetalData,
                refactorLengthData,
                refactorWidthData,
                refactorAllPricingSchemeData,
                setRefactorAllPricingSchemeData,
                refactorAllCustomerData,
                setRefactorAllCustomerData,
                allSalesOrderData,
                setAllSalesOrderData,
                allMenuData,
                setAllMenuData,
                masterDataTabIndex,
                setMasterDataTabIndex,
                getAllBaseMetal,
                refactorAllBaseMetal,
                getAllBaseStone,
                refactorAllBaseStone,
                getAllBoxType,
                allBoxType,
                refactorAllBoxType,
                getAllInsertType,
                allInsertType,
                refactorAllInsertType,
                getAllChainType,
                allChainType,
                refactorAllChainType,
                getAllBackingType,
                allBackingType,
                refactorAllBackingType,
                getAllParentage,
                refactorAllParentage,
                orderId,
                setOrderId,
                refactorAllInventoryData,
                setRefactorAllInventoryData,
                allRecoverableCost,
                refactorAllRecoverableCost,
                masterDataRoute,
                setMasterDataRoute,
                getAllStones,
                getAllStoneTypeData,
                getAllStoneShapeData,
                getAllStoneSizeData,
                getAllStoneCutTypeData,
                getAllStoneQualityData,
                getAllVendorData,
                getLengthData,
                getWidthData,
                getRecoverableCost,
                getAllProductCategoryData,
                getAllProductSubCategoryData,
                getAllProductMetalTypeData,
                getAllSellingPrice,
                allSellingPrice,
                refactorAllSellingPrice,
                getAllInventory
            }}>
            {props.children}
        </PeoraContext.Provider>
    )
}

export default PeoraContextProvider;