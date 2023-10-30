import * as React from 'react'

export const PrintData = ({ productData }) => {
    const stoneDetails = JSON.parse(productData[0]?.StoneDetails);
    return (
        <>
            <div className='col-12 md:col-12 lg:col-12 px-1'>
                <span style={{ fontWeight: 'bolder', fontSize: '17px' }}> SKU: {productData[0].Title} </span>
            </div>
            <div className='col-12 md:col-12 lg:col-12 px-1 py-0' style={{ fontSize: '12px' }}>
                <span> VENDOR: </span> {productData[0].Vendor?.VendorName}
            </div>
            <div className='col-12 md:col-12 lg:col-12 px-1 py-0' style={{ fontSize: '12px' }}>
                <span> REF: </span> {productData[0].VendorRef1}
            </div>
            <div className='col-12 md:col-12 lg:col-12 px-1 py-0' style={{fontSize: '12px'}}>
                <span> METAL: </span> {productData[0].MetalType?.MetalTypeName}
            </div>
            <div className='col-12 md:col-12 lg:col-12 px-1 py-0' style={{ fontSize: '12px' }}>
                <span> METAL WT: </span> {productData[0].MtWtFOB}
            </div>
            {stoneDetails && stoneDetails.length > 0 && stoneDetails.map((x, index) => {
                return (
                    <div key={x.stoneCode} className='col-12 md:col-12 lg:col-12 px-1 py-0' style={{ fontSize: '12px' }}>
                        <span> ST{index + 1}: </span> {x.stoneCode}
                    </div>
                )
            })}
            <div className='col-12 md:col-12 lg:col-12 px-1 py-0' style={{ fontSize: '12px' }}>
                <span> CBC: </span> {productData[0].BagComments}
            </div>
        </>
    )
}