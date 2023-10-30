import * as React from 'react'
import { useContext, useState, useEffect } from 'react';
import { TabView, TabPanel } from '../../primereactComponents';
import { absoluteUrl } from '../../../webparts/peoraInventory/components/PeoraInventory';
import { ADJUSTMENT_REASON_LIST_LINK, BACKING_TYPE_LIST_LINK, BASE_METAL_LIST_LINK, BOX_TYPE_LIST_LINK, CATEGORY_LIST_LINK, CHAIN_TYPE_LIST_LINK, INSERT_TYPE_LIST_LINK, LENGTH_LIST_LINK, METAL_TYPE_LIST_LINK, PARENTAGE_LIST_LINK, PRICING_SCHEME_LIST_LINK, RECOVERABLE_COST_LIST_LINK, REPAIR_REASON_LIST_LINK, RETURN_DISPOSITION_LIST_LINK, SELLING_PRICE_LIST_LINK, STONE_BASE_LIST_LINK, STONE_CUT_TYPE_LIST_LINK, STONE_QUALITY_LIST_LINK, STONE_SHAPE_LIST_LINK, STONE_SIZE_LIST_LINK, STONE_TYPE_LIST_LINK, SUB_CATEGORY_LIST_LINK, VENDOR_LIST_LINK, WIDTH_LIST_LINK } from '../../constants';
import './default-list-view.css'
import { PeoraContext } from '../../../contexts/PeoraContext';

const DefaultListView = () => {
    const { masterDataTabIndex,
        setMasterDataTabIndex
    } = useContext(PeoraContext);

    const onChangeTab = (e) => {
        setMasterDataTabIndex(e.index);
    };

    return (
        <div className='card list-data'>
            <TabView activeIndex={masterDataTabIndex} onTabChange={(e) => onChangeTab(e)}>
                <TabPanel header="Category" leftIcon="fa fa-solid fa-sitemap mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${CATEGORY_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Sub Category" leftIcon="fa fa-diagram-project mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${SUB_CATEGORY_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Base Metal" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${BASE_METAL_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Metal Type" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${METAL_TYPE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Base Stone" leftIcon="fa-solid fa-gem mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${STONE_BASE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Stone Type" leftIcon="fa fa-solid fa-gem mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${STONE_TYPE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Stone Shape" leftIcon="fa fa-solid fa-shapes mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${STONE_SHAPE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Stone Size" leftIcon="fa fa-solid fa-gem mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${STONE_SIZE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Stone Cutting Type" leftIcon="fa fa-solid fa-gem mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${STONE_CUT_TYPE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Stone Quality" leftIcon="fa fa-solid fa-gem mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${STONE_QUALITY_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Length" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${LENGTH_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Width" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${WIDTH_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Box Type" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${BOX_TYPE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Parentage" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${PARENTAGE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Insert Type" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${INSERT_TYPE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Chain Type" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${CHAIN_TYPE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Backing Type" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${BACKING_TYPE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Recoverable Cost" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${RECOVERABLE_COST_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Repair Reason" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${REPAIR_REASON_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Return Disposition" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${RETURN_DISPOSITION_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Adjustment Reason" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${ADJUSTMENT_REASON_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                <TabPanel header="Selling Price" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${SELLING_PRICE_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel>
                {/* <TabPanel header="Pricing Scheme" leftIcon="fa fa-solid fa-list mr-2">
                    <div className="col-12 md:col-12 lg:col-12">
                        <iframe src={`${absoluteUrl}${PRICING_SCHEME_LIST_LINK}`} className="iframe-div-view" />
                    </div>
                </TabPanel> */}
            </TabView>
        </div>
    )
}

export default DefaultListView