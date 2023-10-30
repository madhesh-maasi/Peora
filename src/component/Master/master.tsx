import * as React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import './master.css';
import PeoraContextProvider from '../../contexts/PeoraContext';
import Home from '../Home/home';
import MasterData from '../Master Data/master-data';
import StoneListsView from '../StoneLists/stone-lists';
import Product from '../Product/product';
import Header from '../Header/header';

const Master = (props: any) => {
    return (
        <>
            <HashRouter>
                <PeoraContextProvider>
                    <Header />
                    <div className='main'>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/Inventory' element={<Product />} />
                            <Route path='/master-data' element={<MasterData />} />
                            <Route path='/StoneLists' element={<StoneListsView />} />                                                        
                        </Routes>
                    </div>
                </PeoraContextProvider>
            </HashRouter>
        </>
    );
};

export default Master;
