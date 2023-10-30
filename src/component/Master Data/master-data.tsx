import * as React from 'react';
import { useContext } from 'react';
import { Card, Button } from '../../common/primereactComponents';
import DefaultListView from '../../common/component/DefaultListView/default-list-view';
import { useNavigate } from 'react-router-dom';
import { PeoraContext } from '../../contexts/PeoraContext';

const MasterData = () => {
    const { masterDataRoute, setMasterDataRoute } = useContext(PeoraContext);
    setMasterDataRoute("/master-data");
    const navigate = useNavigate();

    const masterDataHeader = (
        <div className='flex justify-content-between align-items-center'>
            <h2 className='mx-2'>Master Data</h2>
            <div className='flex justify-content-end'>
                <div className='mr-2'>
                    <Button label={"Go Back"} tooltip={"Go Back"} onClick={() => navigate('/')} icon="pi pi-home" data-pr-position="bottom" />
                </div>
            </div>
        </div>
    )
    return (
        <Card header={masterDataHeader}>
            <DefaultListView />
        </Card>
    )
}

export default MasterData