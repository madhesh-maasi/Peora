import * as React from 'react';
import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AutoComplete, BlockUI, Button, Calendar, Card, Checkbox, Column, ColumnGroup, DataTable, Dialog, Dropdown, Fieldset, FileUpload, Image, InputNumber, InputSwitch, InputText, InputTextarea, RadioButton, Row, TabPanel, TabView, Toast, classNames } from '../../common/primereactComponents';
import { CopyInitialState, InventoryListInitialState, SellingInitialState } from '../../models/InventoryList';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import { FilterMatchMode } from 'primereact/api';
import './product.css';
import { PeoraContext } from '../../contexts/PeoraContext';
import { addItemToSPList, updateInventoryProductMultipleFields, updateItemToSPList, updateSingleFieldValueToSPList } from '../../services/SPServices';
import { LISTS, PRODUCT_FIELDS_DATA, PRODUCT_SELLING_PRICE_FIELDS_DATA, PRODUCT_STONE_DETAILS_FIELDS_DATA } from '../../common/constants';
import { formatCurrency, formatCurrency3, setOtherLookupData } from '../../common/commonFunction';
import { useReactToPrint } from "react-to-print";
import { PrintData } from '../../common/component/PrintData';
import { CSVLink } from "react-csv";
import Papa from "papaparse";

import { SPFI } from "@pnp/sp";
import { IList } from '@pnp/sp/lists';
import { getSP } from '../../services/pnpConfig';
import { createBatch } from "@pnp/sp/batching";
import { format } from 'date-fns';

const Product = () => {
    const inventoryInitialState = new InventoryListInitialState();
    const sellingInitialState = new SellingInitialState();
    const copyInitialState = new CopyInitialState();

    const genders = [
        { name: 'Male', code: 'Male' },
        { name: 'Female', code: 'Female' }
    ];

    const toast = useRef(null);
    const printRef = useRef(null);
    const navigate = useNavigate();
    const productImageRef = useRef(null);
    const productPriceRef = useRef(null);
    const contentDivRef = useRef(null);
    const csvLink = useRef(null);

    const [state, setState] = useState(inventoryInitialState);
    const [submitted, setSubmitted] = useState(false);
    const [products, setProducts] = useState([]);
    const [blocked, setBlocked] = useState(false);
    let [selectedProduct, setSelectedProduct] = useState([]);
    const [globalFilter, setGlobalFilter] = useState({ 'global': { value: null, matchMode: FilterMatchMode.CONTAINS } });

    let [isStatusActive, setIsStatusActive] = useState(false);

    let [uploadedImages, setUploadedImages] = useState([]);
    let [selectedImage, setSelectedImage] = useState("");

    const [priceHeight, setPriceHeight] = useState(0)
    const [imageHeight, setImageHeight] = useState(null)
    const [gridViewHeight, setGridViewHeight] = useState(null)

    const [selectedStone, setSelectedStone] = useState(null);
    const [selectedStoneQuantity, setSelectedStoneQuantity] = useState(1);

    let [selectedStonesData, setSelectedStonesData] = useState(null);

    //Selling Price useStates
    const [amazonPrice, setAmazonPrice] = useState(sellingInitialState);
    const [peoraPrice, setPeoraPrice] = useState(sellingInitialState);
    const [oravoPrice, setOravoPrice] = useState(sellingInitialState);
    const [roPrice, setRoPrice] = useState(sellingInitialState);
    const [smPrice, setSmPrice] = useState(sellingInitialState);

    //Tab Index
    const [activeIndex, setActiveIndex] = useState(0);

    //Filter Stone Data
    const [filteredStoneData, SetFilteredStoneData] = useState(null);

    //Print Display
    const [isPrintVisible, setIsPrintVisible] = useState(false);
    const [isPrintDialog, setIsPrintDialog] = useState(false);
    const [isPrintValidation, setIsPrintValidation] = useState(false);
    const [filteredSKUData, setFilteredSKUData] = useState(null);
    const [selectedSKUData, setSelectedSKUData] = useState([]);

    // copy functionality
    const [isCopyDialog, setCopyIsDialog] = useState(false);
    const [newSKU, setNewSku] = useState(copyInitialState);

    // Import/Export functionality
    const [csvArray, setCsvArray] = useState([]);
    const [importVisible, setImportVisible] = useState(false);
    const [exportVisible, setExportVisible] = useState(false);
    const [isUploadCSVisible, setIsUploadCSVisible] = useState(false);
    const [allProductFieldChecked, setAllProductFieldChecked] = useState(false);
    let [selectedProductFieldsForImportExport, setSelectedProductFieldsForImportExport] = useState([PRODUCT_FIELDS_DATA[0]]);
    let [finalFieldsForImportExport, setFinalFieldsForImportExport] = useState([PRODUCT_FIELDS_DATA[0]]);

    const {
        allStoneData,
        refactorProductCategoryData,
        refactorAllVendorData,
        refactorProductSubCategoryData,
        refactorMetalData,
        refactorLengthData,
        refactorWidthData,
        refactorAllBaseMetal,
        refactorAllBaseStone,
        refactorAllBoxType,
        refactorAllInsertType,
        refactorAllChainType,
        refactorAllBackingType,
        refactorAllParentage,
        allInventoryData,
        setAllInventoryData,
        refactorAllRecoverableCost,
        masterDataRoute,
        setMasterDataRoute,
        getAllInventory,
        getAllStones,
        getAllVendorData,
        getLengthData,
        getWidthData,
        getAllBaseMetal,
        getAllBaseStone,
        getAllBoxType,
        getAllInsertType,
        getAllChainType,
        getAllBackingType,
        getAllParentage,
        getRecoverableCost,
        getAllProductCategoryData,
        getAllProductSubCategoryData,
        getAllProductMetalTypeData,
        getAllSellingPrice,
        allSellingPrice,
        refactorAllSellingPrice,
        allBackingType,
        allChainType,
        allInsertType,
        allBoxType
    } = useContext(PeoraContext);

    useEffect(() => {
        setPriceHeight(productPriceRef.current.clientHeight + 16);
        setImageHeight(productPriceRef.current.clientHeight + 17 - 95);
        setGridViewHeight(contentDivRef.current.clientHeight);
        if (masterDataRoute === "/master-data") {
            getAllStones();
            getAllVendorData();
            getLengthData();
            getWidthData();
            getAllBaseMetal();
            getAllBaseStone();
            getAllBoxType();
            getAllInsertType();
            getAllChainType();
            getAllBackingType();
            getAllParentage();
            getRecoverableCost();
            getAllProductCategoryData();
            getAllProductSubCategoryData();
            getAllProductMetalTypeData();
            setMasterDataRoute(null);
        }
    }, []);

    useEffect(() => {
        if (allInventoryData && allInventoryData.length > 0) {
            getAllProducts();
        }
    }, [allInventoryData]);

    useEffect(() => {
        if (selectedProduct && selectedProduct.length > 0) {
            if (selectedProduct[0].StoneDetails) {

                const preparedStoneData = [];
                const stoneData = JSON.parse(selectedProduct[0].StoneDetails);

                for (const stone of stoneData) {
                    const findStoneData = allStoneData.filter(x => x.Id === stone.stoneId)[0];

                    stone["WrEaRdTotal"] = parseFloat((findStoneData.WtEaRd * parseInt(stone.StQuantity)).toFixed(2));
                    stone["StoneCost"] = parseFloat((findStoneData.LanEa * parseInt(stone.StQuantity)).toFixed(2));

                    preparedStoneData.push({ ...findStoneData, ...stone })
                }

                setSelectedStonesData(preparedStoneData);

            } else {
                setSelectedStonesData(null);
            }

            if (selectedProduct[0].SellingPrice) {
                const sellingData = JSON.parse(selectedProduct[0].SellingPrice);
                if (sellingData) {
                    setAmazonPrice(sellingData.amazon ? sellingData.amazon : sellingInitialState);
                    setPeoraPrice(sellingData.peora ? sellingData.peora : sellingInitialState);
                    setOravoPrice(sellingData.oravo ? sellingData.oravo : sellingInitialState);
                    setSmPrice(sellingData.sm ? sellingData.sm : sellingInitialState);
                    setRoPrice(sellingData.ro ? sellingData.ro : sellingInitialState);
                }
            } else {
                setAmazonPrice(sellingInitialState);
                setPeoraPrice(sellingInitialState);
                setOravoPrice(sellingInitialState);
                setSmPrice(sellingInitialState);
                setRoPrice(sellingInitialState);
            }

            if (selectedProduct[0].Photos) {
                const uploadedImages = JSON.parse(selectedProduct[0].Photos);
                setUploadedImages(uploadedImages && uploadedImages.length > 0 ? uploadedImages : null);
                setSelectedImage(uploadedImages && uploadedImages.length > 0 ? uploadedImages[0]?.objectURL : null);
            } else {
                setUploadedImages(null);
                setSelectedImage(null);
            }

            selectedProduct[0].Created = selectedProduct[0].Created ? new Date(selectedProduct[0].Created) : null;
            selectedProduct[0].AmzLaunch = selectedProduct[0].AmzLaunch ? new Date(selectedProduct[0].AmzLaunch) : null;
            selectedProduct[0].Modified = selectedProduct[0].Modified ? new Date(selectedProduct[0].Modified) : null;
            selectedProduct[0].OfficeQtyZeroDate = selectedProduct[0].OfficeQtyZeroDate ? new Date(selectedProduct[0].OfficeQtyZeroDate) : null;
            selectedProduct[0].FBAQtyZeroDate = selectedProduct[0].FBAQtyZeroDate ? new Date(selectedProduct[0].FBAQtyZeroDate) : null;
            selectedProduct[0].RetiredDate = selectedProduct[0].RetiredDate ? new Date(selectedProduct[0].RetiredDate) : null;
            selectedProduct[0].WatchListDate = selectedProduct[0].WatchListDate ? new Date(selectedProduct[0].WatchListDate) : null;
            setIsStatusActive(selectedProduct[0]?.Inactive);
            setState({ ...selectedProduct[0], Gender: genders.filter(x => x?.code == selectedProduct[0].Gender)[0] });
        }
        else {
            handleNew();
        }
    }, [selectedProduct]);

    const getAllProducts = async () => {
        let productData = allInventoryData;

        const remainingLookUpData = [
            { name: "BaseMetal", data: refactorAllBaseMetal },
            { name: "BaseStone", data: refactorAllBaseStone },
            { name: "Parentage", data: refactorAllParentage },
            { name: "RecoverableCost", data: refactorAllRecoverableCost },
        ];

        productData = await setOtherLookupData(productData, remainingLookUpData);
        setProducts(productData);
    };

    // All products sort data
    products.sort((a, b) => {
        if (a.Title < b.Title) {
            return -1;
        }
        if (a.Title > b.Title) {
            return 1;
        }
        return 0;
    });

    const showSuccessToast = (message) => {
        toast.current.show({ severity: 'success', summary: "Success Message", detail: message, life: 3000 });
    };

    const showErrorToast = (message) => {
        toast.current.show({ severity: 'error', summary: "Error Message", detail: message, life: 3000 });
    };

    const handleNew = () => {
        setSelectedStonesData([]);
        setIsStatusActive(false);
        setState(inventoryInitialState);
        setSelectedImage(null);
        setUploadedImages(null);
        setSelectedStone(null);
        setSelectedProduct(null);
        setAmazonPrice(sellingInitialState);
        setPeoraPrice(sellingInitialState);
        setOravoPrice(sellingInitialState);
        setSmPrice(sellingInitialState);
        setRoPrice(sellingInitialState);
        setSubmitted(false);
        setActiveIndex(0);
    };

    const handleChangePrice = async (e) => {
        if (e.target.id.indexOf("amazon") != -1) {
            setAmazonPrice({
                ...amazonPrice,
                [e.target.name]: e.target.value
            });
        }

        if (e.target.id.indexOf("peora") != -1) {
            setPeoraPrice({
                ...peoraPrice,
                [e.target.name]: e.target.value
            });
        }

        if (e.target.id.indexOf("oravo") != -1) {
            setOravoPrice({
                ...oravoPrice,
                [e.target.name]: e.target.value
            });
        }

        if (e.target.id.indexOf("sm") != -1) {
            setSmPrice({
                ...smPrice,
                [e.target.name]: e.target.value
            });
        }

        if (e.target.id.indexOf("ro") != -1) {
            setRoPrice({
                ...roPrice,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async () => {
        setSubmitted(false);
        setBlocked(true);
        let isSKUExist = allInventoryData.find((ele) => ele?.Id !== state?.Id && ele?.Title?.trim().toLowerCase() === state.Title?.trim().toLowerCase());
        if (isSKUExist || !state?.Title?.trim().length || !state?.Category || !state?.MetalType) {
            setSubmitted(true);
            setBlocked(false);
            showErrorToast(isSKUExist ? "SKU already exists" : "Please fill all the required(*) fields.");
            return;
        }
        else {

            let sellingPrice = {
                amazon: amazonPrice,
                peora: peoraPrice,
                oravo: oravoPrice,
                sm: smPrice,
                ro: roPrice
            }

            const finalStoneData = [];

            if (selectedStonesData.length > 0) {
                for (const stone of selectedStonesData) {
                    finalStoneData.push({ stoneId: stone.Id, stoneCode: stone.StoneCode, StoneCost: stone.StoneCost, StQuantity: stone.StQuantity, Sequence: stone.Sequence })
                }
            }

            state.StoneDetails = JSON.stringify(finalStoneData);
            state.SellingPrice = JSON.stringify(sellingPrice);
            state.Gender = state.Gender?.code;
            state.Modified = new Date();

            let currentState = { ...state };

            delete currentState.Category;
            delete currentState.BackingType;
            delete currentState.BaseMetal;
            delete currentState.BaseStone;
            delete currentState.BoxType;
            delete currentState.ChainType;
            delete currentState.InsertType;
            delete currentState.MetalType;
            delete currentState.Parentage;
            delete currentState.Subcategory;
            delete currentState.Vendor;
            delete currentState.Vendor2;
            delete currentState.Width;
            delete currentState.Length;
            delete currentState.RecoverableCost;
            delete currentState.TotalStoneCost;
            delete currentState.TotalCost;

            if (!currentState.Id) {
                delete currentState.Id;
                await addItemToSPList(LISTS.INVENTORY.NAME, currentState)
                    .then(async (res) => {
                        state.Id = res.data.Id;
                        allInventoryData.push(state);
                        setProducts(allInventoryData);
                        setAllInventoryData(allInventoryData);
                        setSelectedProduct([state]);
                        showSuccessToast("Product data saved successfully!");
                        setBlocked(false);
                    })
                    .catch((err) => {
                        showErrorToast(err);
                        setBlocked(false);
                    });
            }
            else {
                await updateItemToSPList(LISTS.INVENTORY.NAME, currentState)
                    .then(async (res) => {
                        const updateInventoryData = allInventoryData.map((ele) => {
                            if (ele?.Id === state?.Id) {
                                return state;
                            }
                            else {
                                return ele;
                            }
                        });
                        setAllInventoryData(updateInventoryData);
                        setSelectedProduct([state]);
                        showSuccessToast("Product data saved successfully!");
                        setBlocked(false);
                    }).catch((err) => {
                        showErrorToast(err);
                        setBlocked(false);
                    });
            }
        }
    };

    // sync functionality

    const handleSync = async () => {
        if (!state?.VendorRef1.trim().length) {
            showErrorToast("Please fill in Vendor Ref 1 before syncing the process");
        }
        else {
            setBlocked(true);
            const findVendorRef = allInventoryData.filter((ele => ele.VendorRef1 === state?.VendorRef1));
            for (let ele of findVendorRef) {
                const Id = ele?.Id
                let newMtWtFoB;
                let newMtWtFeed;
                let newFOBMountingCost;
                let newLDMountCost;
                if (ele.MtWtFOB !== state?.MtWtFOB) {
                    newMtWtFoB = state?.MtWtFOB;
                }
                else {
                    newMtWtFoB = ele?.MtWtFOB;
                }
                if (ele.MtWtFeed !== state?.MtWtFeed) {
                    newMtWtFeed = state?.MtWtFeed;
                }
                else {
                    newMtWtFeed = ele?.MtWtFeed;
                }
                if (ele.FOBMountingCost !== state?.FOBMountingCost) {
                    newFOBMountingCost = state?.FOBMountingCost;
                }
                else {
                    newFOBMountingCost = ele?.FOBMountingCost
                }
                if (ele.LDMountCost !== state?.LDMountCost) {
                    newLDMountCost = state?.LDMountCost;
                }
                else {
                    newLDMountCost = ele?.LDMountCost;
                }
                await updateInventoryProductMultipleFields(LISTS.INVENTORY.NAME, Id, newMtWtFoB, newMtWtFeed, newFOBMountingCost, newLDMountCost).then((res) => {
                    const updateInventoryData = allInventoryData.map((item) => {
                        if (item.Id === ele?.Id) {
                            item.MtWtFOB = newMtWtFoB;
                            item.MtWtFeed = newMtWtFeed;
                            item.FOBMountingCost = newFOBMountingCost;
                            item.LDMountCost = newLDMountCost;
                            return item;
                        }
                        else {
                            return item;
                        }
                    });
                    setProducts(updateInventoryData);
                    setAllInventoryData(updateInventoryData);
                }).catch((err) => {
                    console.log("err", err);
                });
            }
            setBlocked(false);
            showSuccessToast("Successfully Synced.");
        }
    };

    const handleCopy = () => {
        setNewSku({
            ...newSKU,
            NewSku: selectedProduct[0].Title,
            NewMFNSKU: selectedProduct[0].MFNSKU,
        });
        setCopyIsDialog(true);
    };

    const getChannelsSuggestedPrice = (chanelName, baseMetal, recoverableCost, totalCost) => {
        let priceData;

        if (baseMetal === "Gold") {
            priceData = allSellingPrice.filter(x => x.ChanelName === chanelName && x.BaseMetal?.Title === baseMetal)[0];
        }
        else {
            priceData = allSellingPrice.filter(x => x.ChanelName === chanelName && x.BaseMetal?.Title != "Gold")[0];
        }

        if (chanelName === "Amazon" || chanelName === "Peora") {
            return Math.ceil(((totalCost * priceData?.MultiplyBy) + recoverableCost) / priceData?.DivideBy);
        }

        if (chanelName === "Oravo" || chanelName === "SM") {
            return Math.ceil((totalCost * priceData?.MultiplyBy));
        }

        if (chanelName === "RO") {
            return Math.ceil((totalCost * priceData?.MultiplyBy)) + priceData?.Plus;
        }
    };

    const getTotalCost = (stoneData) => {

        let totalStoneCost = 0

        if (stoneData && stoneData.length > 0) {
            stoneData.forEach(ele => {
                totalStoneCost += parseFloat(ele.StoneCost);
            });
        }

        const totalCost = totalStoneCost + (state.LDMountCost ? state.LDMountCost : 0) + (state.MiscCost1 ? state.MiscCost1 : 0) + (state.MiscCost2 ? state.MiscCost2 : 0);

        // if (totalCost) {
        setAmazonPrice({
            ...amazonPrice,
            Suggested: getChannelsSuggestedPrice("Amazon", state.BaseMetal?.Title, parseInt(state.RecoverableCost?.Cost ? state.RecoverableCost?.Cost : 0), totalCost)
        });

        setPeoraPrice({
            ...peoraPrice,
            Suggested: getChannelsSuggestedPrice("Peora", state.BaseMetal?.Title, parseInt(state.RecoverableCost?.Cost ? state.RecoverableCost?.Cost : 0), totalCost)
        });

        setOravoPrice({
            ...oravoPrice,
            Suggested: getChannelsSuggestedPrice("Oravo", null, 0, totalCost)
        });

        setSmPrice({
            ...smPrice,
            Suggested: getChannelsSuggestedPrice("SM", null, 0, totalCost)
        });

        setRoPrice({
            ...roPrice,
            Suggested: getChannelsSuggestedPrice("RO", state.BaseMetal?.Title, parseInt(state.RecoverableCost?.Cost ? state.RecoverableCost?.Cost : 0), totalCost)
        });
        // }

        setState({
            ...state,
            TotalStoneCost: totalStoneCost,
            TotalCost: totalCost
        });
    };

    useEffect(() => {
        getTotalCost(selectedStonesData);
    }, [state.LDMountCost, state.MiscCost1, state.MiscCost2, state.RecoverableCost?.Cost])

    //Handle Change
    const handleChange = async (e) => {
        if (e.target.name === "Title") {
            setState({
                ...state,
                [e.target.name]: e.target.value,
                MFNSKU: e.target.value
            });
        }
        else {
            setState({
                ...state,
                [e.target.name]: e.target.value
            });
        }
    };
    const copyHandleChange = async (e) => {
        if (e.target.name === "NewSku") {
            setNewSku({
                ...newSKU,
                [e.target.name]: e.target.value,
                NewMFNSKU: e.target.value
            });
        }
        else {
            setNewSku({
                ...newSKU,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleChangeNumber = (e, name) => {
        setState({
            ...state,
            [name]: e.value
        });
    };

    const handleDropdownChange = (e) => {
        if (e.value) {
            if (e.target.name === "BaseMetal") {
                let insertType = [];
                const boxByBaseMetal = allBoxType.filter(x => x.BaseMetal?.Id === e.value.Id);
                const boxType = refactorAllBoxType.filter(x => x.Id === boxByBaseMetal[0].Id);

                if (state.Category && state.Category.CatName === "Rings") {
                    if (e.value.Title === "Gold") {
                        const insertTypeData = allInsertType.filter(x => x.BaseMetal?.Title === "Gold" && x.Category?.CatName === "Rings");
                        if (insertTypeData.length > 0) {
                            insertType = refactorAllInsertType.filter(x => x.Id === insertTypeData[0].Id);
                        }
                    }
                    else {
                        const insertTypeData = allInsertType.filter(x => x.BaseMetal?.Title != "Gold" && x.Category?.CatName === "Rings");
                        if (insertTypeData.length > 0) {
                            insertType = refactorAllInsertType.filter(x => x.Id === insertTypeData[0].Id);
                        }
                    }
                }

                setState({
                    ...state,
                    [e.target.name]: e.value,
                    [e.target.name + "Id"]: e.value.Id,
                    BoxType: boxType && boxType.length > 0 ? boxType[0] : null,
                    BoxTypeId: boxType && boxType.length > 0 ? boxType[0].Id : undefined,
                    InsertType: insertType && insertType.length > 0 ? insertType[0] : null,
                    InsertTypeId: insertType && insertType.length > 0 ? insertType[0].Id : undefined,
                });
            }
            else if (e.target.name === "Category") {
                let insertType = [];
                let chainType = [];
                let backingType = [];
                let recoverableCost = [];

                if (e.value.CatName === "Rings") {
                    if (state.BaseMetal && state.BaseMetal?.Title === "Gold") {
                        const insertTypeData = allInsertType.filter(x => x.BaseMetal?.Title === "Gold" && x.Category?.CatName === "Rings");
                        if (insertTypeData.length > 0) {
                            insertType = refactorAllInsertType.filter(x => x.Id === insertTypeData[0].Id);
                        }
                    }
                    else {
                        const insertTypeData = allInsertType.filter(x => x.BaseMetal?.Title != "Gold" && x.Category?.CatName === "Rings");
                        if (insertTypeData.length > 0) {
                            insertType = refactorAllInsertType.filter(x => x.Id === insertTypeData[0].Id);
                        }
                    }
                }

                if (e.value.CatName === "Pendants" && state.MetalType && state.MetalType?.MetalTypeName) {
                    const chainTypeData = allChainType.filter(x => x.Metal.filter(y => y.MetalTypeName === state.MetalType?.MetalTypeName).length > 0 && x.Category?.CatName === "Pendants");
                    chainType = refactorAllChainType.filter(x => x.Id === chainTypeData[0]?.Id);
                }

                if (e.value.CatName === "Earrings" && state.MetalType && state.MetalType?.MetalTypeName) {
                    const backingTypeData = allBackingType.filter(x => x.Metal.MetalTypeName === state.MetalType?.MetalTypeName && x.Category?.CatName === "Earrings");
                    backingType = refactorAllBackingType.filter(x => x.Id === backingTypeData[0]?.Id);
                }

                if (e.value.CatName === "Pendants") {
                    recoverableCost = refactorAllRecoverableCost.filter(x => x.Category?.CatName === "Pendants")
                }
                else {
                    recoverableCost = refactorAllRecoverableCost.filter(x => x.Category?.CatName != "Pendants")
                }

                setState({
                    ...state,
                    [e.target.name]: e.value,
                    [e.target.name + "Id"]: e.value.Id,
                    InsertType: insertType && insertType.length > 0 ? insertType[0] : null,
                    InsertTypeId: insertType && insertType.length > 0 ? insertType[0].Id : undefined,
                    ChainType: chainType && chainType.length > 0 ? chainType[0] : null,
                    ChainTypeId: chainType && chainType.length > 0 ? chainType[0].Id : undefined,
                    BackingType: backingType && backingType.length > 0 ? backingType[0] : null,
                    BackingTypeId: backingType && backingType.length > 0 ? backingType[0].Id : undefined,
                    RecoverableCost: recoverableCost && recoverableCost.length > 0 ? recoverableCost[0] : null,
                    RecoverableCostId: recoverableCost && recoverableCost.length > 0 ? recoverableCost[0].Id : undefined,
                });
            }
            else if (e.target.name === "MetalType") {
                let chainType = [];
                let backingType = [];

                if (state.Category && state.Category.CatName === "Pendants" && e.target.value.MetalTypeName) {
                    const chainTypeData = allChainType.filter(x => x.Metal.filter(y => y.MetalTypeName === e.target.value.MetalTypeName).length > 0 && x.Category?.CatName === "Pendants");
                    chainType = refactorAllChainType.filter(x => x.Id === chainTypeData[0]?.Id);
                }

                if (state.Category && state.Category.CatName === "Earrings" && e.target.value.MetalTypeName) {
                    const backingTypeData = allBackingType.filter(x => x.Metal.MetalTypeName === e.target.value.MetalTypeName && x.Category?.CatName === "Earrings");
                    backingType = refactorAllBackingType.filter(x => x.Id === backingTypeData[0]?.Id);
                }

                setState({
                    ...state,
                    [e.target.name]: e.value,
                    [e.target.name + "Id"]: e.value.Id,
                    ChainType: chainType && chainType.length > 0 ? chainType[0] : null,
                    ChainTypeId: chainType && chainType.length > 0 ? chainType[0].Id : undefined,
                    BackingType: backingType && backingType.length > 0 ? backingType[0] : null,
                    BackingTypeId: backingType && backingType.length > 0 ? backingType[0].Id : undefined,
                });
            }
            else {
                setState({
                    ...state,
                    [e.target.name]: e.value,
                    [e.target.name + "Id"]: e.value.Id
                });
            }
        }
        else {
            if (e.target.name === "BaseMetal") {
                setState({
                    ...state,
                    [e.target.name]: null,
                    [e.target.name + "Id"]: undefined,
                    BoxType: null,
                    BoxTypeId: undefined,
                    InsertType: null,
                    InsertTypeId: undefined,
                });
            }
            else if (e.target.name === "Category") {
                setState({
                    ...state,
                    [e.target.name]: null,
                    [e.target.name + "Id"]: undefined,
                    InsertType: null,
                    InsertTypeId: undefined,
                    ChainType: null,
                    ChainTypeId: undefined,
                    BackingType: null,
                    BackingTypeId: undefined,
                    RecoverableCost: null,
                    RecoverableCostId: undefined,
                });
            }
            else if (e.target.name === "MetalType") {
                setState({
                    ...state,
                    [e.target.name]: null,
                    [e.target.name + "Id"]: undefined,
                    ChainType: null,
                    ChainTypeId: undefined,
                    BackingType: null,
                    BackingTypeId: null,
                });
            }
            else {
                setState({
                    ...state,
                    [e.target.name]: null,
                    [e.target.name + "Id"]: undefined
                });
            }
        }

        if (e.target.name === "BaseMetal" && e.value && state.TotalCost) {

            setAmazonPrice({
                ...amazonPrice,
                Suggested: getChannelsSuggestedPrice("Amazon", e.target?.value?.Title, parseInt(state.RecoverableCost?.Cost), state.TotalCost)
            });

            setPeoraPrice({
                ...peoraPrice,
                Suggested: getChannelsSuggestedPrice("Peora", e.target?.value?.Title, parseInt(state.RecoverableCost?.Cost), state.TotalCost)
            });

            setOravoPrice({
                ...oravoPrice,
                Suggested: getChannelsSuggestedPrice("Oravo", null, null, state.TotalCost)
            });

            setSmPrice({
                ...smPrice,
                Suggested: getChannelsSuggestedPrice("SM", null, null, state.TotalCost)
            });

            setRoPrice({
                ...roPrice,
                Suggested: getChannelsSuggestedPrice("RO", e.target?.value?.Title, parseInt(state.RecoverableCost?.Cost), state.TotalCost)
            });
        }

    };

    const onStatusChange = (e) => {
        setBlocked(true);
        isStatusActive = e.checked;
        setIsStatusActive(e.checked);
        if (state?.Id) {
            updateSingleFieldValueToSPList(LISTS.INVENTORY.NAME, state?.Id, "Inactive", isStatusActive).then((res) => {
                setBlocked(false);
                setState({
                    ...state,
                    Inactive: isStatusActive
                });
                const updateInventoryData = allInventoryData.map(({ Inactive, ...inventoryEle }) => ({
                    ...inventoryEle,
                    Inactive: inventoryEle?.Id === state?.Id ? isStatusActive : Inactive
                }));
                setAllInventoryData(updateInventoryData);
                if (isStatusActive) {
                    showSuccessToast("Product has been inactivated successfully!");
                }
                else {
                    showSuccessToast("Product has been activated successfully!");
                }
            }).catch((err) => {
                showErrorToast(err);
                setBlocked(false);
            });
        }
        else {
            setBlocked(false);
            setState({
                ...state,
                Inactive: isStatusActive
            });
        }
    };

    const pageStyle = `@media print {
        .page-break {
            page-break-after: always;
        }
        @page {
          size: 54mm 70mm;
          margin: 0;
        }
      }`;

    const reactToPrintContent = React.useCallback(() => {
        return printRef.current;
    }, [printRef.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "SKU Labels",
        pageStyle: pageStyle,
    });

    const handlePrintData = () => {
        setIsPrintValidation(false);
        if (selectedSKUData && selectedSKUData.length > 0) {
            setIsPrintVisible(true);
            setTimeout(() => {
                handlePrint();
                setIsPrintDialog(false);
                setFilteredSKUData(null);
                setSelectedSKUData([]);
            }, 100);
            setTimeout(() => {
                setIsPrintVisible(false);
            }, 200);
        }
        else {
            setIsPrintValidation(true);
        }
    };

    const onClickPrint = () => {
        setIsPrintDialog(true);
        setIsPrintValidation(false);
        setFilteredSKUData(null);
        setSelectedSKUData([]);
    };

    const printFooterComponent = (
        <>
            <Button label="Cancel" icon="pi pi-times-circle" className="p-button-text" onClick={() => setIsPrintDialog(false)} />
            <Button label="Print" icon="pi pi-print" onClick={() => { handlePrintData() }} autoFocus />
        </>
    );

    const searchSKUData = (event) => {
        // Timeout to emulate a network connection
        const inputItems = event.query.split(' ');
        setTimeout(() => {
            let _filteredSKUData;

            if (!event.query.trim().length) {
                _filteredSKUData = [...products];
            }
            else {
                inputItems.forEach(element => {
                    let allFilteredData = _filteredSKUData && _filteredSKUData.length > 0 ? _filteredSKUData : products;

                    _filteredSKUData = allFilteredData?.filter((ele) => {
                        return (
                            (ele?.Title && ele?.Title?.toLowerCase().includes(element?.toLowerCase())) ||
                            (ele?.VendorRef1 && ele?.VendorRef1?.toLowerCase().includes(element?.toLowerCase()))
                        )
                    });
                });
            }
            setFilteredSKUData(_filteredSKUData);
        }, 250);
    };

    //SKU Data Template
    const skuTemplate = (option) => {
        return (
            <div className="col-12 flex align-items-center auto-complete-items">
                <div className="col-6">
                    {option?.Title}
                </div>
                <div className="col-6">
                    {option?.VendorRef1}
                </div>
            </div>
        );
    };

    const skuFooterTemplate = () => {
        return (
            <div className="col-12 flex align-items-center auto-complete-items-footer">
                <div className="col-6">
                    SKU No.
                </div>
                <div className="col-6">
                    Vendor Ref 1
                </div>
            </div>
        );
    };

    const handlePrintSKUChange = (e) => {
        if (e.value) {
            setSelectedSKUData(e.value);
        }
        else {
            setSelectedSKUData([]);
        }
    };

    const productHeader = (
        <div className='flex justify-content-between align-items-center'>
            <h2 className='mx-2'>SKU: {selectedProduct && selectedProduct[0]?.Title}</h2>
            <div className='flex justify-content-end align-items-center'>
                {state.Id && <div className='flex align-items-center mr-2'>
                    <Checkbox onChange={(e) => onStatusChange(e)} checked={isStatusActive}></Checkbox>
                    <label htmlFor="Inactive" className="ml-2">Inactive</label>
                </div>}
                <div className='mr-2'>
                    <Button label={"New"} icon="pi pi-plus" tooltip={"New"} onClick={handleNew} data-pr-position="bottom" />
                </div>
                <div className='mr-2'>
                    <Button label={"Save"} icon="pi pi-save" tooltip={"Save"} onClick={() => { handleSubmit() }} data-pr-position="bottom" disabled={isStatusActive} />
                </div>
                {state.Id &&
                    <div className='mr-2'>
                        <Button label={"Copy"} icon="pi pi-copy" tooltip={"Copy"} onClick={handleCopy} data-pr-position="bottom" />
                    </div>
                }
                {state.Id &&
                    <div className='mr-2'>
                        <Button label={"Sync"} icon="pi pi-sync" tooltip={"Sync"} onClick={handleSync} data-pr-position="bottom" />
                    </div>
                }

                <div className='mr-2'>
                    <Button label={"Import"} icon="pi pi-database" tooltip={"Import"} onClick={() => { setIsUploadCSVisible(true) }} data-pr-position="bottom" />
                </div>

                <div className='mr-2'>
                    <Button label={"Export"} icon="pi pi-database" tooltip={"Export"} onClick={() => { onClickExportCSVFile() }} data-pr-position="bottom" />
                </div>

                <div className='mr-2'>
                    <Button label={"Print"} icon="pi pi-print" tooltip={"Print"} onClick={onClickPrint} data-pr-position="bottom" />
                </div>

                <div className='mr-2'>
                    <Button label={"Go Back"} tooltip={"Go Back"} onClick={() => navigate('/')} icon="pi pi-home" data-pr-position="bottom" />
                </div>
            </div>
        </div>
    );

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...globalFilter };

        _filters['global'].value = value;

        setGlobalFilter(_filters);
    };

    const header = () => {
        let value = globalFilter['global'] ? globalFilter['global'].value : '';
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={value} onChange={onGlobalFilterChange} type='search' />
                </span>
            </div>
        );
    };

    const onFileUpload = async (imageFiles) => {
        let photos = uploadedImages && uploadedImages.length > 0 ? uploadedImages : [];

        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const reader = new FileReader();
            let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

            reader.readAsDataURL(blob);

            reader.onloadend = function () {
                photos.push({ fileName: imageFiles[i].name, objectURL: reader.result })
            }
        }

        setTimeout(() => {
            if (photos.length > 0) {
                setUploadedImages(photos);
                setSelectedImage(photos[0]?.objectURL);
                setState({
                    ...state,
                    Photos: JSON.stringify(photos)
                });
            }
        }, 500);
    };

    const onFileRemove = (e, type) => {
        setState({
            ...state,
            [type]: e
        });
    };

    const chooseOptions = { icon: 'pi pi-fw pi-plus', iconOnly: true };

    const handleStoneChange = (e) => {
        if (e.value) {
            setSelectedStone(e.value);
        }
        else {
            setSelectedStone(null);
        }
    };

    const pctBodyTemplate = (rowData) => {
        return formatCurrency(rowData.Pct);
    };

    const fobBodyTemplate = (rowData) => {
        return formatCurrency(rowData.FOBEa);
    };

    const lanBodyTemplate = (rowData) => {
        return formatCurrency(rowData.LanEa);
    };

    const stoneCostBodyTemplate = (rowData) => {
        return formatCurrency(rowData.StoneCost);
    };

    const addStone = async () => {

        const _stone = { ...selectedStone };
        if (_stone.StoneCode) {
            _stone["StQuantity"] = selectedStoneQuantity;
            _stone["WrEaRdTotal"] = parseFloat((_stone.WtEaRd * selectedStoneQuantity).toFixed(3));
            _stone["StoneCost"] = parseFloat((_stone.LanEa * selectedStoneQuantity).toFixed(2));

            _stone["Sequence"] = selectedStonesData && selectedStonesData.length > 0 ? (selectedStonesData[selectedStonesData.length - 1].Sequence + 1) : 1;

            if (selectedStonesData && selectedStonesData.length > 0) {
                selectedStonesData.push(_stone);
                const stoneData = selectedStonesData;
                setSelectedStonesData(stoneData);
                await getTotalCost(selectedStonesData);
            }
            else {
                setSelectedStonesData([_stone]);
                await getTotalCost([_stone]);
            }

            setSelectedStone(null);
            setSelectedStoneQuantity(1);
        }
        else {
            showErrorToast("Please select stone.");
        }
    };

    const gridTotalValue = (column) => {
        let total = 0;

        for (let stone of selectedStonesData) {
            total += parseFloat(stone[column]);
        }

        return total;
    };

    const footerGroup = (
        selectedStonesData && selectedStonesData.length > 0 && <ColumnGroup>
            <Row>
                <Column className="text-right pr-2" footer="Total Ct Wt:" colSpan={5} />
                <Column className="text-right pr-2" footer={formatCurrency3(gridTotalValue("WrEaRdTotal"))} />
                <Column className="text-right pr-2" footer="Total Stone Cost:" colSpan={3} />
                <Column className="text-right pr-2" footer={formatCurrency(gridTotalValue("StoneCost"))} />
            </Row>
        </ColumnGroup>
    );

    const currentProductOptionTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-trash" text tooltip="Delete" onClick={() => removeStone(rowData)} disabled={isStatusActive} />
            </React.Fragment>
        );
    };

    const removeStone = (rowData) => {
        let selectedData = selectedStonesData.filter(x => x.Sequence !== rowData.Sequence);
        setSelectedStonesData(selectedData);
        getTotalCost(selectedData);
    };

    const removeImage = (item, index) => {

        uploadedImages.splice(index, 1);
        let selectedImageData = uploadedImages && uploadedImages.length > 0 ? uploadedImages[0]?.objectURL : null;

        if (uploadedImages.length == 0) {
            setTimeout(() => {
                selectedImage = selectedImageData;
                setUploadedImages(null);
                setSelectedImage(selectedImageData);
                setState({
                    ...state,
                    Photos: null
                });
            }, 100);
        }
        else {
            setTimeout(() => {
                selectedImage = selectedImageData;
                setUploadedImages(uploadedImages);
                setSelectedImage(selectedImageData);
                setState({
                    ...state,
                    Photos: JSON.stringify(uploadedImages)
                });
            }, 100);
        }
    };

    //Input Editor
    const inputNumber = (options) => {
        return (
            <>
                <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} className={`w-full ${classNames({ 'p-invalid': !options.value || (options.value && (options.value > options?.rowData?.StQuantity)) })}`} min={0} disabled={isStatusActive} />
                {!options.value && <small className="p-error">Qty is required.</small>}
            </>
        );
    };

    // Validate sales order item
    const onCellEditValidator = (e) => {
        let { newRowData, newValue, field } = e;
        switch (field) {
            case "StQuantity":
                if (!newValue) {
                    return false;
                }
                else {
                    return true;
                }
        }
    };

    // Edit sales order item
    const onRowEditComplete = async (e) => {

        let { rowIndex, newRowData, value } = e;

        let stoneItems = [...selectedStonesData];

        stoneItems[rowIndex].StQuantity = parseInt(value);
        stoneItems[rowIndex].WrEaRdTotal = parseFloat((newRowData.WtEaRd * value).toFixed(3));
        stoneItems[rowIndex].StoneCost = parseFloat((newRowData.LanEa * value).toFixed(2));

        setSelectedStonesData(stoneItems);
        await getTotalCost(stoneItems);
    };

    //Stone Data Template
    const stoneTemplate = (option) => {
        return (
            <div className="col-12 flex align-items-center auto-complete-items">
                <div className="col-3">
                    {option?.StoneCode}
                </div>
                <div className="col-2">
                    {option?.StoneTypeId?.StoneTypeName}
                </div>
                <div className="col-1">
                    {option?.StoneQualityId?.StoneQualityName}
                </div>
                <div className="col-2">
                    {option?.StoneCutTypeId?.StoneCutTypeName}
                </div>
                <div className="col-2">
                    {option?.StoneShapeId?.StoneShapeName}
                </div>
                <div className="col-2">
                    {option?.StoneSizeId?.StoneSizeName}
                </div>
            </div>
        );
    };

    const stoneFooterTemplate = () => {
        return (
            <div className="col-12 flex align-items-center auto-complete-items-footer">
                <div className="col-3">
                    Code
                </div>
                <div className="col-2">
                    Type
                </div>
                <div className="col-1">
                    Quality
                </div>
                <div className="col-2">
                    Cut
                </div>
                <div className="col-2">
                    Shape
                </div>
                <div className="col-2">
                    Size
                </div>
            </div>
        );
    };

    const searchStoneData = (event) => {
        // Timeout to emulate a network connection
        const inputItems = event.query.split(' ');
        setTimeout(() => {
            let _filteredStoneData;

            if (!event.query.trim().length) {
                _filteredStoneData = [...allStoneData];
            }
            else {
                inputItems.forEach(element => {
                    let allFilteredData = _filteredStoneData && _filteredStoneData.length > 0 ? _filteredStoneData : allStoneData;

                    _filteredStoneData = allFilteredData?.filter((ele) => {
                        return (
                            (ele?.StoneCode && ele?.StoneCode?.toLowerCase().includes(element?.toLowerCase())) ||
                            (ele?.StoneCutTypeId?.StoneCutTypeName && ele?.StoneCutTypeId?.StoneCutTypeName?.toLowerCase().includes(element?.toLowerCase())) ||
                            (ele?.StoneQualityId?.StoneQualityName && ele?.StoneQualityId?.StoneQualityName?.toLowerCase().includes(element?.toLowerCase())) ||
                            (ele?.StoneShapeId?.StoneShapeName && ele?.StoneShapeId?.StoneShapeName?.toLowerCase().includes(element?.toLowerCase())) ||
                            (ele?.StoneSizeId?.StoneSizeName && ele?.StoneSizeId?.StoneSizeName?.toLowerCase().includes(element?.toLowerCase())) ||
                            (ele?.StoneTypeId?.StoneTypeName && ele?.StoneTypeId?.StoneTypeName?.toLowerCase().includes(element?.toLowerCase()))
                        )
                    });
                });
            }
            SetFilteredStoneData(_filteredStoneData);
        }, 250);
    };

    const selectedProductData = (value) => {
        handleNew();
        setTimeout(() => {
            setSelectedProduct(value ? [value] : null);
        }, 100);
    };

    const onHideCopyDialog = () => {
        setCopyIsDialog(false);
        setNewSku(copyInitialState);
    };

    const copyFooterComponent = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={onHideCopyDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={() => { addCopyItem() }} autoFocus />
            {/* <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={() => { addCopyItem() }} autoFocus /> */}
        </>
    );
    const addCopyItem = async () => {
        delete state?.Id;
        setSubmitted(false);
        setBlocked(true);
        let isSKUExist = allInventoryData.find((ele) => ele?.Id !== state?.Id && ele?.Title?.trim().toLowerCase() === newSKU.NewSku?.trim().toLowerCase());
        if (isSKUExist || !newSKU.NewSku?.trim().length || !newSKU.NewMFNSKU.trim().length) {
            setSubmitted(true);
            setBlocked(false);
            setCopyIsDialog(true);
            showErrorToast(isSKUExist ? "SKU already exists" : "Please fill all the required(*) fields.");
            return;
        }
        else {

            let sellingPrice = {
                amazon: amazonPrice,
                peora: peoraPrice,
                oravo: oravoPrice,
                sm: smPrice,
                ro: roPrice
            }

            const finalStoneData = [];

            if (selectedStonesData.length > 0) {
                for (const stone of selectedStonesData) {
                    finalStoneData.push({ stoneId: stone.Id, stoneCode: stone.StoneCode, StoneCost: stone.StoneCost, StQuantity: stone.StQuantity, Sequence: stone.Sequence })
                }
            }
            state.StoneDetails = JSON.stringify(finalStoneData);
            state.SellingPrice = JSON.stringify(sellingPrice);
            state.Gender = state.Gender?.code;
            state.Modified = new Date();

            let currentState = { ...state };
            currentState.Title = newSKU?.NewSku
            currentState.MFNSKU = newSKU?.NewMFNSKU

            delete currentState.Category;
            delete currentState.BackingType;
            delete currentState.BaseMetal;
            delete currentState.BaseStone;
            delete currentState.BoxType;
            delete currentState.ChainType;
            delete currentState.InsertType;
            delete currentState.MetalType;
            delete currentState.Parentage;
            delete currentState.Subcategory;
            delete currentState.Vendor;
            delete currentState.Vendor2;
            delete currentState.Width;
            delete currentState.Length;
            delete currentState.RecoverableCost;
            delete currentState.TotalStoneCost;
            delete currentState.TotalCost;
            delete currentState?.Id;
            delete currentState["ID"];

            await addItemToSPList(LISTS.INVENTORY.NAME, currentState)
                .then(async (res) => {
                    state.Id = res.data.Id
                    allInventoryData.push({ ...state, Title: newSKU?.NewSku, MFNSKU: newSKU?.NewSku });
                    setProducts(allInventoryData);
                    setAllInventoryData(allInventoryData);
                    setSelectedProduct([{ ...state, Title: newSKU?.NewSku, MFNSKU: newSKU?.NewSku }]);
                    showSuccessToast("Product data copy successfully!");
                    setBlocked(false);
                    setNewSku(copyInitialState);
                    setCopyIsDialog(false);
                })
                .catch((err) => {
                    showErrorToast(err);
                    setBlocked(false);
                });
        }
    };

    // Import/Export functionality

    const importFooterContent = (
        <div>
            <Button label="Cancel" icon="pi pi-times-circle" onClick={() => setImportVisible(false)} className="p-button-text" />
            <Button label="Download CSV" icon="pi pi-file-excel" onClick={() => downloadCSV()} autoFocus />
            <CSVLink data={[finalFieldsForImportExport]} target="_blank" className='hidden' filename='Products.csv' ref={csvLink} />
        </div>
    );

    const exportFooterContent = (
        <div>
            <Button label="Cancel" icon="pi pi-times-circle" onClick={() => setExportVisible(false)} className="p-button-text" />
            <Button label="Export Data" icon="pi pi-file-excel" onClick={() => downloadCSVWithExportedProductsData()} autoFocus />
        </div>
    );

    const downloadCSV = () => {
        csvLink.current.link.click();
        setSelectedProductFieldsForImportExport([PRODUCT_FIELDS_DATA[0]]);
        setFinalFieldsForImportExport([PRODUCT_FIELDS_DATA[0]]);
        setImportVisible(false);
    }

    const exportProductsData = (data, fileName, type) => {
        // Create a link and download the file
        const blob = new Blob([data], { type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const downloadCSVWithExportedProductsData = async () => {
        const csvData = Papa.unparse(await preparedProductsDataForExport());
        await exportProductsData(csvData, 'ExportedProductsData_' + Date.now() + '.csv', 'text/csv;charset=utf-8;');
        setExportVisible(false);
        setSelectedProductFieldsForImportExport([PRODUCT_FIELDS_DATA[0]]);
        setFinalFieldsForImportExport([PRODUCT_FIELDS_DATA[0]]);
        showSuccessToast("Product data exported successfully.");
    };

    const getTotalCostForImportExportProducts = (stoneData, productItem) => {
        let totalStoneCost = 0

        if (stoneData && stoneData.length > 0) {
            stoneData.forEach(ele => {
                totalStoneCost += parseFloat(ele.StoneCost);
            });
        }

        const totalCost = totalStoneCost + (productItem.LDMountCost ? parseFloat(parseFloat(productItem.LDMountCost).toFixed(2)) : 0) + (productItem.MiscCost1 ? parseFloat(parseFloat(productItem.MiscCost1).toFixed(2)) : 0) + (productItem.MiscCost2 ? parseFloat(parseFloat(productItem.MiscCost2).toFixed(2)) : 0);

        return ({
            TotalStoneCost: totalStoneCost,
            TotalCost: totalCost
        });
    };

    const preparedProductsDataForExport = async () => {
        const preparedProductsDataArray = [];
        for (const productItem of products) {
            const productDataObject = {};
            for (const productField of selectedProductFieldsForImportExport) {

                if (productField === "SKU") {
                    productDataObject[productField] = productItem?.Title;
                }

                else if (productField === "Category") {
                    productDataObject[productField] = productItem[productField]?.CatName;
                }

                else if (productField === "Vendor1") {
                    productDataObject[productField] = productItem["Vendor"]?.VendorName;
                }

                else if (productField === "MetalType") {
                    productDataObject[productField] = productItem[productField]?.MetalTypeName;
                }

                else if (productField === "Length") {
                    productDataObject[productField] = productItem[productField]?.Title;
                }

                else if (productField === "Width") {
                    productDataObject[productField] = productItem[productField]?.Title;
                }

                else if (productField === "BaseMetal") {
                    productDataObject[productField] = productItem[productField]?.Title;
                }

                else if (productField === "BaseStone") {
                    productDataObject[productField] = productItem[productField]?.Title;
                }

                else if (productField === "BoxType") {
                    productDataObject[productField] = productItem[productField]?.Title;
                }

                else if (productField === "InsertType") {
                    productDataObject[productField] = productItem[productField]?.Title;
                }

                else if (productField === "ChainType") {
                    productDataObject[productField] = productItem[productField]?.Title;
                }

                else if (productField === "BackingType") {
                    productDataObject[productField] = productItem[productField]?.Title;
                }

                else if (productField === "Subcategory") {
                    productDataObject[productField] = productItem[productField]?.SubCatName;
                }

                else if (productField === "Vendor2") {
                    productDataObject[productField] = productItem[productField]?.VendorName;
                }

                else if (productField === "Parentage") {
                    productDataObject[productField] = productItem[productField]?.Title;
                }

                else if (productField === "RecoverableCost") {
                    productDataObject[productField] = productItem[productField]?.Cost ? parseInt(productItem[productField]?.Cost) : null;
                }

                else if (productField === "AmzLaunch" || productField === "OfficeQtyZeroDate" || productField === "FBAQtyZeroDate" || productField === "RetiredDate" || productField === "WatchListDate") {
                    productDataObject[productField] = productItem[productField] ? format(new Date(productItem[productField]), 'MM/dd/yyyy') : null;
                }
                else if (productField === "ModifiedDate") {
                    productDataObject[productField] = productItem?.Modified ? format(new Date(productItem?.Modified), 'MM/dd/yyyy') : null;
                }

                else if (productField === "StoneDetails") {
                    const stoneDetails = productItem[productField] ? JSON.parse(productItem[productField]) : [];
                    if (stoneDetails.length > 0) {
                        for (let i = 0; i < 7; i++) {
                            if (stoneDetails[i]?.stoneCode && stoneDetails[i]?.StQuantity) {
                                productDataObject["StoneCode" + (i + 1)] = stoneDetails[i]?.stoneCode;
                                productDataObject["StoneQty" + (i + 1)] = parseInt(stoneDetails[i]?.StQuantity);
                                productDataObject["StoneCost" + (i + 1)] = stoneDetails[i]?.StoneCost;
                            }
                            else {
                                productDataObject["StoneCode" + (i + 1)] = null;
                                productDataObject["StoneQty" + (i + 1)] = null;
                                productDataObject["StoneCost" + (i + 1)] = null;
                            }
                        }
                    }
                    else {
                        for (let i = 0; i < 7; i++) {
                            productDataObject["StoneCode" + (i + 1)] = null;
                            productDataObject["StoneQty" + (i + 1)] = null;
                            productDataObject["StoneCost" + (i + 1)] = null;
                        }
                    }
                    const totalCostValues = await getTotalCostForImportExportProducts(stoneDetails, productItem);
                    productDataObject["TotalStoneCost"] = totalCostValues?.TotalStoneCost;
                    productDataObject["TotalCost"] = totalCostValues?.TotalCost;
                }

                else if (productField === "SellingPrice") {
                    const sellingPriceDetails = JSON.parse(productItem[productField]);
                    productDataObject["AmazonSuggested"] = sellingPriceDetails?.amazon?.Suggested ? sellingPriceDetails?.amazon?.Suggested : null;
                    productDataObject["AmazonActual"] = sellingPriceDetails?.amazon?.Actual ? sellingPriceDetails?.amazon?.Actual : null;
                    productDataObject["PeoraSuggested"] = sellingPriceDetails?.peora?.Suggested ? sellingPriceDetails?.peora?.Suggested : null;
                    productDataObject["PeoraActual"] = sellingPriceDetails?.peora?.Actual ? sellingPriceDetails?.peora?.Actual : null;
                    productDataObject["OravoSuggested"] = sellingPriceDetails?.oravo?.Suggested ? sellingPriceDetails?.oravo?.Suggested : null;
                    productDataObject["OravoActual"] = sellingPriceDetails?.oravo?.Actual ? sellingPriceDetails?.oravo?.Actual : null;
                    productDataObject["SMSuggested"] = sellingPriceDetails?.sm?.Suggested ? sellingPriceDetails?.sm?.Suggested : null;
                    productDataObject["SMActual"] = sellingPriceDetails?.sm?.Actual ? sellingPriceDetails?.sm?.Actual : null;
                    productDataObject["ROSuggested"] = sellingPriceDetails?.ro?.Suggested ? sellingPriceDetails?.ro?.Suggested : null;
                    productDataObject["ROActual"] = sellingPriceDetails?.ro?.Actual ? sellingPriceDetails?.ro?.Actual : null;
                }

                else {
                    if (productField !== "StoneCode1" &&
                        productField !== "StoneQty1" &&
                        productField !== "StoneCost1" &&
                        productField !== "StoneCode2" &&
                        productField !== "StoneQty2" &&
                        productField !== "StoneCost2" &&
                        productField !== "StoneCode3" &&
                        productField !== "StoneQty3" &&
                        productField !== "StoneCost3" &&
                        productField !== "StoneCode4" &&
                        productField !== "StoneQty4" &&
                        productField !== "StoneCost4" &&
                        productField !== "StoneCode5" &&
                        productField !== "StoneQty5" &&
                        productField !== "StoneCost5" &&
                        productField !== "StoneCode6" &&
                        productField !== "StoneQty6" &&
                        productField !== "StoneCost6" &&
                        productField !== "StoneCode7" &&
                        productField !== "StoneQty7" &&
                        productField !== "StoneCost7" &&
                        productField !== "TotalStoneCost" &&
                        productField !== "TotalCost" &&
                        productField !== "AmazonSuggested" &&
                        productField !== "AmazonActual" &&
                        productField !== "PeoraSuggested" &&
                        productField !== "PeoraActual" &&
                        productField !== "OravoSuggested" &&
                        productField !== "OravoActual" &&
                        productField !== "SMSuggested" &&
                        productField !== "SMActual" &&
                        productField !== "ROSuggested" &&
                        productField !== "ROActual") {
                        productDataObject[productField] = productItem[productField];
                    }
                }
            }
            preparedProductsDataArray.push(productDataObject);
        }

        return preparedProductsDataArray;
    };

    const onAllProductFieldChange = (e, isExport = false) => {
        if (e.checked) {
            let _selectedProductFieldsForImportExport = [...PRODUCT_FIELDS_DATA];

            if (isExport) {
                for (let stoneField of PRODUCT_STONE_DETAILS_FIELDS_DATA) {
                    _selectedProductFieldsForImportExport.push(stoneField);
                }

                for (let sellingPriceField of PRODUCT_SELLING_PRICE_FIELDS_DATA) {
                    _selectedProductFieldsForImportExport.push(sellingPriceField);
                }
            }
            else {
                for (let stoneField of PRODUCT_STONE_DETAILS_FIELDS_DATA) {
                    if (stoneField !== "StoneCost1" &&
                        stoneField !== "StoneCost2" &&
                        stoneField !== "StoneCost3" &&
                        stoneField !== "StoneCost4" &&
                        stoneField !== "StoneCost5" &&
                        stoneField !== "StoneCost6" &&
                        stoneField !== "StoneCost7"
                    ) {
                        _selectedProductFieldsForImportExport.push(stoneField);
                    }
                }

                for (let sellingPriceField of PRODUCT_SELLING_PRICE_FIELDS_DATA) {
                    if (sellingPriceField !== "AmazonSuggested" &&
                        sellingPriceField !== "PeoraSuggested" &&
                        sellingPriceField !== "OravoSuggested" &&
                        sellingPriceField !== "SMSuggested" &&
                        sellingPriceField !== "ROSuggested") {
                        _selectedProductFieldsForImportExport.push(sellingPriceField);
                    }
                }
            }

            let removeStoneDetailsFields = [..._selectedProductFieldsForImportExport];
            if (isExport) {
                removeStoneDetailsFields = removeStoneDetailsFields.filter(item => item !== "StoneDetails" && item !== "SellingPrice");
            }
            else {
                removeStoneDetailsFields = removeStoneDetailsFields.filter(item => item !== "StoneDetails" && item !== "SellingPrice" && item !== "ModifiedDate");
            }

            setSelectedProductFieldsForImportExport(_selectedProductFieldsForImportExport);
            setFinalFieldsForImportExport(removeStoneDetailsFields);
            setAllProductFieldChecked(true);
        }
        else {
            setSelectedProductFieldsForImportExport([PRODUCT_FIELDS_DATA[0]]);
            setFinalFieldsForImportExport([PRODUCT_FIELDS_DATA[0]]);
            setAllProductFieldChecked(false);
        }
    };

    const onSelectProductFieldChange = (e, isExport = false) => {
        let _selectedProductFieldsForImportExport = [...selectedProductFieldsForImportExport];

        if (e.checked) {
            if (e.value === "StoneDetails") {
                if (isExport) {
                    for (let stoneField of PRODUCT_STONE_DETAILS_FIELDS_DATA) {
                        _selectedProductFieldsForImportExport.push(stoneField);
                    }
                }
                else {
                    for (let stoneField of PRODUCT_STONE_DETAILS_FIELDS_DATA) {
                        if (stoneField !== "StoneCost1" &&
                            stoneField !== "StoneCost2" &&
                            stoneField !== "StoneCost3" &&
                            stoneField !== "StoneCost4" &&
                            stoneField !== "StoneCost5" &&
                            stoneField !== "StoneCost6" &&
                            stoneField !== "StoneCost7"
                        ) {
                            _selectedProductFieldsForImportExport.push(stoneField);
                        }
                    }
                }
            }

            else if (e.value === "SellingPrice") {
                if (isExport) {
                    for (let sellingPriceField of PRODUCT_SELLING_PRICE_FIELDS_DATA) {
                        _selectedProductFieldsForImportExport.push(sellingPriceField);
                    }
                }
                else {
                    for (let sellingPriceField of PRODUCT_SELLING_PRICE_FIELDS_DATA) {
                        if (sellingPriceField !== "AmazonSuggested" &&
                            sellingPriceField !== "PeoraSuggested" &&
                            sellingPriceField !== "OravoSuggested" &&
                            sellingPriceField !== "SMSuggested" &&
                            sellingPriceField !== "ROSuggested") {
                            _selectedProductFieldsForImportExport.push(sellingPriceField);
                        }
                    }
                }
            }
            _selectedProductFieldsForImportExport.push(e.value);
        }
        else {
            if (e.value === "StoneDetails") {
                for (let stoneField of PRODUCT_STONE_DETAILS_FIELDS_DATA) {
                    _selectedProductFieldsForImportExport = _selectedProductFieldsForImportExport.filter(item => item !== stoneField);
                }
            }
            else if (e.value === "SellingPrice") {
                for (let sellingPriceField of PRODUCT_SELLING_PRICE_FIELDS_DATA) {
                    _selectedProductFieldsForImportExport = _selectedProductFieldsForImportExport.filter(item => item !== sellingPriceField);
                }
            }
            _selectedProductFieldsForImportExport = _selectedProductFieldsForImportExport.filter(item => item !== e.value);
        }

        let removeStoneDetailsFields = [..._selectedProductFieldsForImportExport];
        if (isExport) {
            removeStoneDetailsFields = removeStoneDetailsFields.filter(item => item !== "StoneDetails" && item !== "SellingPrice");
        }
        else {
            removeStoneDetailsFields = removeStoneDetailsFields.filter(item => item !== "StoneDetails" && item !== "SellingPrice" && item !== "ModifiedDate");
        }

        setSelectedProductFieldsForImportExport(_selectedProductFieldsForImportExport);
        setFinalFieldsForImportExport(removeStoneDetailsFields);
    };

    const onProductDataCSVFileUpload = async (csvFile) => {
        const file = csvFile[0];
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                if (results?.data?.length <= 500) {
                    setCsvArray(results?.data);
                    importProductsDataToList(results?.data);
                }
                else {
                    showErrorToast("Please import maximum 500 products at a time.");
                }
            },
        });
    };

    const preparedStoneDetailsObject = (stoneCode, stoneQty, sequence) => {
        if (stoneCode && stoneQty) {
            const filteredStoneData = allStoneData.filter(x => x?.StoneCode?.trim().toLowerCase() === stoneCode.trim().toLowerCase());
            if (filteredStoneData && filteredStoneData.length > 0) {
                const preparedStoneDataObject = {};
                preparedStoneDataObject["stoneId"] = filteredStoneData[0].Id;
                preparedStoneDataObject["stoneCode"] = filteredStoneData[0].StoneCode;
                preparedStoneDataObject["StoneCost"] = parseFloat((filteredStoneData[0].LanEa * parseInt(stoneQty)).toFixed(2));
                preparedStoneDataObject["StQuantity"] = parseInt(stoneQty);
                preparedStoneDataObject["Sequence"] = parseInt(sequence);
                return preparedStoneDataObject;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };

    const importProductsDataToList = async (resultData) => {

        setBlocked(true);
        const preparedProductsDataToAdd = [];
        const preparedProductsDataToUpdate = [];

        const importProductsDataArray = [...resultData];

        for (const productItem of importProductsDataArray) {
            const preparedProductItemData = { ...productItem };
            const preparedStoneDetailsData = [];
            const preparedSellingPriceData = {
                amazon: {
                    "Actual": null,
                    "Suggested": null
                },
                peora: {
                    "Actual": null,
                    "Suggested": null
                },
                oravo: {
                    "Actual": null,
                    "Suggested": null
                },
                sm: {
                    "Actual": null,
                    "Suggested": null
                },
                ro: {
                    "Actual": null,
                    "Suggested": null
                }
            };

            if (productItem.SKU) {
                if (productItem.SKU) {
                    preparedProductItemData.Title = productItem.SKU;
                }

                if (productItem.Category) {
                    const filteredCategory = refactorProductCategoryData.filter(x => x.CatName === productItem.Category);
                    if (filteredCategory && filteredCategory.length > 0) {
                        preparedProductItemData.CategoryId = filteredCategory[0].Id;
                    }
                }

                if (productItem.Vendor1) {
                    const filteredVendor = refactorAllVendorData.filter(x => x.VendorName === productItem.Vendor1);
                    if (filteredVendor && filteredVendor.length > 0) {
                        preparedProductItemData.VendorId = filteredVendor[0].Id;
                    }
                }

                if (productItem.MetalType) {
                    const filteredMetalType = refactorMetalData.filter(x => x.MetalTypeName === productItem.MetalType);
                    if (filteredMetalType && filteredMetalType.length > 0) {
                        preparedProductItemData.MetalTypeId = filteredMetalType[0].Id;
                    }
                }

                if (productItem.Length) {
                    const filteredLength = refactorLengthData.filter(x => x.Title === productItem.Length);
                    if (filteredLength && filteredLength.length > 0) {
                        preparedProductItemData.LengthId = filteredLength[0].Id;
                    }
                }

                if (productItem.Width) {
                    const filteredWidth = refactorWidthData.filter(x => x.Title === productItem.Width);
                    if (filteredWidth && filteredWidth.length > 0) {
                        preparedProductItemData.WidthId = filteredWidth[0].Id;
                    }
                }

                if (productItem.BaseMetal) {
                    const filteredBaseMetal = refactorAllBaseMetal.filter(x => x.Title === productItem.BaseMetal);
                    if (filteredBaseMetal && filteredBaseMetal.length > 0) {
                        preparedProductItemData.BaseMetalId = filteredBaseMetal[0].Id;
                    }
                }

                if (productItem.BaseStone) {
                    const filteredBaseStone = refactorAllBaseStone.filter(x => x.Title === productItem.BaseStone);
                    if (filteredBaseStone && filteredBaseStone.length > 0) {
                        preparedProductItemData.BaseStoneId = filteredBaseStone[0].Id;
                    }
                }

                if (productItem.BoxType) {
                    const filteredBoxType = refactorAllBoxType.filter(x => x.Title === productItem.BoxType);
                    if (filteredBoxType && filteredBoxType.length > 0) {
                        preparedProductItemData.BoxTypeId = filteredBoxType[0].Id;
                    }
                }

                if (productItem.InsertType) {
                    const filteredInsertType = refactorAllInsertType.filter(x => x.Title === productItem.InsertType);
                    if (filteredInsertType && filteredInsertType.length > 0) {
                        preparedProductItemData.InsertTypeId = filteredInsertType[0].Id;
                    }
                }

                if (productItem.ChainType) {
                    const filteredChainType = refactorAllChainType.filter(x => x.Title === productItem.ChainType);
                    if (filteredChainType && filteredChainType.length > 0) {
                        preparedProductItemData.ChainTypeId = filteredChainType[0].Id;
                    }
                }

                if (productItem.BackingType) {
                    const filteredBackingType = refactorAllBackingType.filter(x => x.Title === productItem.BackingType);
                    if (filteredBackingType && filteredBackingType.length > 0) {
                        preparedProductItemData.BackingTypeId = filteredBackingType[0].Id;
                    }
                }

                if (productItem.Subcategory) {
                    const filteredSubcategory = refactorProductSubCategoryData.filter(x => x.SubCatName === productItem.Subcategory);
                    if (filteredSubcategory && filteredSubcategory.length > 0) {
                        preparedProductItemData.SubcategoryId = filteredSubcategory[0].Id;
                    }
                }

                if (productItem.Vendor2) {
                    const filteredVendor2 = refactorAllVendorData.filter(x => x.VendorName === productItem.Vendor2);
                    if (filteredVendor2 && filteredVendor2.length > 0) {
                        preparedProductItemData.Vendor2Id = filteredVendor2[0].Id;
                    }
                }

                if (productItem.Parentage) {
                    const filteredParentage = refactorAllParentage.filter(x => x.Title === productItem.Parentage);
                    if (filteredParentage && filteredParentage.length > 0) {
                        preparedProductItemData.ParentageId = filteredParentage[0].Id;
                    }
                }

                if (productItem.RecoverableCost) {
                    const filteredRecoverableCost = refactorAllRecoverableCost.filter(x => x.Cost === parseInt(productItem.RecoverableCost));
                    if (filteredRecoverableCost && filteredRecoverableCost.length > 0) {
                        preparedProductItemData.RecoverableCostId = filteredRecoverableCost[0].Id;
                    }
                }

                if (!productItem.OnFBA || productItem.OnFBA == "" || productItem.OnFBA == undefined) {
                    delete preparedProductItemData.OnFBA;
                }

                if (!productItem.VIPSKU || productItem.VIPSKU == "" || productItem.VIPSKU == undefined) {
                    delete preparedProductItemData.VIPSKU;
                }

                if (!productItem.Retired || productItem.Retired == "" || productItem.Retired == undefined) {
                    delete preparedProductItemData.Retired;
                }

                if (!productItem.WatchList || productItem.WatchList == "" || productItem.WatchList == undefined) {
                    delete preparedProductItemData.WatchList;
                }

                if (!productItem.Inactive || productItem.Inactive == "" || productItem.Inactive == undefined) {
                    delete preparedProductItemData.Inactive;
                }

                if (productItem.MtWtFOB == "" || productItem.MtWtFOB == undefined) {
                    delete preparedProductItemData.MtWtFOB;
                }

                if (productItem.MtWtFeed == "" || productItem.MtWtFeed == undefined) {
                    delete preparedProductItemData.MtWtFeed;
                }

                if (productItem.TierLevel == "" || productItem.TierLevel == undefined) {
                    delete preparedProductItemData.TierLevel;
                }

                if (productItem.OfficeQty == "" || productItem.OfficeQty == undefined) {
                    delete preparedProductItemData.OfficeQty;
                }

                if (productItem.FBAQty == "" || productItem.FBAQty == undefined) {
                    delete preparedProductItemData.FBAQty;
                }

                if (productItem.OnOrder == "" || productItem.OnOrder == undefined) {
                    delete preparedProductItemData.OnOrder;
                }

                if (productItem.RestockLevel == "" || productItem.RestockLevel == undefined) {
                    delete preparedProductItemData.RestockLevel;
                }

                if (productItem.ReserveQty == "" || productItem.ReserveQty == undefined) {
                    delete preparedProductItemData.ReserveQty;
                }

                if (productItem.Return == "" || productItem.Return == undefined) {
                    delete preparedProductItemData.Return;
                }

                if (productItem.RingSize == "" || productItem.RingSize == undefined) {
                    delete preparedProductItemData.RingSize;
                }

                if (productItem.FOBMountingCost == "" || productItem.FOBMountingCost == undefined) {
                    delete preparedProductItemData.FOBMountingCost;
                }

                if (productItem.LDMountCost == "" || productItem.LDMountCost == undefined) {
                    delete preparedProductItemData.LDMountCost;
                }

                if (productItem.MiscCost1 == "" || productItem.MiscCost1 == undefined) {
                    delete preparedProductItemData.MiscCost1;
                }

                if (productItem.MiscCost2 == "" || productItem.MiscCost2 == undefined) {
                    delete preparedProductItemData.MiscCost2;
                }

                if (productItem.AmzLaunch) {
                    preparedProductItemData.AmzLaunch = new Date(productItem.AmzLaunch);
                }
                else {
                    preparedProductItemData.AmzLaunch = null;
                }

                if (productItem.OfficeQtyZeroDate) {
                    preparedProductItemData.OfficeQtyZeroDate = new Date(productItem.OfficeQtyZeroDate);
                }
                else {
                    preparedProductItemData.OfficeQtyZeroDate = null;
                }

                if (productItem.FBAQtyZeroDate) {
                    preparedProductItemData.FBAQtyZeroDate = new Date(productItem.FBAQtyZeroDate);
                }
                else {
                    preparedProductItemData.FBAQtyZeroDate = null;
                }

                if (productItem.RetiredDate) {
                    preparedProductItemData.RetiredDate = new Date(productItem.RetiredDate);
                }
                else {
                    preparedProductItemData.RetiredDate = null;
                }

                if (productItem.WatchListDate) {
                    preparedProductItemData.WatchListDate = new Date(productItem.WatchListDate);
                }
                else {
                    preparedProductItemData.WatchListDate = null;
                }

                if (productItem.StoneCode1 && productItem.StoneQty1) {
                    const stoneObj = await preparedStoneDetailsObject(productItem.StoneCode1, productItem.StoneQty1, 1);
                    if (stoneObj) {
                        preparedStoneDetailsData.push(stoneObj);
                    }
                }

                if (productItem.StoneCode2 && productItem.StoneQty2) {
                    const stoneObj = await preparedStoneDetailsObject(productItem.StoneCode2, productItem.StoneQty2, 2);
                    if (stoneObj) {
                        preparedStoneDetailsData.push(stoneObj);
                    }
                }

                if (productItem.StoneCode3 && productItem.StoneQty3) {
                    const stoneObj = await preparedStoneDetailsObject(productItem.StoneCode3, productItem.StoneQty3, 3);
                    if (stoneObj) {
                        preparedStoneDetailsData.push(stoneObj);
                    }
                }

                if (productItem.StoneCode4 && productItem.StoneQty4) {
                    const stoneObj = await preparedStoneDetailsObject(productItem.StoneCode4, productItem.StoneQty4, 4);
                    if (stoneObj) {
                        preparedStoneDetailsData.push(stoneObj);
                    }
                }

                if (productItem.StoneCode5 && productItem.StoneQty5) {
                    const stoneObj = await preparedStoneDetailsObject(productItem.StoneCode5, productItem.StoneQty5, 5);
                    if (stoneObj) {
                        preparedStoneDetailsData.push(stoneObj);
                    }
                }

                if (productItem.StoneCode6 && productItem.StoneQty6) {
                    const stoneObj = await preparedStoneDetailsObject(productItem.StoneCode6, productItem.StoneQty6, 6);
                    if (stoneObj) {
                        preparedStoneDetailsData.push(stoneObj);
                    }
                }

                if (productItem.StoneCode7 && productItem.StoneQty7) {
                    const stoneObj = await preparedStoneDetailsObject(productItem.StoneCode7, productItem.StoneQty7, 7);
                    if (stoneObj) {
                        preparedStoneDetailsData.push(stoneObj);
                    }
                }

                if (productItem.AmazonActual) {
                    preparedSellingPriceData.amazon.Actual = productItem.AmazonActual;
                }

                if (productItem.PeoraActual) {
                    preparedSellingPriceData.peora.Actual = productItem.PeoraActual;
                }

                if (productItem.OravoActual) {
                    preparedSellingPriceData.oravo.Actual = productItem.OravoActual;
                }

                if (productItem.SMActual) {
                    preparedSellingPriceData.sm.Actual = productItem.SMActual;
                }

                if (productItem.ROActual) {
                    preparedSellingPriceData.ro.Actual = productItem.ROActual;
                }

                if (productItem.RecoverableCost ||
                    (productItem.StoneCode1 && productItem.StoneQty1) ||
                    (productItem.StoneCode2 && productItem.StoneQty2) ||
                    (productItem.StoneCode3 && productItem.StoneQty3) ||
                    (productItem.StoneCode4 && productItem.StoneQty4) ||
                    (productItem.StoneCode5 && productItem.StoneQty5) ||
                    (productItem.StoneCode6 && productItem.StoneQty6) ||
                    (productItem.StoneCode7 && productItem.StoneQty7) ||
                    productItem.LDMountCost ||
                    productItem.MiscCost1 ||
                    productItem.MiscCost2) {

                    const existingProductData = products.filter(x => x.Title === productItem.SKU)[0];

                    let recoverableCost;
                    let baseMetal;
                    let stoneDetailsData = [];
                    let dataObjectForCalculateTotalCost = {
                        "LDMountCost": 0,
                        "MiscCost1": 0,
                        "MiscCost2": 0,
                    };

                    if (productItem.RecoverableCost) {
                        const filteredRecoverableCost = refactorAllRecoverableCost.filter(x => x.Cost === parseInt(productItem.RecoverableCost));
                        if (filteredRecoverableCost && filteredRecoverableCost.length > 0) {
                            recoverableCost = filteredRecoverableCost[0].Cost;
                        }
                        else {
                            recoverableCost = 0;
                        }
                    }
                    else {
                        recoverableCost = existingProductData?.RecoverableCost?.Cost ? existingProductData?.RecoverableCost?.Cost : 0;
                    }


                    if (productItem.BaseMetal) {
                        const filteredBaseMetal = refactorAllBaseMetal.filter(x => x.Title === productItem.BaseMetal);
                        if (filteredBaseMetal && filteredBaseMetal.length > 0) {
                            baseMetal = filteredBaseMetal[0].Title;
                        }
                        else {
                            baseMetal = "";
                        }
                    }
                    else {
                        baseMetal = existingProductData?.BaseMetal?.Title ? existingProductData?.BaseMetal?.Title : "";
                    }

                    if ((productItem.StoneCode1 && productItem.StoneQty1) ||
                        (productItem.StoneCode2 && productItem.StoneQty2) ||
                        (productItem.StoneCode3 && productItem.StoneQty3) ||
                        (productItem.StoneCode4 && productItem.StoneQty4) ||
                        (productItem.StoneCode5 && productItem.StoneQty5) ||
                        (productItem.StoneCode6 && productItem.StoneQty6) ||
                        (productItem.StoneCode7 && productItem.StoneQty7)) {
                        stoneDetailsData = preparedStoneDetailsData;
                    }
                    else {
                        stoneDetailsData = existingProductData?.StoneDetails ? JSON.parse(existingProductData?.StoneDetails) : [];
                    }

                    if (productItem.LDMountCost) {
                        dataObjectForCalculateTotalCost.LDMountCost = productItem.LDMountCost;
                    }
                    else {
                        dataObjectForCalculateTotalCost.LDMountCost = existingProductData?.LDMountCost ? existingProductData?.LDMountCost : 0;
                    }

                    if (productItem.MiscCost1) {
                        dataObjectForCalculateTotalCost.MiscCost1 = productItem.MiscCost1;
                    }
                    else {
                        dataObjectForCalculateTotalCost.MiscCost1 = existingProductData?.MiscCost1 ? existingProductData?.MiscCost1 : 0;
                    }

                    if (productItem.MiscCost2) {
                        dataObjectForCalculateTotalCost.MiscCost2 = productItem.MiscCost2;
                    }
                    else {
                        dataObjectForCalculateTotalCost.MiscCost2 = existingProductData?.MiscCost2 ? existingProductData?.MiscCost2 : 0;
                    }

                    const totalCostValues = await getTotalCostForImportExportProducts(stoneDetailsData, dataObjectForCalculateTotalCost);
                    preparedSellingPriceData.amazon.Suggested = await getChannelsSuggestedPrice("Amazon", baseMetal, parseInt(recoverableCost ? recoverableCost : 0), totalCostValues?.TotalCost);
                    preparedSellingPriceData.peora.Suggested = await getChannelsSuggestedPrice("Peora", baseMetal, parseInt(recoverableCost ? recoverableCost : 0), totalCostValues?.TotalCost);
                    preparedSellingPriceData.oravo.Suggested = await getChannelsSuggestedPrice("Oravo", null, 0, totalCostValues?.TotalCost);
                    preparedSellingPriceData.sm.Suggested = await getChannelsSuggestedPrice("SM", null, 0, totalCostValues?.TotalCost);
                    preparedSellingPriceData.ro.Suggested = await getChannelsSuggestedPrice("RO", baseMetal, parseInt(recoverableCost ? recoverableCost : 0), totalCostValues?.TotalCost);
                    preparedProductItemData.SellingPrice = JSON.stringify(preparedSellingPriceData);
                }

                if (preparedStoneDetailsData.length > 0) {
                    preparedStoneDetailsData.map((stoneElement, index) => stoneElement.Sequence = index + 1);
                    preparedProductItemData.StoneDetails = JSON.stringify(preparedStoneDetailsData);
                }

                if (productItem.AmazonActual ||
                    productItem.PeoraActual ||
                    productItem.OravoActual ||
                    productItem.SMActual ||
                    productItem.ROActual) {
                    preparedProductItemData.SellingPrice = JSON.stringify(preparedSellingPriceData);
                }

                if (!productItem.AmazonActual &&
                    !productItem.PeoraActual &&
                    !productItem.OravoActual &&
                    !productItem.SMActual &&
                    !productItem.ROActual) {

                    const existingProductDataForSellingPrice = products.filter(x => x.Title === productItem.SKU)[0];
                    const parseExistingSellingPrice = existingProductDataForSellingPrice ? JSON.parse(existingProductDataForSellingPrice?.SellingPrice) : preparedSellingPriceData;
                    preparedSellingPriceData.amazon.Actual = parseExistingSellingPrice?.amazon?.Actual;
                    preparedSellingPriceData.peora.Actual = parseExistingSellingPrice?.peora?.Actual;
                    preparedSellingPriceData.oravo.Actual = parseExistingSellingPrice?.oravo?.Actual;
                    preparedSellingPriceData.sm.Actual = parseExistingSellingPrice?.sm?.Actual;
                    preparedSellingPriceData.ro.Actual = parseExistingSellingPrice?.ro?.Actual;
                    preparedProductItemData.SellingPrice = JSON.stringify(preparedSellingPriceData);
                }

                // delete product field data
                delete preparedProductItemData.SKU;
                delete preparedProductItemData.Category;
                delete preparedProductItemData.Vendor;
                delete preparedProductItemData.Vendor1;
                delete preparedProductItemData.MetalType;
                delete preparedProductItemData.Length;
                delete preparedProductItemData.Width;
                delete preparedProductItemData.BaseMetal;
                delete preparedProductItemData.BaseStone;
                delete preparedProductItemData.BoxType;
                delete preparedProductItemData.InsertType;
                delete preparedProductItemData.ChainType;
                delete preparedProductItemData.BackingType;
                delete preparedProductItemData.Subcategory;
                delete preparedProductItemData.Vendor2;
                delete preparedProductItemData.Parentage;
                delete preparedProductItemData.RecoverableCost;
                delete preparedProductItemData.TotalStoneCost;
                delete preparedProductItemData.TotalCost;
                delete preparedProductItemData.Modified;
                delete preparedProductItemData.ModifiedDate;

                // delete stone field data
                delete preparedProductItemData.StoneCode1;
                delete preparedProductItemData.StoneQty1;
                delete preparedProductItemData.StoneCode2;
                delete preparedProductItemData.StoneQty2;
                delete preparedProductItemData.StoneCode3;
                delete preparedProductItemData.StoneQty3;
                delete preparedProductItemData.StoneCode4;
                delete preparedProductItemData.StoneQty4;
                delete preparedProductItemData.StoneCode5;
                delete preparedProductItemData.StoneQty5;
                delete preparedProductItemData.StoneCode6;
                delete preparedProductItemData.StoneQty6;
                delete preparedProductItemData.StoneCode7;
                delete preparedProductItemData.StoneQty7;

                // delete selling price field data
                delete preparedProductItemData.AmazonSuggested;
                delete preparedProductItemData.AmazonActual;
                delete preparedProductItemData.PeoraSuggested;
                delete preparedProductItemData.PeoraActual;
                delete preparedProductItemData.OravoSuggested;
                delete preparedProductItemData.OravoActual;
                delete preparedProductItemData.SMSuggested;
                delete preparedProductItemData.SMActual;
                delete preparedProductItemData.ROSuggested;
                delete preparedProductItemData.ROActual;

                const ifProductDataExist = products.filter(x => x.Title === productItem.SKU);
                if (ifProductDataExist && ifProductDataExist.length > 0) {
                    preparedProductItemData.Id = ifProductDataExist[0].Id;
                    preparedProductsDataToUpdate.push(preparedProductItemData);
                }
                else {
                    preparedProductsDataToAdd.push(preparedProductItemData);
                }
            }
        }

        if (preparedProductsDataToUpdate.length > 0) {
            updateBulkProductItems(preparedProductsDataToUpdate, preparedProductsDataToUpdate.length >= preparedProductsDataToAdd.length ? true : false);
        }

        if (preparedProductsDataToAdd.length > 0) {
            addBulkProductItems(preparedProductsDataToAdd, preparedProductsDataToAdd.length >= preparedProductsDataToUpdate.length ? true : false);
        }

        if (preparedProductsDataToUpdate.length == 0 && preparedProductsDataToAdd.length == 0) {
            setBlocked(false);
            setIsUploadCSVisible(false);
        }
    };

    const addBulkProductItems = async (arrayItem, isBlockUIFalse) => {
        const sp: SPFI = getSP();
        const list: IList = sp.web.lists.getByTitle(LISTS.INVENTORY.NAME);

        const [batchedListBehavior, execute] = createBatch(list);
        list.using(batchedListBehavior);

        for (const item of arrayItem) {
            list.items.add(item);
        }

        try {
            await execute();
            showSuccessToast(arrayItem.length + " Item added successfully");
            await getAllInventory();
            if (isBlockUIFalse) {
                setBlocked(false);
                setIsUploadCSVisible(false);
            }
        }
        catch (error) {
            console.log("error......", error);
            showErrorToast("Error in product add!");
            setBlocked(false);
            setIsUploadCSVisible(false);
        };
    };

    const updateBulkProductItems = async (arrayItem, isBlockUIFalse) => {
        const sp: SPFI = getSP();
        const list: IList = sp.web.lists.getByTitle(LISTS.INVENTORY.NAME);

        const [batchedListBehavior, execute] = createBatch(list);
        list.using(batchedListBehavior);

        for (const item of arrayItem) {
            list.items.getById(item.Id).update(item);
        }

        try {
            await execute();
            showSuccessToast(arrayItem.length + " Item updated successfully");
            await getAllInventory();
            if (isBlockUIFalse) {
                setBlocked(false);
                setIsUploadCSVisible(false);
            }
        }
        catch (error) {
            console.log("error......", error);
            showErrorToast("Error in product update!");
            setBlocked(false);
            setIsUploadCSVisible(false);
        };
    };

    const onClickGenerateCSVFile = () => {
        setImportVisible(true);
        setSelectedProductFieldsForImportExport([PRODUCT_FIELDS_DATA[0]]);
        setFinalFieldsForImportExport([PRODUCT_FIELDS_DATA[0]]);
        setAllProductFieldChecked(false);
    };

    const onClickExportCSVFile = () => {
        setExportVisible(true);
        setSelectedProductFieldsForImportExport([PRODUCT_FIELDS_DATA[0]]);
        setFinalFieldsForImportExport([PRODUCT_FIELDS_DATA[0]]);
        setAllProductFieldChecked(false);

    };

    return (
        <div className='p-fluid grid'>
            <div className='col-2 md:col-2 lg:col-2 m-0'>
                <div className="card flex justify-content-center" style={{ minHeight: gridViewHeight }}>
                    <DataTable className='sku-data-table' value={products} scrollable scrollHeight={(gridViewHeight - 10) + "px"} selectionMode="single" filters={globalFilter} showGridlines header={header}
                        selection={selectedProduct} onSelectionChange={(e) => selectedProductData(e.value)} metaKeySelection={false}>
                        <Column field="Title" header="SKU No." style={{ width: '45%' }} sortable></Column>
                        <Column field="VendorRef1" header="Vendor Ref 1" style={{ width: '55%' }} sortable></Column>
                    </DataTable>
                </div>
            </div>

            <div ref={contentDivRef} className='col-10 md:col-10 lg:col-10'>
                <Card header={productHeader} className='product-card'>
                    <Toast ref={toast}></Toast>
                    <BlockUI blocked={blocked} fullScreen template={<CustomSpinner />} />
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel header="Product Info" leftIcon="pi pi-shopping-bag mr-2">
                            <div className="p-fluid grid p-3">
                                <div className='col-12 md:col-3 lg:col-3'>
                                    <Fieldset className="p-0 m-0">
                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="SKU" className="font-bold block my-2">
                                                        SKU<span className="required" hidden={isStatusActive}> *</span>
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputText value={state?.Title} onChange={(e) => handleChange(e)} id="Title" name="Title" disabled={isStatusActive} className={classNames({ 'p-invalid': submitted && !state?.Title?.trim().length }, "w-full")} />
                                                    {submitted && !state?.Title?.trim().length && <small className="p-error">SKU is required.</small>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="MFNSKU" className="font-bold block my-2">
                                                        MFN SKU
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputText value={state?.MFNSKU} onChange={(e) => handleChange(e)} id="MFNSKU" name="MFNSKU" disabled={isStatusActive} />
                                                    {/* {submitted && !state?.MFNSKU?.trim().length && <small className="p-error">MFN SKU is required.</small>} ----- className={classNames({ 'p-invalid': submitted && !state?.MFNSKU?.trim().length }, "w-full")}*/}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="FBASKU" className="font-bold block my-2">
                                                        FBA SKU
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputText value={state?.FBASKU} onChange={(e) => handleChange(e)} id="FBASKU" name="FBASKU" disabled={isStatusActive} />
                                                    {/* {submitted && !state?.FBASKU?.trim().length && <small className="p-error">FBA SKU is required.</small>} ---- className={classNames({ 'p-invalid': submitted && !state?.FBASKU?.trim().length }, "w-full")}*/}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="Category" className="font-bold block my-2">
                                                        Category<span className="required" hidden={isStatusActive}> *</span>
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.Category} options={refactorProductCategoryData} onChange={handleDropdownChange} id="Category" name="Category" optionLabel="CatName" disabled={isStatusActive} className={classNames({ 'p-invalid': submitted && !state?.Category }, "w-full")} showClear filter />
                                                    {submitted && !state?.Category && <small className="p-error">Category is required.</small>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="Vendor" className="font-bold block my-2">
                                                        Vendor 1
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.Vendor} options={refactorAllVendorData} onChange={handleDropdownChange} id="Vendor" name="Vendor" optionLabel="VendorName" disabled={isStatusActive} showClear filter />
                                                    {/* {submitted && !state?.Vendor && <small className="p-error">Vendor is required.</small>} className={classNames({ 'p-invalid': submitted && !state?.Vendor }, "w-full")} */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="VendorRef1" className="font-bold block my-2">
                                                        Ven Ref 1
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputText value={state?.VendorRef1} onChange={(e) => handleChange(e)} id="VendorRef1" name="VendorRef1" disabled={isStatusActive} />
                                                    {/* {submitted && !state?.VendorRef1?.trim().length && <small className="p-error">Vendor Ref is required.</small> className={classNames({ 'p-invalid': submitted && !state?.VendorRef1?.trim().length }, "w-full")}} */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="MtWtFOB" className="font-bold block my-2">
                                                        Mt Wt FOB
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputNumber value={state?.MtWtFOB} min={0} onChange={(e) => handleChangeNumber(e, "MtWtFOB")} id="MtWtFOB" name="MtWtFOB" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                    {/* {submitted && !state?.VendorRef1?.trim().length && <small className="p-error">Vendor Ref is required.</small> ---  className={classNames({ 'p-invalid': submitted && !state?.VendorRef1?.trim().length }, "w-full")}} */}
                                                </div>
                                            </div>
                                        </div>


                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="MtWtFeed" className="font-bold block my-2">
                                                        Mt Wt Feed
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputNumber value={state?.MtWtFeed} min={0} onChange={(e) => handleChangeNumber(e, "MtWtFeed")} id="MtWtFeed" name="MtWtFeed" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                    {/* {submitted && !state?.VendorRef1?.trim().length && <small className="p-error">Vendor Ref is required.</small> ----  className={classNames({ 'p-invalid': submitted && !state?.VendorRef1?.trim().length }, "w-full")} } */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="MetalType" className="font-bold block my-2">
                                                        Metal Type<span className="required" hidden={isStatusActive}> *</span>
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.MetalType} options={refactorMetalData} onChange={handleDropdownChange} id="MetalType" name="MetalType" optionLabel="MetalTypeName" disabled={isStatusActive} className={classNames({ 'p-invalid': submitted && !state?.MetalType }, "w-full")} showClear filter />
                                                    {submitted && !state?.MetalType && <small className="p-error">Metal Type is required.</small>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="OnFBA" className="font-bold block my-2">
                                                        On FBA
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <div className='flex flex-wrap gap-3 mt-1'>
                                                        <div className="flex align-items-center">
                                                            <RadioButton inputId="OnFBA1" name="OnFBA" value={true} onChange={(e) => handleChange(e)} checked={state?.OnFBA === true} />
                                                            <label htmlFor="OnFBA1" className="ml-2">Yes</label>
                                                        </div>
                                                        <div className="flex align-items-center">
                                                            <RadioButton inputId="OnFBA2" name="OnFBA" value={false} onChange={(e) => handleChange(e)} checked={state?.OnFBA === false} />
                                                            <label htmlFor="OnFBA2" className="ml-2">No</label>
                                                        </div>
                                                    </div>
                                                    {/* <InputSwitch checked={state?.OnFBA} onChange={(e) => handleChange(e)} id="OnFBA" name="OnFBA" disabled={isStatusActive} /> */}
                                                    {/* {submitted && !state?.VendorRef1?.trim().length && <small className="p-error">Vendor Ref is required.</small> ----  className={classNames({ 'p-invalid': submitted && !state?.VendorRef1?.trim().length }, "w-full")} } */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="TierLevel" className="font-bold block my-2">
                                                        Tier
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputNumber value={state?.TierLevel} min={0} onChange={(e) => handleChangeNumber(e, "TierLevel")} id="TierLevel" name="TierLevel" disabled={isStatusActive} />
                                                    {/* {submitted && !state?.VendorRef1?.trim().length && <small className="p-error">Vendor Ref is required.</small> ----  className={classNames({ 'p-invalid': submitted && !state?.VendorRef1?.trim().length }, "w-full")} } */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="AmzLaunch" className="font-bold block my-2">
                                                        AmzLaunch
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Calendar value={state?.AmzLaunch} onChange={(e) => handleChange(e)} id="AmzLaunch" name="AmzLaunch" showIcon disabled={isStatusActive} />
                                                    {/* {submitted && !state?.VendorRef1?.trim().length && <small className="p-error">Vendor Ref is required.</small> ----  className={classNames({ 'p-invalid': submitted && !state?.VendorRef1?.trim().length }, "w-full")} } */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="Modified" className="font-bold block my-2">
                                                        Modified Dt
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Calendar value={state?.Modified} onChange={(e) => handleChange(e)} id="Modified" name="Modified" disabled showIcon />
                                                    {/* {submitted && !state?.VendorRef1?.trim().length && <small className="p-error">Vendor Ref is required.</small> ----  className={classNames({ 'p-invalid': submitted && !state?.VendorRef1?.trim().length }, "w-full")} } */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="RecoverableCost" className="font-bold block my-2">
                                                        Recoverable
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.RecoverableCost} options={refactorAllRecoverableCost} onChange={handleDropdownChange} id="RecoverableCost" name="RecoverableCost" optionLabel="Cost" disabled={isStatusActive} showClear filter />
                                                    {/* <InputNumber value={state?.RecoverableCost} min={0}  id="RecoverableCost" name="RecoverableCost" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} /> */}
                                                    {/* {submitted && !state?.VendorRef1?.trim().length && <small className="p-error">Vendor Ref is required.</small> ----  className={classNames({ 'p-invalid': submitted && !state?.VendorRef1?.trim().length }, "w-full")} } */}
                                                </div>
                                            </div>
                                        </div>
                                    </Fieldset>
                                </div>
                                <div className='col-12 md:col-3 lg:col-3'>
                                    <Fieldset className="p-0 m-0">
                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="OfficeQty" className="font-bold block my-2">
                                                        Office Qty
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputNumber value={state?.OfficeQty} onChange={(e) => { setState({ ...state, OfficeQty: e.value }) }} id="OfficeQty" name="OfficeQty" disabled={isStatusActive} />
                                                    {/* {submitted && !state?.OfficeQty && <small className="p-error">Office Qty is required.</small>} className={classNames({ 'p-invalid': submitted && !state?.OfficeQty }, "w-full")} */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="FBAQty" className="font-bold block my-2">
                                                        FBA Qty
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputNumber value={state?.FBAQty} onChange={(e) => { setState({ ...state, FBAQty: e.value }) }} id="FBAQty" name="FBAQty" disabled={isStatusActive} />
                                                    {/* {submitted && !state?.FBAQty?.toString().trim().length && <small className="p-error">FBA Qty is required.</small> } ----  className={classNames({ 'p-invalid': submitted && !state?.FBAQty?.toString().trim().length }, "w-full")}*/}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="OnOrder" className="font-bold block my-2">
                                                        On Order
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputNumber value={state?.OnOrder} onChange={(e) => { setState({ ...state, OnOrder: e.value }) }} id="OnOrder" name="OnOrder" disabled={isStatusActive} />
                                                    {/* {submitted && !state?.FBAQty?.toString().trim().length && <small className="p-error">FBA Qty is required.</small> } ----  className={classNames({ 'p-invalid': submitted && !state?.FBAQty?.toString().trim().length }, "w-full")}*/}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="RestockLevel" className="font-bold block my-2">
                                                        Restock
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputNumber value={state?.RestockLevel} min={0} onChange={(e) => { setState({ ...state, RestockLevel: e.value }) }} id="RestockLevel" name="RestockLevel" disabled={isStatusActive} />
                                                    {/* {submitted && !state?.RestockLevel && <small className="p-error">Restock Level is required.</small>} className={classNames({ 'p-invalid': submitted && !state?.RestockLevel }, "w-full")} */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="ReserveQty" className="font-bold block my-2">
                                                        Reserve
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputNumber value={state?.ReserveQty} min={0} onChange={(e) => { setState({ ...state, ReserveQty: e.value }) }} id="ReserveQty" name="ReserveQty" disabled={isStatusActive} />
                                                    {/* {submitted && !state?.ReserveQty && <small className="p-error">Reserve Qty is required.</small>}  className={classNames({ 'p-invalid': submitted && !state?.ReserveQty }, "w-full")} */}
                                                </div>
                                            </div>
                                        </div>
                                    </Fieldset>

                                    <Fieldset className="p-0 m-0 mt-2">
                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-12 lg:col-12'>
                                                    <label className="font-bold block my-2">
                                                        Date Qty become 0 in Stock
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="OfficeQtyZeroDate" className="font-bold block my-2">
                                                        Office
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Calendar value={state?.OfficeQtyZeroDate} onChange={(e) => handleChange(e)} id="OfficeQtyZeroDate" name="OfficeQtyZeroDate" showIcon disabled={isStatusActive} />
                                                    {/* {submitted && !state?.VendorRef1?.trim().length && <small className="p-error">Vendor Ref is required.</small> ----  className={classNames({ 'p-invalid': submitted && !state?.VendorRef1?.trim().length }, "w-full")} } */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="FBAQtyZeroDate" className="font-bold block my-2">
                                                        FBA
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Calendar value={state?.FBAQtyZeroDate} onChange={(e) => handleChange(e)} id="FBAQtyZeroDate" name="FBAQtyZeroDate" showIcon disabled={isStatusActive} />
                                                    {/* {submitted && !state?.VendorRef1?.trim().length && <small className="p-error">Vendor Ref is required.</small> ----  className={classNames({ 'p-invalid': submitted && !state?.VendorRef1?.trim().length }, "w-full")} } */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="Return" className="font-bold block my-2">
                                                        Return %
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputNumber value={state?.Return} min={0} onChange={(e) => handleChangeNumber(e, "Return")} id="Return" name="Return" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                    {/* {submitted && !state?.FBAQty?.toString().trim().length && <small className="p-error">FBA Qty is required.</small> } ----  className={classNames({ 'p-invalid': submitted && !state?.FBAQty?.toString().trim().length }, "w-full")}*/}
                                                </div>
                                            </div>
                                        </div>
                                    </Fieldset>

                                    <Fieldset className="p-0 m-0 mt-2">
                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="RingSize" className="font-bold block my-2">
                                                        Ring Size
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputNumber value={state?.RingSize} min={0} onChange={(e) => handleChangeNumber(e, "RingSize")} id="RingSize" name="RingSize" minFractionDigits={1} maxFractionDigits={1} disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="Length" className="font-bold block my-2">
                                                        Length
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.Length} options={refactorLengthData} onChange={handleDropdownChange} id="Length" name="Length" optionLabel="Title" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="Return" className="font-bold block my-2">
                                                        Width
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.Width} options={refactorWidthData} onChange={handleDropdownChange} id="Width" name="Width" optionLabel="Title" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>
                                    </Fieldset>
                                </div>
                                <div className='col-12 md:col-6 lg:col-6 p-0'>
                                    <div className='col-12 md:col-12 lg:col-12 p-0 flex'>
                                        <div className='col-12 md:col-6 lg:col-6'>
                                            <Fieldset className="p-0 m-0">
                                                <div className='col-12 md:col-12 lg:col-12 p-0' ref={productPriceRef}>
                                                    <div className='col-12 md:col-12 lg:col-12 p-0'>
                                                        <div className='flex'>
                                                            <div className='col-12 md:col-4 lg:col-4'>
                                                                <label className="font-bold block my-2">
                                                                    Selling Price
                                                                </label>
                                                            </div>
                                                            <div className='col-12 md:col-4 lg:col-4 pr-1'>
                                                                <label className="font-bold block my-2 text-center">
                                                                    Suggested
                                                                </label>
                                                            </div>

                                                            <div className='col-12 md:col-4 lg:col-4 pl-1'>
                                                                <label className="font-bold block my-2 text-center">
                                                                    Actual
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12 md:col-12 lg:col-12 p-0'>
                                                        <div className='flex'>
                                                            <div className='col-12 md:col-4 lg:col-4'>
                                                                <label htmlFor="SKU" className="font-bold block my-2">
                                                                    Amazon
                                                                </label>
                                                            </div>
                                                            <div className='col-12 md:col-4 lg:col-4 pr-1'>
                                                                <InputNumber min={0} value={amazonPrice.Suggested} onValueChange={(e) => handleChangePrice(e)} id="amazonSuggested" name="Suggested" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            </div>

                                                            <div className='col-12 md:col-4 lg:col-4 pl-1'>
                                                                <InputNumber min={0} value={amazonPrice.Actual} onValueChange={(e) => handleChangePrice(e)} id="amazonActual" name="Actual" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className='col-12 md:col-12 lg:col-12 p-0'>
                                                        <div className='flex'>
                                                            <div className='col-12 md:col-4 lg:col-4'>
                                                                <label htmlFor="SKU" className="font-bold block my-2">
                                                                    Peora
                                                                </label>
                                                            </div>
                                                            <div className='col-12 md:col-4 lg:col-4 pr-1'>
                                                                <InputNumber min={0} value={peoraPrice.Suggested} onValueChange={(e) => handleChangePrice(e)} id="peoraSuggested" name="Suggested" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            </div>

                                                            <div className='col-12 md:col-4 lg:col-4 pl-1'>
                                                                <InputNumber min={0} value={peoraPrice.Actual} onValueChange={(e) => handleChangePrice(e)} id="peoraActual" name="Actual" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12 md:col-12 lg:col-12 p-0'>
                                                        <div className='flex'>
                                                            <div className='col-12 md:col-4 lg:col-4'>
                                                                <label htmlFor="SKU" className="font-bold block my-2">
                                                                    Oravo
                                                                </label>
                                                            </div>
                                                            <div className='col-12 md:col-4 lg:col-4 pr-1'>
                                                                <InputNumber min={0} value={oravoPrice.Suggested} onValueChange={(e) => handleChangePrice(e)} id="oravoSuggested" name="Suggested" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            </div>

                                                            <div className='col-12 md:col-4 lg:col-4 pl-1'>
                                                                <InputNumber min={0} value={oravoPrice.Actual} onValueChange={(e) => handleChangePrice(e)} id="oravoActual" name="Actual" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12 md:col-12 lg:col-12 p-0'>
                                                        <div className='flex'>
                                                            <div className='col-12 md:col-4 lg:col-4'>
                                                                <label htmlFor="SKU" className="font-bold block my-2">
                                                                    SM
                                                                </label>
                                                            </div>
                                                            <div className='col-12 md:col-4 lg:col-4 pr-1'>
                                                                <InputNumber min={0} value={smPrice.Suggested} onValueChange={(e) => handleChangePrice(e)} id="smSuggested" name="Suggested" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            </div>

                                                            <div className='col-12 md:col-4 lg:col-4 pl-1'>
                                                                <InputNumber min={0} value={smPrice.Actual} onValueChange={(e) => handleChangePrice(e)} id="smActual" name="Actual" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12 md:col-12 lg:col-12 p-0'>
                                                        <div className='flex'>
                                                            <div className='col-12 md:col-4 lg:col-4'>
                                                                <label htmlFor="SKU" className="font-bold block my-2">
                                                                    RO
                                                                </label>
                                                            </div>
                                                            <div className='col-12 md:col-4 lg:col-4 pr-1'>
                                                                <InputNumber min={0} value={roPrice.Suggested} onValueChange={(e) => handleChangePrice(e)} id="roSuggested" name="Suggested" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            </div>

                                                            <div className='col-12 md:col-4 lg:col-4 pl-1'>
                                                                <InputNumber min={0} value={roPrice.Actual} onValueChange={(e) => handleChangePrice(e)} id="roActual" name="Actual" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fieldset>
                                        </div>
                                        <div className='col-12 md:col-6 lg:col-6'>
                                            <Fieldset className="p-0 m-0 flex align-items-center justify-content-center" style={{ height: priceHeight }}>
                                                <div className='col-12 md:col-12 lg:col-12 p-0'>
                                                    <div className='flex'>
                                                        <div className='col-12 md:col-12 lg:col-12 p-0 text-center image-data'>
                                                            {
                                                                selectedImage &&
                                                                <div className='col-12 md:col-12 lg:col-12 text-center image-border'>
                                                                    <Image src={selectedImage} alt="Image" width='180px' height='180px' preview />
                                                                </div>
                                                            }
                                                            <div className='flex col-12 md:col-12 lg:col-12 text-left p-0 pt-2'>
                                                                {uploadedImages && uploadedImages.length > 0 && uploadedImages.map((x, index) => {
                                                                    if (index < 4) {
                                                                        return (
                                                                            <div className='text-center image-border uploaded-image' onClick={(e) => setSelectedImage(x?.objectURL)}>
                                                                                <Image src={x?.objectURL} alt="Image" width="100%" height='100%' />
                                                                                <Button className='cancel-image' onClick={() => removeImage(x, index)} icon="pi pi-times" rounded text severity="danger" tooltip='Delete Image' aria-label="Cancel" disabled={isStatusActive} />
                                                                            </div>
                                                                        )
                                                                    }

                                                                })}

                                                                <FileUpload ref={productImageRef} multiple mode="basic" name="demo[]" url="/" accept="image/*" auto
                                                                    chooseLabel="" onUpload={(e) => onFileUpload(e.files)} onRemove={(e) => onFileRemove(e, "Logo")}
                                                                    chooseOptions={chooseOptions} disabled={isStatusActive} />

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fieldset>
                                        </div>
                                    </div>
                                    <div className='col-12 md:col-12 lg:col-12'>
                                        <Fieldset className="p-0 m-0">
                                            <div className='col-12 md:col-12 lg:col-12 p-0 flex'>
                                                <div className='col-6 md:col-6 lg:col-6 p-0'>
                                                    <div className='flex'>
                                                        <div className='col-12 md:col-4 lg:col-4'>
                                                            <label htmlFor="FOBMountingCost" className="font-bold block my-2">
                                                                FOB Mounting Cost
                                                            </label>
                                                        </div>
                                                        <div className='col-12 md:col-8 lg:col-8'>
                                                            <InputNumber value={state?.FOBMountingCost} min={0} onChange={(e) => handleChangeNumber(e, "FOBMountingCost")} id="FOBMountingCost" name="FOBMountingCost" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            {/* {submitted && !state?.FOBMountingCost?.toString().trim().length && <small className="p-error">FBO Mounting Cost is required.</small>} -- className={classNames({ 'p-invalid': submitted && !state?.FOBMountingCost?.toString().trim().length }, "w-full")} */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-6 md:col-6 lg:col-6 p-0'>
                                                    <div className='flex'>
                                                        <div className='col-12 md:col-4 lg:col-4'>
                                                            <label htmlFor="LDMountCost" className="font-bold block my-2">
                                                                LD Mounting Cost
                                                            </label>
                                                        </div>
                                                        <div className='col-12 md:col-8 lg:col-8'>
                                                            <InputNumber value={state?.LDMountCost} min={0} onChange={(e) => handleChangeNumber(e, "LDMountCost")} id="LDMountCost" name="LDMountCost" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            {/* {submitted && !state?.LDMountCost?.toString().trim().length && <small className="p-error">LD Mounting Cost is required.</small>} -- className={classNames({ 'p-invalid': submitted && !state?.LDMountCost?.toString().trim().length }, "w-full")} */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-12 md:col-12 lg:col-12 p-0 flex'>
                                                <div className='col-6 md:col-6 lg:col-6 p-0'>
                                                    <div className='flex'>
                                                        <div className='col-12 md:col-4 lg:col-4'>
                                                            <label htmlFor="MiscCost1Desc" className="font-bold block my-2">
                                                                Misc Cost 1 Desc
                                                            </label>
                                                        </div>
                                                        <div className='col-12 md:col-8 lg:col-8'>
                                                            <InputText value={state?.MiscCost1Desc} onChange={(e) => handleChange(e)} id="MiscCost1Desc" name="MiscCost1Desc" disabled={isStatusActive} />
                                                            {/* {submitted && !state?.LDMountCost?.toString().trim().length && <small className="p-error">LD Mounting Cost is required.</small>} -- className={classNames({ 'p-invalid': submitted && !state?.MiscCost1Desc?.toString().trim().length }, "w-full")} */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-6 md:col-6 lg:col-6 p-0'>
                                                    <div className='flex'>
                                                        <div className='col-12 md:col-4 lg:col-4'>
                                                            <label htmlFor="MiscCost1" className="font-bold block my-2">
                                                                Misc Cost 1
                                                            </label>
                                                        </div>
                                                        <div className='col-12 md:col-8 lg:col-8'>
                                                            <InputNumber value={state?.MiscCost1} min={0} onChange={(e) => handleChangeNumber(e, "MiscCost1")} id="MiscCost1" name="MiscCost1" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            {/* {submitted && !state?.MiscCost1?.toString().trim().length && <small className="p-error">Misc Cost 1 is required.</small>} -- className={classNames({ 'p-invalid': submitted && !state?.MiscCost1?.toString().trim().length }, "w-full")} */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-12 md:col-12 lg:col-12 p-0 flex'>
                                                <div className='col-6 md:col-6 lg:col-6 p-0'>
                                                    <div className='flex'>
                                                        <div className='col-12 md:col-4 lg:col-4'>
                                                            <label htmlFor="MiscCost2Desc" className="font-bold block my-2">
                                                                Misc Cost 2 Desc
                                                            </label>
                                                        </div>
                                                        <div className='col-12 md:col-8 lg:col-8'>
                                                            <InputText value={state?.MiscCost2Desc} onChange={(e) => handleChange(e)} id="MiscCost2Desc" name="MiscCost2Desc" disabled={isStatusActive} />
                                                            {/* {submitted && !state?.MiscCost2Desc?.toString().trim().length && <small className="p-error">Misc Cost 2 Desc is required.</small>} -- className={classNames({ 'p-invalid': submitted && !state?.MiscCost2Desc?.toString().trim().length }, "w-full")} */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-6 md:col-6 lg:col-6 p-0'>
                                                    <div className='flex'>
                                                        <div className='col-12 md:col-4 lg:col-4'>
                                                            <label htmlFor="MiscCost2" className="font-bold block my-2">
                                                                Misc Cost 2
                                                            </label>
                                                        </div>
                                                        <div className='col-12 md:col-8 lg:col-8'>
                                                            <InputNumber value={state?.MiscCost2} min={0} onChange={(e) => handleChangeNumber(e, "MiscCost2")} id="MiscCost2" name="MiscCost2" minFractionDigits={2} maxFractionDigits={2} disabled={isStatusActive} />
                                                            {/* {submitted && !state?.MiscCost2?.toString().trim().length && <small className="p-error">Misc Cost 2 is required.</small>} -- className={classNames({ 'p-invalid': submitted && !state?.MiscCost2?.toString().trim().length }, "w-full")} */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fieldset>
                                    </div>
                                </div>

                                <div className='col-12 md:col-12 lg:col-12'>
                                    <Fieldset className="p-0 m-0">
                                        <div className='col-12 md:col-12 lg:col-12 flex'>
                                            <AutoComplete field="StoneCode" value={selectedStone} suggestions={filteredStoneData} className='stone-auto-complete'
                                                completeMethod={searchStoneData} onChange={(e) => handleStoneChange(e)} itemTemplate={stoneTemplate} panelFooterTemplate={stoneFooterTemplate} />
                                            {/* <Dropdown resetFilterOnHide={true} style={{ width: "350px", marginRight: "10px" }} value={selectedStone} options={allStoneData} panelFooterTemplate={panelFooterTemplate}
                                                onChange={(e) => handleStoneChange(e)} id="Stone" name="Stone" optionLabel="StoneCode"
                                                disabled={isStatusActive} showClear filter /> */}
                                            {/* filterBy="StoneCode,StoneCutTypeId.StoneCutTypeName,StoneQualityId.StoneQualityName,StoneShapeId.StoneShapeName,StoneSizeId.StoneSizeName,StoneTypeId.StoneTypeName" itemTemplate={stoneTemplate} filterMatchMode='startsWith'*/}
                                            <InputNumber className="text-right" min={0} style={{ width: "100px" }} value={selectedStoneQuantity} onChange={(e) => setSelectedStoneQuantity(e.value)} id="selectedStoneQuantity" name="selectedStoneQuantity" disabled={isStatusActive} />
                                            <Button className='ml-2' icon="pi pi-plus" onClick={() => addStone()} disabled={isStatusActive} />
                                        </div>
                                        <DataTable value={selectedStonesData} footerColumnGroup={footerGroup} showGridlines className='stone-table'>
                                            <Column body={currentProductOptionTemplate} headerStyle={{ width: '100px' }}></Column>
                                            <Column field="StoneCode" header="Stone Code" style={{ textAlign: 'center' }}></Column>
                                            <Column className="text-right" field="StQuantity" header="Pcs Per" editor={(options) => inputNumber(options)} onCellEditComplete={onRowEditComplete} cellEditValidator={onCellEditValidator}></Column>
                                            <Column className="text-right" field="WtEa" header="Wt Ea"></Column>
                                            <Column className="text-right" field="WtEaRd" header="Wt Ea/Rd"></Column>
                                            <Column className="text-right" field="WrEaRdTotal" header="Total Wt"></Column>
                                            <Column className="text-right" field="Pct" header="$/Pct" body={pctBodyTemplate}></Column>
                                            <Column className="text-right" field="FOBEa" header="$/FOB Ea" body={fobBodyTemplate}></Column>
                                            <Column className="text-right" field="LanEa" header="$/Lan Ea" body={lanBodyTemplate}></Column>
                                            <Column className="text-right" field="StoneCost" header="Stone Cost" body={stoneCostBodyTemplate}></Column>
                                        </DataTable>

                                        <div className='col-12 md:col-12 lg:col-12 text-right'>
                                            <div className='col-12 col-offset-8 md:col-4 lg:col-4 p-0'>
                                                <div className='flex'>
                                                    <div className='col-12 md:col-4 lg:col-4'>
                                                        <label htmlFor="MiscCost2" className="font-bold block my-2">
                                                            Total Stone Cost
                                                        </label>
                                                    </div>
                                                    <div className='col-12 md:col-8 lg:col-8'>
                                                        <InputNumber value={state?.TotalStoneCost} id="TotalStoneCost" name="TotalStoneCost" mode="currency" currency="USD" locale="en-US" disabled />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-offset-8 md:col-4 lg:col-4 p-0'>
                                                <div className='flex'>
                                                    <div className='col-12 md:col-4 lg:col-4'>
                                                        <label htmlFor="MiscCost2" className="font-bold block my-2 total-label">
                                                            Total Unit Cost
                                                        </label>
                                                    </div>
                                                    <div className='col-12 md:col-8 lg:col-8'>
                                                        <InputNumber className='total-input' value={state?.TotalCost} id="TotalCost" name="TotalCost" mode="currency" currency="USD" locale="en-US" disabled />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Fieldset>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="Extra Info" leftIcon="pi pi-info-circle mr-2">
                            <div className="p-fluid grid p-3">
                                <div className='col-12 md:col-4 lg:col-4'>
                                    <Fieldset className="p-0 m-0">
                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="Description" className="font-bold block my-2">
                                                        Description
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputTextarea rows={5} value={state?.Description} onChange={(e) => handleChange(e)} id="Description" name="Description" disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="BagComments" className="font-bold block my-2">
                                                        Bag Comments
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputTextarea rows={5} value={state?.BagComments} onChange={(e) => handleChange(e)} id="BagComments" name="BagComments" disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>
                                    </Fieldset>

                                    <Fieldset className="p-0 m-0 mt-2">
                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="BaseMetal" className="font-bold block my-2">
                                                        Base Metal
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.BaseMetal} options={refactorAllBaseMetal} onChange={handleDropdownChange} id="BaseMetal" name="BaseMetal" optionLabel="Title" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="BaseMetal" className="font-bold block my-2">
                                                        Base Stone
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.BaseStone} options={refactorAllBaseStone} onChange={handleDropdownChange} id="BaseStone" name="BaseStone" optionLabel="Title" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="BaseMetal" className="font-bold block my-2">
                                                        Parentage
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.Parentage} options={refactorAllParentage} onChange={handleDropdownChange} id="Parentage" name="Parentage" optionLabel="Title" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="VIPSKU" className="font-bold block my-2">
                                                        VIP SKU
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <div className='flex flex-wrap gap-3 mt-1'>
                                                        <div className="flex align-items-center">
                                                            <RadioButton inputId="VIPSKU1" name="VIPSKU" value={true} onChange={(e) => handleChange(e)} checked={state?.VIPSKU === true} />
                                                            <label htmlFor="VIPSKU1" className="ml-2">Yes</label>
                                                        </div>
                                                        <div className="flex align-items-center">
                                                            <RadioButton inputId="VIPSKU2" name="VIPSKU" value={false} onChange={(e) => handleChange(e)} checked={state?.VIPSKU === false} />
                                                            <label htmlFor="VIPSKU2" className="ml-2">No</label>
                                                        </div>
                                                    </div>
                                                    {/* <InputSwitch checked={state?.VIPSKU} onChange={(e) => handleChange(e)} id="VIPSKU" name="VIPSKU" disabled={isStatusActive} /> */}
                                                </div>
                                            </div>
                                        </div>

                                    </Fieldset>

                                    <Fieldset className="p-0 m-0 mt-2">
                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="BoxType" className="font-bold block my-2">
                                                        Box Type
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.BoxType} options={refactorAllBoxType} onChange={handleDropdownChange} id="BoxType" name="BoxType" optionLabel="Title" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="InsertType" className="font-bold block my-2">
                                                        Insert Type
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.InsertType} options={refactorAllInsertType} onChange={handleDropdownChange} id="InsertType" name="InsertType" optionLabel="Title" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="BaseMetal" className="font-bold block my-2">
                                                        Chain Type
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.ChainType} options={refactorAllChainType} onChange={handleDropdownChange} id="ChainType" name="ChainType" optionLabel="Title" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>


                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="BackingType" className="font-bold block my-2">
                                                        Backing Type
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.BackingType} options={refactorAllBackingType} onChange={handleDropdownChange} id="BackingType" name="BackingType" optionLabel="Title" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>
                                    </Fieldset>
                                </div>

                                <div className='col-12 md:col-4 lg:col-4'>
                                    <Fieldset className="p-0 m-0">
                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="Gender" className="font-bold block my-2">
                                                        Gender
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.Gender} options={genders} onChange={handleChange} id="Gender" name="Gender" optionLabel="code" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="SubCategory" className="font-bold block my-2">
                                                        Sub Category
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.Subcategory} options={refactorProductSubCategoryData} onChange={handleDropdownChange} id="Subcategory" name="Subcategory" optionLabel="SubCatName" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="vendor2" className="font-bold block my-2">
                                                        Vendor 2
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <Dropdown resetFilterOnHide={true} value={state?.Vendor2} options={refactorAllVendorData} onChange={handleDropdownChange} id="Vendor2" name="Vendor2" optionLabel="VendorName" showClear filter disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="VendorRef2" className="font-bold block my-2">
                                                        Ven Ref 2
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8'>
                                                    <InputText value={state?.VendorRef2} onChange={(e) => handleChange(e)} id="VendorRef2" name="VendorRef2" disabled={isStatusActive} />
                                                </div>
                                            </div>
                                        </div>

                                    </Fieldset>

                                    <Fieldset className="p-0 m-0 mt-2">
                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="Retired" className="font-bold block my-2">
                                                        Retired
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8 p-0'>
                                                    <div className='col-12 md:col-12 lg:col-12'>
                                                        <div className='flex flex-wrap gap-3 mt-1'>
                                                            <div className="flex align-items-center">
                                                                <RadioButton inputId="Retired1" name="Retired" value={true} onChange={(e) => handleChange(e)} checked={state?.Retired === true} />
                                                                <label htmlFor="Retired1" className="ml-2">Yes</label>
                                                            </div>
                                                            <div className="flex align-items-center">
                                                                <RadioButton inputId="Retired2" name="Retired" value={false} onChange={(e) => handleChange(e)} checked={state?.Retired === false} />
                                                                <label htmlFor="Retired2" className="ml-2">No</label>
                                                            </div>
                                                        </div>
                                                        {/* <InputSwitch checked={state?.Retired} onChange={(e) => handleChange(e)} id="Retired" name="Retired" className='mr-1' disabled={isStatusActive} /> */}
                                                    </div>
                                                    {state?.Retired &&
                                                        <div className='col-12 md:col-12 lg:col-12'>
                                                            <Calendar value={state?.RetiredDate} onChange={(e) => handleChange(e)} id="RetiredDate" name="RetiredDate" showIcon disabled={isStatusActive} />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                                            <div className='flex'>
                                                <div className='col-12 md:col-4 lg:col-4'>
                                                    <label htmlFor="Retired" className="font-bold block my-2">
                                                        Watch List
                                                    </label>
                                                </div>
                                                <div className='col-12 md:col-8 lg:col-8 p-0'>
                                                    <div className='col-12 md:col-12 lg:col-12'>
                                                        <div className='flex flex-wrap gap-3 mt-1'>
                                                            <div className="flex align-items-center">
                                                                <RadioButton inputId="WatchList1" name="WatchList" value={true} onChange={(e) => handleChange(e)} checked={state?.WatchList === true} />
                                                                <label htmlFor="WatchList1" className="ml-2">Yes</label>
                                                            </div>
                                                            <div className="flex align-items-center">
                                                                <RadioButton inputId="WatchList2" name="WatchList" value={false} onChange={(e) => handleChange(e)} checked={state?.WatchList === false} />
                                                                <label htmlFor="WatchList2" className="ml-2">No</label>
                                                            </div>
                                                        </div>
                                                        {/* <InputSwitch checked={state?.WatchList} onChange={(e) => handleChange(e)} id="WatchList" name="WatchList" className='mr-1' disabled={isStatusActive} /> */}
                                                    </div>
                                                    {state?.WatchList &&
                                                        <div className='col-12 md:col-12 lg:col-12'>
                                                            <Calendar value={state?.WatchListDate} onChange={(e) => handleChange(e)} id="WatchListDate" name="WatchListDate" showIcon disabled={isStatusActive} />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Fieldset>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="Charts" leftIcon="pi pi-chart-bar mr-2">
                            <div className="p-fluid grid p-3"></div>
                        </TabPanel>
                        <TabPanel header="Order History" leftIcon="pi pi-history mr-2">
                            <div className="p-fluid grid p-3">
                            </div>
                        </TabPanel>
                    </TabView>
                </Card>
                <Dialog visible={isCopyDialog} style={{ width: '450px' }} footer={copyFooterComponent} header="Confirm" modal onHide={onHideCopyDialog}>
                    <div className='p-fluid grid'>
                        <div className='col-12 md:col-12 lg:col-12 p-0'>
                            <div className='flex'>
                                <div className='col-12 md:col-4 lg:col-4'>
                                    <label htmlFor="VendorRef2" className="font-bold block my-2">
                                        New SKU<span className="required" hidden={isStatusActive}> *</span>
                                    </label>
                                </div>
                                <div className='col-12 md:col-8 lg:col-8'>
                                    <InputText value={newSKU.NewSku} onChange={(e) => copyHandleChange(e)} id="NewSku" name="NewSku" disabled={isStatusActive} />
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='col-12 md:col-4 lg:col-4'>
                                    <label htmlFor="VendorRef2" className="font-bold block my-2">
                                        MFN SKU<span className="required" hidden={isStatusActive}> *</span>
                                    </label>
                                </div>
                                <div className='col-12 md:col-8 lg:col-8'>
                                    <InputText value={newSKU?.NewMFNSKU} onChange={(e) => copyHandleChange(e)} id="NewMFNSKU" name="NewMFNSKU" disabled={isStatusActive} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={isPrintDialog} style={{ width: '45.5%' }} footer={printFooterComponent} header="Print SKUs" modal onHide={() => setIsPrintDialog(false)}>
                    <div className='p-fluid grid'>
                        <div className='col-12 md:col-12 lg:col-12'>
                            <label htmlFor="SelectSKU" className="font-bold block my-2">
                                Select SKUs<span className="required"> *</span>
                            </label>
                            <AutoComplete
                                className={classNames({ 'p-invalid': isPrintValidation && selectedSKUData.length <= 0 })}
                                field="Title"
                                multiple
                                value={selectedSKUData}
                                suggestions={filteredSKUData}
                                completeMethod={searchSKUData}
                                onChange={(e) => handlePrintSKUChange(e)}
                                itemTemplate={skuTemplate}
                                panelFooterTemplate={skuFooterTemplate}
                            />
                            {isPrintValidation && selectedSKUData.length <= 0 && <small className="p-error">Please select at least one SKU.</small>}
                        </div>
                    </div>
                </Dialog>

                {/* Import/Export dialogs */}
                <Dialog header="Product Fields" visible={importVisible} style={{ width: '54vw' }} onHide={() => setImportVisible(false)} footer={importFooterContent}>
                    <div className="col-12 md:col-12 lg:col-12">
                        <p>Select fields to generate csv for import</p>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12">
                        <Checkbox inputId="AllProductFields" name="AllProductFields" value="AllProductFields" onChange={(e) => onAllProductFieldChange(e)} checked={allProductFieldChecked} />
                        <label htmlFor="AllProductFields" className="ml-2">All</label>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12">
                        <div className='flex flex-wrap justify-content-start gap-2 row-gap-2'>
                            {PRODUCT_FIELDS_DATA.map((item) => {
                                return (item !== "ModifiedDate" &&
                                    <div key={item} className="flex align-items-center w-9rem">
                                        <Checkbox inputId={item} name="product-field-list" value={item} onChange={(e) => onSelectProductFieldChange(e)} checked={selectedProductFieldsForImportExport.some((x) => x === item)} />
                                        <label htmlFor={item} className="ml-2">{item}</label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Product Fields" visible={exportVisible} style={{ width: '54vw' }} onHide={() => setExportVisible(false)} footer={exportFooterContent}>
                    <div className="col-12 md:col-12 lg:col-12">
                        <p>Select fields to generate csv for export</p>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12">
                        <Checkbox inputId="AllProductFields" name="AllProductFields" value="AllProductFields" onChange={(e) => onAllProductFieldChange(e, true)} checked={allProductFieldChecked} />
                        <label htmlFor="AllProductFields" className="ml-2">All</label>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12">
                        <div className='flex flex-wrap justify-content-start gap-2 row-gap-2'>
                            {PRODUCT_FIELDS_DATA.map((item) => {
                                return (
                                    <div key={item} className="flex align-items-center w-9rem">
                                        <Checkbox inputId={item} name="product-field-list" value={item} onChange={(e) => onSelectProductFieldChange(e, true)} checked={selectedProductFieldsForImportExport.some((x) => x === item)} />
                                        <label htmlFor={item} className="ml-2">{item}</label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Upload Product CSV" visible={isUploadCSVisible} style={{ width: '54vw' }} onHide={() => setIsUploadCSVisible(false)}>
                    <div className="col-12 text-right">
                        <Button label={"Generate CSV File for upload data."} icon="pi pi-database" tooltip={"Import"} onClick={() => { onClickGenerateCSVFile() }} data-pr-position="bottom" />
                    </div>
                    <div className="col-12">
                        <FileUpload name="UploadProductDataCSV" onUpload={(e) => onProductDataCSVFileUpload(e.files)} url="/" />
                        <small className="p-error">Note: Please import maximum 500 products at a time.</small>
                    </div>
                </Dialog>
            </div>
            {isPrintVisible &&
                <div ref={printRef}>
                    {selectedSKUData.map((item) => {
                        return (
                            <>
                                <PrintData productData={[item]}></PrintData>
                                <div className="page-break" />
                            </>
                        );
                    })}
                </div>
            }
        </div>
    );
}

export default Product
