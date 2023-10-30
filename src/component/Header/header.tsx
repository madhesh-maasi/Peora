import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import '../Header/header.css'
import { SlideMenu } from 'primereact/slidemenu';
import { useNavigate } from 'react-router-dom';
import { PeoraContext } from '../../contexts/PeoraContext';

const Header = () => {
    const navigate = useNavigate();
    const headerRef = useRef(null);
    const menu = useRef(null);

    const { allMenuData, masterDataTabIndex, setMasterDataTabIndex, setOrderId, setPurchaseOrderData } = useContext(PeoraContext);

    const [item, setItem] = useState(null);

    useEffect(() => {
        if (allMenuData && allMenuData.length > 0) {
            const data = allMenuData
            setItem(JSON.parse(data[0]?.HeaderOptions));
        }
    }, [allMenuData]);

    const items = [
        {
            label: 'Dashboard',
            icon: 'fa fa-th-large',
            command: () => {
                navigate("/");
                closeSideNav();
            }
        },
        {
            label: 'Sales Order',
            icon: 'fa fa-upload',
            command: () => {
                // navigate("/SalesOrder");
                // closeSideNav();
            }
        },
        {
            label: 'Customer',
            icon: 'fa-solid fa-user',
            command: () => {
                // navigate("/Customer");
                // closeSideNav();
            }
        },
        {
            label: 'Product',
            icon: 'fa fa-cube',
            command: () => {
                navigate("/Inventory");
                closeSideNav();
            }
        },
        {
            label: 'Stones',
            icon: 'fa fa-solid fa-gem',
            command: () => {
                navigate("/StoneLists");
                closeSideNav();
            }
        },
        {
            label: 'Purchase Order',
            icon: 'fa fa-cart-arrow-down',            
        },
        {
            label: 'Vendor',
            icon: 'fa-solid fa-users',            
        },
        {
            label: 'Adjustments',
            icon: 'fa fa-sliders',
            items: [
                {
                    label: 'Stock Transfer',
                },
                {
                    label: 'Repairs',
                },
                {
                    label: 'Returns',
                },
                {
                    label: 'Stock Adjustments',
                },

            ]
        },
        {
            label: 'Report',
            icon: 'fa-solid fa-file-lines',
            items: [
                {
                    label: 'Inventory Updates',
                    items: [
                        {
                            label: 'Amazon Inventory Update Template',
                        },
                        {
                            label: 'Oravo Inventory Update Template',
                        },
                        {
                            label: 'Peora Shopify Inventory Update Template',
                        },
                        {
                            label: 'RO Inventory Updated Template',
                        },
                        {
                            label: 'SJC Shopify Inventory Update Template',
                        },
                        {
                            label: 'SM Inventory Updated Template',
                        }

                    ]
                },
                {
                    label: 'Monthly Sales by Channel',
                    items: [
                        {
                            label: 'Amazon',
                        },
                        {
                            label: 'Oravo',
                        },
                        {
                            label: 'Peora',
                        },
                        {
                            label: 'Peora',
                        },
                        {
                            label: 'Peora',
                        },
                        {
                            label: 'Peora',
                        }

                    ]
                },
                {
                    label: 'Other',
                    items: [
                        {
                            label: 'FBA Replishment',
                        },
                        {
                            label: 'Sales Report',
                        },
                        {
                            label: 'VIP Items Reorder',
                        },
                        {
                            label: 'Purchase Report',
                        }

                    ]
                }

            ]
        },
        {
            label: 'Options',
            icon: 'fa fa-cogs',
            items: [
                {
                    label: 'Category',
                    command: () => {
                        setMasterDataTabIndex(0);
                        navigate("/master-data");
                        closeSideNav();
                    },
                },
                {
                    label: 'Sub-Category',
                    command: () => {
                        setMasterDataTabIndex(1);
                        navigate('/master-data');
                        closeSideNav();
                    }
                },
                {
                    label: 'Base Metal',
                    command: () => {
                        setMasterDataTabIndex(2);
                        navigate("/master-data");
                        closeSideNav();
                    },
                },
                {
                    label: 'Metal Type',
                    command: () => {
                        setMasterDataTabIndex(3);
                        navigate("/master-data");
                        closeSideNav();
                    },
                },
                {
                    label: 'Stone Attributes',
                    items: [
                        {
                            label: 'Base Stone',
                            command: () => {
                                setMasterDataTabIndex(4);
                                navigate("/master-data");
                                closeSideNav();
                            },
                        },
                        {
                            label: 'Stone Type',
                            command: () => {
                                setMasterDataTabIndex(5);
                                navigate("/master-data");
                                closeSideNav();
                            },
                        },
                        {
                            label: 'Stone Shape',
                            command: () => {
                                setMasterDataTabIndex(6);
                                navigate("/master-data");
                                closeSideNav();
                            },
                        },
                        {
                            label: 'Stone Size',
                            command: () => {
                                setMasterDataTabIndex(7);
                                navigate("/master-data");
                                closeSideNav();
                            },
                        },
                        {
                            label: 'Stone Cut',
                            command: () => {
                                setMasterDataTabIndex(8);
                                navigate("/master-data");
                                closeSideNav();
                            },
                        },
                        {
                            label: 'Stone Quality',
                            command: () => {
                                setMasterDataTabIndex(9);
                                navigate("/master-data");
                                closeSideNav();
                            }
                        }

                    ]
                },
                {
                    label: 'Length',
                    command: () => {
                        setMasterDataTabIndex(10);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                {
                    label: 'Width',
                    command: () => {
                        setMasterDataTabIndex(11);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                {
                    label: 'Box Type',
                    command: () => {
                        setMasterDataTabIndex(12);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                {
                    label: 'Parentage',
                    command: () => {
                        setMasterDataTabIndex(13);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                {
                    label: 'Insert Type',
                    command: () => {
                        setMasterDataTabIndex(14);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                {
                    label: 'Chain Type',
                    command: () => {
                        setMasterDataTabIndex(15);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                {
                    label: 'Backing Type',
                    command: () => {
                        setMasterDataTabIndex(16);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                {
                    label: 'Recoverable cost',
                    command: () => {
                        setMasterDataTabIndex(17);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                {
                    label: 'Repair Reason',
                    command: () => {
                        setMasterDataTabIndex(18);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                {
                    label: 'Return Disposition',
                    command: () => {
                        setMasterDataTabIndex(19);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                {
                    label: 'Adjustment Reason',
                    command: () => {
                        setMasterDataTabIndex(20);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                {
                    label: 'Selling Price',
                    command: () => {
                        setMasterDataTabIndex(21);
                        navigate("/master-data");
                        closeSideNav();
                    }
                },
                // {
                //     label: 'Pricing Schema',
                //     items: [
                //         {
                //             label: 'Amazon Suggested',
                //         },
                //         {
                //             label: 'Peora Suggested',
                //         },
                //         {
                //             label: 'SM Suggested',
                //         },
                //         {
                //             label: 'Oravo Suggested',
                //         },
                //         {
                //             label: 'RO Suggested',
                //         }

                //     ]
                // }

            ]
        },
        {
            label: 'Import',
            icon: 'fa-solid fa-truck',
            items: [
                {
                    label: 'Sales Order',
                    command: () => {
                        // navigate("/SalesOrder");
                        // closeSideNav();
                    }
                },
                {
                    label: 'Stock Transfer',
                },
                {
                    label: 'Returns',
                },
                {
                    label: 'Purchase Order',
                    command: () => {
                        // navigate("/PurchaseOrder");
                        // closeSideNav();
                    }
                },
                {
                    label: 'Product Details',
                },
                {
                    label: 'Loose Stone',
                }

            ]
        },
        {
            label: 'Export',
            icon: 'fa-regular fa-circle-left',
            items: [
                {
                    label: 'Office Qty',
                },
                {
                    label: 'Product Details',
                },
                {
                    label: 'Loose Stone',
                }

            ]
        },
        {
            label: 'API',
            icon: 'fa fa-database',
            items: [
                {
                    label: 'Amazon',
                    icon: 'pi pi-fw pi-align-left',
                    items: [
                        {
                            label: 'Fetch FBA qty',
                        },
                        {
                            label: 'Fetch Sales by Sku',
                        },
                        {
                            label: 'Push MNF Qty',
                        }

                    ]
                },
                {
                    label: 'Peora (shopify)',
                    icon: 'pi pi-fw pi-align-right',
                    items: [
                        {
                            label: 'Fetch Sales by Sku',
                        },
                        {
                            label: 'Push Qty',
                        }

                    ]
                },
                {
                    label: 'SJC (shopify)',
                    icon: 'pi pi-fw pi-align-right',
                    items: [
                        {
                            label: 'Fetch Sales by Sku',
                        },
                        {
                            label: 'Push Qty',
                        }

                    ]
                }

            ]
        },
        {
            label: 'Admin',
            icon: 'fa-solid fa-user-tie',
            items: [
                {
                    label: 'User',

                }
            ]
        }
    ];

    const openSideNav = () => {
        document.getElementById("sideNav").style.width = "242px";
        document.addEventListener("click", handleOutsideClick);
    };

    const closeSideNav = () => {
        document.getElementById("sideNav").style.width = "0";
        document.removeEventListener("click", handleOutsideClick);
    };

    const handleOutsideClick = (event) => {
        if (!headerRef.current.contains(event.target)) {
            closeSideNav();
        }
    };

    return (
        <>
            <div className="grid header-div mt-2 mb-3 grid-nogutter">
                <div className="flex">
                    <div className=" site-header" ref={headerRef}>
                        <i className="pi pi-bars bar-icon" onClick={openSideNav}></i>
                        <div id="sideNav" className="header-side-nav">
                            <div className='close-Nav'>
                                <i className="pi pi-times close-icon" onClick={closeSideNav}></i>
                            </div>
                            <SlideMenu model={items} menuWidth={225} />
                        </div>
                    </div>

                    <div className="flex align-items-center">
                        <div className="logo-container">
                            <a className="logo-link" title="Dashboard" onClick={(e) => { navigate('/'); }}>
                                <img
                                    src={require("../../assets/images/Peora_Logo_Black.png")}
                                    className='logo'
                                    alt="PEORA Logo"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header