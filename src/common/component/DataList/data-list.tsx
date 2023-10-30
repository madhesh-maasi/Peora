import * as React from 'react'
import { useContext } from 'react';
import { ListBox } from '../../primereactComponents'
import { PeoraContext } from '../../../contexts/PeoraContext';

export const DataList = (props) => {
    const { value, options, optionLabel, filterBy, onChange, emptyFilterMessage, filterPlaceholder, listHeight, sectionHeight } = props;
    const { vendorDetailsSectionHeight } = useContext(PeoraContext);
    return (
        <ListBox filterBy={filterBy} className="w-full" filter value={value} onChange={onChange} options={options} optionLabel={optionLabel} filterPlaceholder={filterPlaceholder} emptyFilterMessage={emptyFilterMessage} listStyle={{ height: `${listHeight}px`, overflow: 'auto' }} style={{ height: `${sectionHeight}px` }} />
    );
}
