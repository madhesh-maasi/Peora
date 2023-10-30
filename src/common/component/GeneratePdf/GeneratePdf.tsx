import * as React from 'react'
import { Document, Page, Text, Image, Link, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { format } from 'date-fns';
const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 20,
        fontSize: 10,
    },
    brandingWrapper: {
        display: 'flex',
        flexDirection: 'row',
    },
    purchaseOrder: {
        marginLeft: 'auto',
    },
    divider: {
        borderBottom: '1px solid #cfcecc',
        marginTop: 12
    },
    label: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 13,
        marginTop: 10
    },
    purchaseOrderStyle: {
        display: 'flex',
        justifyContent: 'center'
    },
    inventoryStyle: {
        display: 'flex',
        flexDirection: 'row',
    },
    innerTableHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        border: '1px solid #ffffff',
        color: "#fff",
        backgroundColor: '#1d4274',
    },
    tableBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1d4274',
        borderLeft: '1px solid #1d4274',
        borderRight: '1px solid #1d4274',
    },
    imageSize: {
        height: "100px",
        width: "100px",
    },
    image: {
        width: '20%',
        marginTop: 10,
        marginBottom: 10
    },
    tablePadding: {
        padding: 5,
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: '-50',
        color: '#1d4274',
    }
});

const GeneratePdf = (props) => {
    const { pdfData } = props;
    return (
        <Document>
            <Page style={styles.body}>
                <View style={styles.brandingWrapper}>
                    <View>
                        <Text style={{ fontSize: "12px", marginBottom: '5px' }}>Vendor Name : {pdfData.purchaseOrderInformation?.VendorName?.VendorName}</Text>
                        <Text style={{ fontSize: "12px" }}>Project Name : {pdfData?.purchaseOrderInformation?.ProjectName}</Text>
                    </View>
                    <View style={styles.purchaseOrder}>
                        <Text style={{ fontSize: "12px", marginBottom: '5px' }}>Order No. : {pdfData?.purchaseOrderInformation?.OrderNumber}</Text>
                        <Text style={{ fontSize: "12px" }}>Date: {pdfData?.purchaseOrderInformation?.Date ? format(new Date(pdfData?.purchaseOrderInformation?.Date), "MM/dd/yyyy") : null}</Text>
                    </View>
                </View>
                <View style={styles.divider}></View>
                {
                    pdfData.inventoryData && pdfData.inventoryData.length > 0 &&
                    <View>
                        <Text style={styles.label}>Purchase Order Information</Text>
                        <View style={styles.divider}></View>
                        {
                            pdfData.inventoryData && pdfData.inventoryData.length > 0 && pdfData.inventoryData.map((ele, index) => {
                                const imageData = ele?.Photos;
                                const imageUrl = imageData && imageData.length > 0 && JSON.parse(imageData)[0]?.objectURL;
                                let stoneInformation = pdfData.stoneData.filter((item) => item.SKU == ele.Title);
                                return (
                                    <>
                                        <View style={styles.inventoryStyle}>
                                            <View style={{ width: '40%' }}>
                                                <Text style={{ marginBottom: '10px', marginTop: '10px' }}>No. : {index + 1}</Text>
                                                <Text style={{ marginBottom: '10px' }}>SKU : {ele.Title}</Text>
                                                <Text style={{ marginBottom: '10px' }}>Ref No : {ele?.VendorRef1}</Text>
                                            </View>
                                            <View style={{ width: '40%' }}>
                                                <Text style={{ marginBottom: '10px', marginTop: '10px' }}>Ring Size : {ele?.RingSize}</Text>
                                                <Text style={{ marginBottom: '10px' }}>Metal Type : {ele?.MetalType?.MetalTypeName}</Text>
                                                <Text style={{ marginBottom: '10px' }}>Jewelry Qty : {ele?.orderQty}</Text>
                                            </View>
                                            <View style={styles.image}>
                                                {imageUrl && <Image src={imageUrl} style={styles.imageSize} />}
                                            </View>
                                        </View>
                                        {
                                            stoneInformation && stoneInformation.length > 0 &&
                                            <View>
                                                <View style={styles.innerTableHead}>
                                                    <View style={{ width: '7%' }}>
                                                        <Text style={styles.tablePadding}>No.</Text>
                                                    </View>
                                                    {/* <View style={{ width: '13%', borderLeft: '1px solid #fff' }}>
                                                        <Text style={styles.tablePadding}>Stone Code</Text>
                                                    </View> */}
                                                    <View style={{ width: '10%', borderLeft: '1px solid #fff' }}>
                                                        <Text style={styles.tablePadding}>Type</Text>
                                                    </View>
                                                    <View style={{ width: '10%', borderLeft: '1px solid #fff' }}>
                                                        <Text style={styles.tablePadding}>Shape</Text>
                                                    </View>
                                                    <View style={{ width: '10%', borderLeft: '1px solid #fff' }}>
                                                        <Text style={styles.tablePadding}>Size</Text>
                                                    </View>
                                                    <View style={{ width: '10%', borderLeft: '1px solid #fff' }}>
                                                        <Text style={styles.tablePadding}>Cutting</Text>
                                                    </View>
                                                    <View style={{ width: '10%', borderLeft: '1px solid #fff' }}>
                                                        <Text style={styles.tablePadding}>Quality</Text>
                                                    </View>
                                                    <View style={{ width: '10%', borderLeft: '1px solid #fff' }}>
                                                        <Text style={styles.tablePadding}>Pcs per jewelry</Text>
                                                    </View>
                                                    <View style={{ width: '10%', borderLeft: '1px solid #fff' }}>
                                                        <Text style={styles.tablePadding}>Total Stone Qty</Text>
                                                    </View>
                                                    <View style={{ width: '20%', borderLeft: '1px solid #fff' }}>
                                                        <Text style={styles.tablePadding}>Vendor Code 1</Text>
                                                    </View>
                                                </View>
                                                {
                                                    stoneInformation.map((item, index) => {
                                                        if (item.SKU == ele.Title) {
                                                            return (
                                                                <View style={styles.tableBody}>
                                                                    <View style={{ width: '7%' }}>
                                                                        <Text style={styles.tablePadding}>{index + 1}</Text>
                                                                    </View>
                                                                    {/* <View style={{ width: '13%', borderLeft: '1px solid #1d4274' }}>
                                                                        <Text style={styles.tablePadding}>{item?.StoneCode}</Text>
                                                                    </View> */}
                                                                    <View style={{ width: '10%', borderLeft: '1px solid #1d4274' }}>
                                                                        <Text style={styles.tablePadding}>{item?.StoneTypeId?.StoneTypeName}</Text>
                                                                    </View>
                                                                    <View style={{ width: '10%', borderLeft: '1px solid #1d4274' }}>
                                                                        <Text style={styles.tablePadding}>{item?.StoneShapeId?.StoneShapeName}</Text>
                                                                    </View>
                                                                    <View style={{ width: '10%', borderLeft: '1px solid #1d4274' }}>
                                                                        <Text style={styles.tablePadding}>{item?.StoneSizeId?.StoneSizeName}</Text>
                                                                    </View>
                                                                    <View style={{ width: '10%', borderLeft: '1px solid #1d4274' }}>
                                                                        <Text style={styles.tablePadding}>{item?.StoneCutTypeId?.StoneCutTypeName}</Text>
                                                                    </View>
                                                                    <View style={{ width: '10%', borderLeft: '1px solid #1d4274' }}>
                                                                        <Text style={styles.tablePadding}>{item?.StoneQualityId?.StoneQualityName}</Text>
                                                                    </View>
                                                                    <View style={{ width: '10%', borderLeft: '1px solid #1d4274', textAlign: 'right' }}>
                                                                        <Text style={styles.tablePadding}>{item?.stonePerPic}</Text>
                                                                    </View>
                                                                    <View style={{ width: '10%', borderLeft: '1px solid #1d4274', textAlign: 'right' }}>
                                                                        <Text style={styles.tablePadding}>{item?.totalStoneQty}</Text>
                                                                    </View>
                                                                    <View style={{ width: '20%', borderLeft: '1px solid #1d4274' }}>
                                                                        <Text style={styles.tablePadding}>{item?.VendorId1?.VendorName}</Text>
                                                                    </View>
                                                                </View>
                                                            )
                                                        }
                                                        else {
                                                            <View></View>
                                                        }
                                                    })
                                                }
                                            </View>
                                        }
                                        <View style={styles.divider}></View>
                                    </>
                                );
                            })
                        }
                    </View>
                }
            </Page>
        </Document>
    )
}

export default GeneratePdf