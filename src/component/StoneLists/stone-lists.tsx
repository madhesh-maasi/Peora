import * as React from 'react';
import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, InputText, Dropdown, Toast, BlockUI, Fieldset, Card, classNames, InputNumber, Checkbox, Calendar, ListBox, Dialog, FileUpload } from "../../common/primereactComponents";
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import { StoneListInitialState } from '../../models/StoneList';
import { PeoraContext } from '../../contexts/PeoraContext';
import { addItemToSPList, updateItemToSPList, updateSingleFieldValueToSPList } from '../../services/SPServices';
import { LISTS, STONE_FIELDS_DATA } from '../../common/constants';
import { CSVLink } from "react-csv";
import Papa from "papaparse";

import { SPFI } from "@pnp/sp";
import { IList } from '@pnp/sp/lists';
import { getSP } from '../../services/pnpConfig';
import { createBatch } from "@pnp/sp/batching";


const StoneListsView = () => {
    const stoneInitialState = new StoneListInitialState();
    const toast = useRef(null);
    const csvLink = useRef(null);
    const searchBoxRef = useRef(null);
    const stoneDetailsSectionHeightRef = useRef(null);
    const navigate = useNavigate();

    const { allStoneData,
        setAllStoneData,
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
        masterDataRoute,
        setMasterDataRoute,
        getAllStones,
        getAllStoneTypeData,
        getAllStoneShapeData,
        getAllStoneSizeData,
        getAllStoneCutTypeData,
        getAllStoneQualityData,
        getAllVendorData } = useContext(PeoraContext);

    //UseStates
    const [stoneDetailsSectionHeight, setStoneDetailsSectionHeight] = useState(0);
    const [blocked, setBlocked] = useState(false);
    const [state, setState] = useState(stoneInitialState);

    const [stoneRowData, setStoneRowData] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [stoneExist, setStoneExist] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    let [isStatusActive, setIsStatusActive] = useState(false);

    //Filter Stone Data
    const [filterStoneInputValue, setFilterStoneInputValue] = useState(null);
    const [filteredStoneData, setFilteredStoneData] = useState(allStoneData);

    //Dialogs
    const [visible, setVisible] = useState(false);
    let [selectedStones, setSelectedStones] = useState([STONE_FIELDS_DATA[0]]);
    const [csvArray, setCsvArray] = useState([]);
    const [isUploadCSVisible, setIsUploadCSVisible] = useState(false);
    const [exportVisible, setExportVisible] = useState(false);
    const [allStoneFieldChecked, setAllStoneFieldChecked] = useState(false);


    // sort all stone data
    filteredStoneData.sort((a, b) => {
        if (a.StoneCode < b.StoneCode) {
            return -1;
        }
        if (a.StoneCode > b.StoneCode) {
            return 1;
        }
        return 0;
    });

    useEffect(() => {
        setBlocked(true);
        setStoneDetailsSectionHeight(stoneDetailsSectionHeightRef.current.clientHeight + 113);
        if (masterDataRoute === "/master-data") {
            getAllStones();
            getAllStoneTypeData();
            getAllStoneShapeData();
            getAllStoneSizeData();
            getAllStoneCutTypeData();
            getAllStoneQualityData();
            getAllVendorData();
            setMasterDataRoute(null);
        }
        setBlocked(false);
    }, []);

    useEffect(() => {
        setFilteredStoneData(allStoneData);
        if (allStoneData && allStoneData.length > 0) {
            const allFields = Object.keys(allStoneData[0]);
        };
    }, [allStoneData]);

    //Handle Change
    const handleChange = (e) => {
        setStoneExist(false);
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const handleDropdownChange = (e) => {
        setStoneExist(false);
        if (e.value) {
            setState({
                ...state,
                [e.target.name]: e.value,
                [e.target.name + "Id"]: e.value.Id
            });
        }
        else {
            setState({
                ...state,
                [e.target.name]: null,
                [e.target.name + "Id"]: undefined
            });
        }
    };

    const onStoneHandleChange = (e) => {
        const stoneDetail = e.value;
        if (stoneDetail) {
            Object.keys(state).forEach((key) => {
                if (key === "Modified") {
                    state[key] = stoneDetail[key] ? new Date(stoneDetail[key]) : null;
                }
                else {
                    state[key] = stoneDetail[key];
                }
            });
            if (state?.Inactive) {
                setIsReadOnly(true);
            }
            else {
                setIsReadOnly(false);
            }
            setIsStatusActive(state?.Inactive);
            setState({ ...state });
        }
        else {
            setIsStatusActive(false);
            setState(stoneInitialState);
            setIsReadOnly(false);
        }
        setSubmitted(false);
        setStoneExist(false);
        setStoneRowData(stoneDetail);
    };

    const handleWtEaChange = (e) => {
        setStoneExist(false);
        const { name, value } = e.target;
        state.FOBEa = value && state.Pct ? parseFloat((parseFloat(value.toFixed(3)) * state.Pct).toFixed(3)) : null;
        setState({
            ...state,
            [name]: value
        });
    };

    const handlePctChange = (e) => {
        setStoneExist(false);
        const { name, value } = e.target;
        state.FOBEa = value && state.WtEa ? parseFloat((parseFloat(state.WtEa.toFixed(3)) * value).toFixed(3)) : null;
        setState({
            ...state,
            [name]: value
        });
    };

    const handleAddNewStone = () => {
        setSubmitted(false);
        setIsStatusActive(false);
        setState(stoneInitialState);
        setStoneExist(false);
        setIsReadOnly(false);
        setStoneRowData(null);
    };

    const handleStoneSubmit = async () => {
        setSubmitted(false);
        let isStoneExist = allStoneData.find((ele) => ele?.Id !== state?.Id && ele?.StoneCode?.trim().toLowerCase() === state.StoneCode?.trim().toLowerCase());
        if (isStoneExist || !state?.StoneCode?.trim().length || !state?.StoneTypeIdId || !state?.StoneShapeIdId || !state?.StoneSizeIdId || !state?.StoneCutTypeIdId || !state?.StoneQualityIdId || !state?.LanEa) {
            setSubmitted(true);
            isStoneExist ? setStoneExist(true) : setStoneExist(false);
            setBlocked(false);
            showErrorToast("Please fill all the required(*) fields.");
        }
        else {
            setBlocked(true);
            state.Modified = new Date();
            let saveState = { ...state };
            delete saveState.StoneTypeId;
            delete saveState.StoneShapeId;
            delete saveState.StoneSizeId;
            delete saveState.StoneCutTypeId;
            delete saveState.StoneQualityId;
            delete saveState.VendorId1;
            delete saveState.VendorId2;
            delete saveState.Modified;
            if (!saveState.Id) {
                await addItemToSPList(LISTS.STONE_LISTS.NAME, saveState)
                    .then((res) => {
                        state.Id = res.data.Id;
                        setStoneRowData(state);
                        allStoneData.push(state);
                        setAllStoneData(allStoneData);
                        setFilteredStoneData(allStoneData);
                        setFilterStoneInputValue(null);
                        searchBoxRef.current.value = '';
                        setState({ ...state });
                        setStoneExist(false);
                        setBlocked(false);
                        showSuccessToast("Stone data saved successfully!");
                    })
                    .catch((err) => {
                        showErrorToast(err);
                        setBlocked(false);
                    });
            } else {
                await updateItemToSPList(LISTS.STONE_LISTS.NAME, saveState)
                    .then((res) => {
                        const updateStoneData = allStoneData.map((ele) => {
                            if (ele?.Id === state?.Id) {
                                setStoneRowData(state);
                                return state;
                            }
                            else {
                                return ele;
                            }
                        });
                        setAllStoneData(updateStoneData);
                        setFilteredStoneData(updateStoneData);
                        setFilterStoneInputValue(null);
                        searchBoxRef.current.value = '';
                        setState({ ...state });
                        setStoneExist(false);
                        setBlocked(false);
                        showSuccessToast("Stone data saved successfully!");
                    }).catch((err) => {
                        showErrorToast(err);
                        setBlocked(false);
                    });
            }
        }
    };

    const onStatusChange = (e) => {
        setSubmitted(false);
        setBlocked(true);
        isStatusActive = e.checked;
        setIsStatusActive(e.checked);
        if (state?.Id) {
            updateSingleFieldValueToSPList(LISTS.STONE_LISTS.NAME, state?.Id, "Inactive", isStatusActive).then((res) => {
                setBlocked(false);
                setState({
                    ...state,
                    Inactive: isStatusActive
                });
                const updateStoneData = allStoneData.map(({ Inactive, ...stoneEle }) => ({
                    ...stoneEle,
                    Inactive: stoneEle?.Id === state?.Id ? isStatusActive : Inactive
                }));
                setAllStoneData(updateStoneData);
                setFilteredStoneData(updateStoneData);
                setFilterStoneInputValue(null);
                searchBoxRef.current.value = '';
                setStoneExist(false);
                setIsReadOnly(isStatusActive);
                if (isStatusActive) {
                    showSuccessToast("Stone has been inactivated successfully!");
                }
                else {
                    showSuccessToast("Stone has been activated successfully!");
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
            setIsReadOnly(isStatusActive);
        }
    };

    const stoneListHeader = (
        <div className='flex justify-content-between align-items-center'>
            <h2 className='mx-2'>Stones</h2>
            <div className='flex justify-content-end align-items-center'>
                {state?.Id &&
                    <div className='flex align-items-center mr-2'>
                        <Checkbox onChange={(e) => onStatusChange(e)} checked={isStatusActive}></Checkbox>
                        <label htmlFor="Inactive" className="ml-2">Inactive</label>
                    </div>
                }
                <div className='mr-2'>
                    <Button label={"New"} icon="pi pi-plus" tooltip={"New"} onClick={handleAddNewStone} data-pr-position="bottom" />
                </div>
                <div className='mr-2'>
                    <Button label={"Save"} icon="pi pi-save" tooltip={"Save"} onClick={() => { handleStoneSubmit() }} data-pr-position="bottom" disabled={isReadOnly} />
                </div>
                <div className='mr-2'>
                    <Button label={"Import"} icon="pi pi-database" tooltip={"Import"} onClick={() => { setIsUploadCSVisible(true) }} data-pr-position="bottom" />
                </div>
                <div className='mr-2'>
                    <Button label={"Export"} icon="pi pi-database" tooltip={"Export"} onClick={() => { onClickExportCSVFile() }} data-pr-position="bottom" />
                </div>
                <div className='mr-2'>
                    <Button label={"Go Back"} tooltip={"Go Back"} onClick={() => navigate('/')} icon="pi pi-home" data-pr-position="bottom" />
                </div>
            </div>
        </div>
    );

    const showSuccessToast = (message) => {
        toast.current.show({ severity: 'success', summary: "Success Message", detail: message, life: 3000 });
    };

    const showErrorToast = (message) => {
        toast.current.show({ severity: 'error', summary: "Error Message", detail: message, life: 3000 });
    };

    const allStoneFilterTemplate = () => {
        return (
            <div className="col-12 md:col-12 lg:col-12 p-0">
                <span className="p-input-icon-left">
                    <i className="pi pi-search search-icon" />
                    <InputText ref={searchBoxRef} className="w-full" type="search" value={filterStoneInputValue} onChange={(e) => searchStoneData(e)} />
                </span>
            </div>
        );
    };

    const searchStoneData = (event) => {
        setFilterStoneInputValue(event.target?.value);
        const inputItems = event.target?.value?.split(' ');
        setTimeout(() => {
            let _filteredStoneData;

            if (!event.target?.value?.trim().length) {
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

            setFilteredStoneData(_filteredStoneData);
        }, 250);
    };

    const footerContent = (
        <div>
            <Button label="Cancel" icon="pi pi-times-circle" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Download CSV" icon="pi pi-file-excel" onClick={() => downloadCSV()} autoFocus />
            <CSVLink data={[selectedStones]} target="_blank" className='hidden' filename='Stone.csv' ref={csvLink} />
        </div>
    );

    const exportFooterContent = (
        <div>
            <Button label="Cancel" icon="pi pi-times-circle" onClick={() => setExportVisible(false)} className="p-button-text" />
            <Button label="Export Data" icon="pi pi-file-excel" onClick={() => downloadCSVWithData()} autoFocus />
        </div>
    );

    const downloadCSV = () => {
        csvLink.current.link.click();
        setSelectedStones([STONE_FIELDS_DATA[0]]);
        setVisible(false);
    }

    const exportData = (data, fileName, type) => {
        // Create a link and download the file
        const blob = new Blob([data], { type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const downloadCSVWithData = async () => {
        const csvData = Papa.unparse(await preparedData());
        await exportData(csvData, 'ExportedStoneData_' + Date.now() + '.csv', 'text/csv;charset=utf-8;');
        setExportVisible(false);
        setSelectedStones([STONE_FIELDS_DATA[0]]);
        showSuccessToast("Stone data exported successfully.");
    };

    const preparedData = () => {
        const preparedArray = [];
        for (const item of allStoneData) {
            const newData = {};
            for (const stone of selectedStones) {

                if (stone === "StoneTypeId") {
                    newData[stone] = item[stone]?.StoneTypeName;
                }

                else if (stone === "StoneSizeId") {
                    newData[stone] = item[stone]?.StoneSizeName;
                }

                else if (stone === "StoneShapeId") {
                    newData[stone] = item[stone]?.StoneShapeName;
                }

                else if (stone === "StoneCutTypeId") {
                    newData[stone] = item[stone]?.StoneCutTypeName;
                }

                else if (stone === "StoneQualityId") {
                    newData[stone] = item[stone]?.StoneQualityName;
                }

                else if (stone === "VendorId1") {
                    newData[stone] = item[stone]?.VendorName;
                }

                else if (stone === "VendorId2") {
                    newData[stone] = item[stone]?.VendorName;
                }

                else {
                    newData[stone] = item[stone];
                }
            }
            preparedArray.push(newData);
        }

        return preparedArray;
    };

    const onAllStoneFieldChange = (e) => {
        if (e.checked) {
            setSelectedStones(STONE_FIELDS_DATA);
            setAllStoneFieldChecked(true);
        }
        else {
            setSelectedStones([STONE_FIELDS_DATA[0]]);
            setAllStoneFieldChecked(false);
        }
    };

    const onCategoryChange = (e) => {
        let _selectedStones = [...selectedStones];

        if (e.checked)
            _selectedStones.push(e.value);
        else
            _selectedStones = _selectedStones.filter(item => item !== e.value);

        setSelectedStones(_selectedStones);
    };

    const onStoneDataCSVFileUpload = async (csvFile) => {
        const file = csvFile[0];
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                if (results?.data?.length <= 500) {
                    setCsvArray(results?.data);
                    uploadDataToList(results?.data);
                }
                else {
                    showErrorToast("Please import maximum 500 stones at a time.");
                }
            },
        });
    };

    const uploadDataToList = (resultData) => {

        setBlocked(true);
        const preparedStoneDataToAdd = [];
        const preparedStoneDataToUpdate = [];

        const uploadData = [...resultData];

        for (const item of uploadData) {
            const itemData = { ...item };

            if (item.StoneCode) {
                if (item.StoneTypeId) {
                    const filteredStoneType = refactorStoneTypeData.filter(x => x.StoneTypeName === item.StoneTypeId);
                    if (filteredStoneType && filteredStoneType.length > 0) {
                        itemData.StoneTypeIdId = filteredStoneType[0].Id
                    }
                }

                if (item.StoneShapeId) {
                    const filteredStoneShape = refactorStoneShapeData.filter(x => x.StoneShapeName === item.StoneShapeId);
                    if (filteredStoneShape && filteredStoneShape.length > 0) {
                        itemData.StoneShapeIdId = filteredStoneShape[0].Id
                    }
                }

                if (item.StoneSizeId) {
                    const filteredStoneSize = refactorStoneSizeData.filter(x => x.StoneSizeName === item.StoneSizeId);
                    if (filteredStoneSize && filteredStoneSize.length > 0) {
                        itemData.StoneSizeIdId = filteredStoneSize[0].Id
                    }
                }

                if (item.StoneCutTypeId) {
                    const filteredStoneCutType = refactorStoneCutTypeData.filter(x => x.StoneCutTypeName === item.StoneCutTypeId);
                    if (filteredStoneCutType && filteredStoneCutType.length > 0) {
                        itemData.StoneCutTypeIdId = filteredStoneCutType[0].Id
                    }
                }

                if (item.StoneQualityId) {
                    const filteredStoneQuality = refactorStoneQualityData.filter(x => x.StoneQualityName === item.StoneQualityId);
                    if (filteredStoneQuality && filteredStoneQuality.length > 0) {
                        itemData.StoneQualityIdId = filteredStoneQuality[0].Id
                    }
                }

                if (item.VendorId1) {
                    const filteredVendor = refactorAllVendorData.filter(x => x.VendorName === item.VendorId1);
                    if (filteredVendor && filteredVendor.length > 0) {
                        itemData.VendorId1Id = filteredVendor[0].Id
                    }
                }

                if (item.VendorId2) {
                    const filteredVendor = refactorAllVendorData.filter(x => x.VendorName === item.VendorId2);
                    if (filteredVendor && filteredVendor.length > 0) {
                        itemData.VendorId2Id = filteredVendor[0].Id
                    }
                }

                if (!item.Inactive || item.Inactive == "" || item.Inactive == undefined) {
                    delete itemData.Inactive
                }

                if (item.Pct == "" || item.Pct == undefined) {
                    delete itemData.Pct
                }

                if (item.WtEa == "" || item.WtEa == undefined) {
                    delete itemData.WtEa
                }

                if (item.WtEaRd == "" || item.WtEaRd == undefined) {
                    delete itemData.WtEaRd
                }

                if (item.FOBEa == "" || item.FOBEa == undefined) {
                    delete itemData.FOBEa
                }

                if (item.LanEa == "" || item.LanEa == undefined) {
                    delete itemData.LanEa
                }

                delete itemData.StoneTypeId;
                delete itemData.StoneShapeId;
                delete itemData.StoneSizeId;
                delete itemData.StoneCutTypeId;
                delete itemData.StoneQualityId;
                delete itemData.VendorId1;
                delete itemData.VendorId2;

                const ifStoneData = allStoneData.filter(x => x.StoneCode === item.StoneCode);
                if (ifStoneData && ifStoneData.length > 0) {
                    itemData.Id = ifStoneData[0].Id;
                    preparedStoneDataToUpdate.push(itemData);
                }
                else {
                    preparedStoneDataToAdd.push(itemData);
                }
            }
        }

        if (preparedStoneDataToUpdate.length > 0) {
            updateBulkStonesItem(preparedStoneDataToUpdate, preparedStoneDataToUpdate.length >= preparedStoneDataToAdd.length ? true : false);
        }

        if (preparedStoneDataToAdd.length > 0) {
            addBulkStonesItem(preparedStoneDataToAdd, preparedStoneDataToAdd.length >= preparedStoneDataToUpdate.length ? true : false);
        }

        if (preparedStoneDataToUpdate.length == 0 && preparedStoneDataToAdd.length == 0) {
            setBlocked(false);
            setIsUploadCSVisible(false);
        }
    };

    const addBulkStonesItem = async (arrayItem, isBlockUIFalse) => {
        const sp: SPFI = getSP();
        const list: IList = sp.web.lists.getByTitle(LISTS.STONE_LISTS.NAME);

        const [batchedListBehavior, execute] = createBatch(list);
        list.using(batchedListBehavior);

        for (const item of arrayItem) {
            list.items.add(item);
        }

        try {
            await execute();
            showSuccessToast(arrayItem.length + " Item added successfully");
            await getAllStones();
            if (isBlockUIFalse) {
                setBlocked(false);
                setIsUploadCSVisible(false);
            }
        }
        catch (error) {
            console.log("error......", error);
            showErrorToast("Error in stone add!");
            setBlocked(false);
            setIsUploadCSVisible(false);
        };
    };

    const updateBulkStonesItem = async (arrayItem, isBlockUIFalse) => {
        const sp: SPFI = getSP();
        const list: IList = sp.web.lists.getByTitle(LISTS.STONE_LISTS.NAME);

        const [batchedListBehavior, execute] = createBatch(list);
        list.using(batchedListBehavior);

        for (const item of arrayItem) {
            list.items.getById(item.Id).update(item);
        }

        try {
            await execute();
            showSuccessToast(arrayItem.length + " Item updated successfully");
            await getAllStones();
            if (isBlockUIFalse) {
                setBlocked(false);
                setIsUploadCSVisible(false);
            }
        }
        catch (error) {
            console.log("error......", error);
            showErrorToast("Error in stone update!");
            setBlocked(false);
            setIsUploadCSVisible(false);
        };
    };

    const onClickGenerateCSVFile = () => {
        setVisible(true);
        setSelectedStones([STONE_FIELDS_DATA[0]]);
        setAllStoneFieldChecked(false);
    };

    const onClickExportCSVFile = () => {
        setExportVisible(true);
        setSelectedStones([STONE_FIELDS_DATA[0]]);
        setAllStoneFieldChecked(false);

    };

    return (
        <div className="p-fluid grid">
            <BlockUI blocked={blocked} fullScreen template={<CustomSpinner />} />
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-2 lg:col-2">
                <ListBox filterTemplate={allStoneFilterTemplate} className="w-full" filter value={stoneRowData} onChange={(e) => onStoneHandleChange(e)} options={filteredStoneData} optionLabel="StoneCode" filterPlaceholder="" emptyFilterMessage="Stone not available." listStyle={{ height: `${stoneDetailsSectionHeight - 63}px`, overflow: 'auto' }} style={{ height: `${stoneDetailsSectionHeight}px` }} />
            </div>
            <div className="col-12 md:col-10 lg:col-10">
                <Card ref={stoneDetailsSectionHeightRef} header={stoneListHeader}>
                    <div className="p-fluid grid p-0">
                        <div className='col-12 md:col-6 lg:col-6'>
                            <Fieldset className="p-0 m-0">
                                <div className='col-12 md:col-12 lg:col-12 p-0'>
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="StoneCode" className="font-bold block my-2">
                                                Stone Code {!isReadOnly && <span className="required"> *</span>}
                                            </label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <InputText value={state?.StoneCode} onChange={(e) => handleChange(e)} id="StoneCode" name="StoneCode" className={classNames({ 'p-invalid': submitted && !state?.StoneCode?.trim().length }, "w-full")} disabled={isReadOnly} />
                                            {submitted && !state?.StoneCode?.trim().length && <small className="p-error">Stone code is required.</small>}
                                            {stoneExist && state?.StoneCode?.trim().length && <small className="p-error">Stone already exists.</small>}
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12 md:col-12 lg:col-12 p-0'>
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="StoneTypeName" className="font-bold block my-2">
                                                Stone Type {!isReadOnly && <span className="required"> *</span>}
                                            </label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <Dropdown value={state?.StoneTypeId} options={refactorStoneTypeData} onChange={(e) => handleDropdownChange(e)} name="StoneTypeId" optionLabel="StoneTypeName" className={classNames({ 'p-invalid': submitted && !state?.StoneTypeIdId }, "w-full")} resetFilterOnHide={true} showClear filter disabled={isReadOnly} />
                                            {submitted && !state?.StoneTypeIdId && <small className="p-error">Stone type is required.</small>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="StoneShapeName" className="font-bold block my-2">
                                                Stone Shape {!isReadOnly && <span className="required"> *</span>}
                                            </label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <Dropdown value={state?.StoneShapeId} options={refactorStoneShapeData} onChange={(e) => handleDropdownChange(e)} name="StoneShapeId" optionLabel="StoneShapeName" className={classNames({ 'p-invalid': submitted && !state?.StoneShapeIdId }, "w-full")} resetFilterOnHide={true} showClear filter disabled={isReadOnly} />
                                            {submitted && !state?.StoneShapeIdId && <small className="p-error">Stone shape is required.</small>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="StoneSizeName" className="font-bold block my-2">
                                                Stone Size {!isReadOnly && <span className="required"> *</span>}
                                            </label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <Dropdown value={state?.StoneSizeId} options={refactorStoneSizeData} onChange={(e) => handleDropdownChange(e)} name="StoneSizeId" optionLabel="StoneSizeName" className={classNames({ 'p-invalid': submitted && !state?.StoneSizeIdId }, "w-full")} resetFilterOnHide={true} showClear filter disabled={isReadOnly} />
                                            {submitted && !state?.StoneSizeIdId && <small className="p-error">Stone size is required.</small>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="StoneCutTypeName" className="font-bold block my-2">
                                                Stone Cut {!isReadOnly && <span className="required"> *</span>}
                                            </label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <Dropdown value={state?.StoneCutTypeId} options={refactorStoneCutTypeData} onChange={(e) => handleDropdownChange(e)} name="StoneCutTypeId" optionLabel="StoneCutTypeName" className={classNames({ 'p-invalid': submitted && !state?.StoneCutTypeIdId }, "w-full")} resetFilterOnHide={true} showClear filter disabled={isReadOnly} />
                                            {submitted && !state?.StoneCutTypeIdId && <small className="p-error">Stone cut is required.</small>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="StoneQualityName" className="font-bold block my-2">
                                                Stone Quality {!isReadOnly && <span className="required"> *</span>}
                                            </label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <Dropdown value={state?.StoneQualityId} options={refactorStoneQualityData} onChange={(e) => handleDropdownChange(e)} name="StoneQualityId" optionLabel="StoneQualityName" className={classNames({ 'p-invalid': submitted && !state?.StoneQualityIdId }, "w-full")} resetFilterOnHide={true} showClear filter disabled={isReadOnly} />
                                            {submitted && !state?.StoneQualityIdId && <small className="p-error">Stone quality is required.</small>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="VendorName1" className="font-bold block my-2">Vendor 1</label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <Dropdown value={state?.VendorId1} options={refactorAllVendorData} onChange={(e) => handleDropdownChange(e)} name="VendorId1" optionLabel="VendorName" className="w-full" resetFilterOnHide={true} showClear filter disabled={isReadOnly} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="VendorName2" className="font-bold block my-2">Vendor 2</label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <Dropdown value={state?.VendorId2} options={refactorAllVendorData} onChange={(e) => handleDropdownChange(e)} name="VendorId2" optionLabel="VendorName" className="w-full" resetFilterOnHide={true} showClear filter disabled={isReadOnly} />
                                        </div>
                                    </div>
                                </div>
                            </Fieldset>
                        </div>
                        <div className='col-12 md:col-6 lg:col-6'>
                            <Fieldset className="p-0 m-0">
                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="WtEa" className="font-bold block my-2">Wt Ea</label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <InputNumber className="w-full" value={state?.WtEa} onValueChange={(e) => handleWtEaChange(e)} id="WtEa" name="WtEa" minFractionDigits={3} maxFractionDigits={3} min={0} disabled={isReadOnly} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="WtEaRd" className="font-bold block my-2">Wt Ea/Rd</label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <InputNumber className="w-full" value={state?.WtEaRd} onValueChange={(e) => handleChange(e)} id="WtEaRd" name="WtEaRd" minFractionDigits={3} maxFractionDigits={3} min={0} disabled={isReadOnly} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="Pct" className="font-bold block my-2">
                                                $/Pct
                                            </label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <InputNumber value={state?.Pct} onValueChange={(e) => handlePctChange(e)} id="Pct" name="Pct" mode="currency" currency="USD" locale="en-US" minFractionDigits={2} maxFractionDigits={2} className="w-full" min={0} disabled={isReadOnly} />
                                            {/* {submitted && !state?.Pct && <small className="p-error">$/Pct is required.</small>} */}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="FOBEa" className="font-bold block my-2">
                                                $/FOB Ea
                                            </label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <InputNumber value={state?.FOBEa} onValueChange={(e) => handleChange(e)} id="FOBEa" name="FOBEa" mode="currency" currency="USD" locale="en-US" minFractionDigits={2} maxFractionDigits={2} className="w-full" min={0} disabled={isReadOnly} />
                                            {/* {submitted && !state?.FOBEa && <small className="p-error">$/FOB Ea is required.</small>} */}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="LanEa" className="font-bold block my-2">
                                                $/Lan Ea {!isReadOnly && <span className="required"> *</span>}
                                            </label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <InputNumber value={state?.LanEa} onValueChange={(e) => handleChange(e)} id="LanEa" name="LanEa" mode="currency" currency="USD" locale="en-US" minFractionDigits={2} maxFractionDigits={2} className={classNames({ 'p-invalid': submitted && !state?.LanEa }, "w-full")} min={0} disabled={isReadOnly} />
                                            {submitted && !state?.LanEa && <small className="p-error">$/Lan Ea is required.</small>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-12 lg:col-12 p-0">
                                    <div className='flex'>
                                        <div className='col-12 md:col-4 lg:col-4'>
                                            <label htmlFor="LanEa" className="font-bold block my-2">
                                                Modified Date
                                            </label>
                                        </div>
                                        <div className='col-12 md:col-8 lg:col-8'>
                                            <Calendar value={state?.Modified} id="Modified" name="Modified" disabled showIcon />
                                        </div>
                                    </div>
                                </div>
                            </Fieldset>
                        </div>
                    </div>
                </Card >
            </div >

            <Dialog header="Stone Fields" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                <div className="col-12 md:col-12 lg:col-12">
                    <p>Select fields to generate csv for import</p>
                </div>
                <div className="col-12 md:col-12 lg:col-12">
                    <Checkbox inputId="AllStoneFields" name="AllStoneFields" value="AllStoneFields" onChange={onAllStoneFieldChange} checked={allStoneFieldChecked} />
                    <label htmlFor="AllStoneFields" className="ml-2">All</label>
                </div>
                <div className="col-12 md:col-12 lg:col-12">
                    <div className='flex flex-wrap justify-content-start gap-2 row-gap-2'>
                        {STONE_FIELDS_DATA.map((item) => {
                            return (
                                <div key={item} className="flex align-items-center w-8rem">
                                    <Checkbox inputId={item} name="stone-list" value={item} onChange={onCategoryChange} checked={selectedStones.some((x) => x === item)} />
                                    <label htmlFor={item} className="ml-2">{item}</label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Dialog>

            <Dialog header="Stone Fields" visible={exportVisible} style={{ width: '50vw' }} onHide={() => setExportVisible(false)} footer={exportFooterContent}>
                <div className="col-12 md:col-12 lg:col-12">
                    <p>Select fields to generate csv for export</p>
                </div>
                <div className="col-12 md:col-12 lg:col-12">
                    <Checkbox inputId="AllStoneFields" name="AllStoneFields" value="AllStoneFields" onChange={onAllStoneFieldChange} checked={allStoneFieldChecked} />
                    <label htmlFor="AllStoneFields" className="ml-2">All</label>
                </div>
                <div className="col-12 md:col-12 lg:col-12">
                    <div className='flex flex-wrap justify-content-start gap-2 row-gap-2'>
                        {STONE_FIELDS_DATA.map((item) => {
                            return (
                                <div key={item} className="flex align-items-center w-8rem">
                                    <Checkbox inputId={item} name="stone-list" value={item} onChange={onCategoryChange} checked={selectedStones.some((x) => x === item)} />
                                    <label htmlFor={item} className="ml-2">{item}</label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Dialog>

            <Dialog header="Upload Stone CSV" visible={isUploadCSVisible} style={{ width: '50vw' }} onHide={() => setIsUploadCSVisible(false)}>
                <div className="col-12 text-right">
                    <Button label={"Generate CSV File for upload data."} icon="pi pi-database" tooltip={"Import"} onClick={() => { onClickGenerateCSVFile() }} data-pr-position="bottom" />
                </div>
                <div className="col-12">
                    <FileUpload name="UploadStoneDataCSV" onUpload={(e) => onStoneDataCSVFileUpload(e.files)} url="/" />
                    <small className="p-error">Note: Please import maximum 500 stones at a time.</small>
                </div>
            </Dialog>
        </div >
    )
}

export default StoneListsView