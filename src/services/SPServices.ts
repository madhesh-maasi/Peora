import { SPFI } from "@pnp/sp";
import { getSP } from "./pnpConfig";
import "@pnp/sp/fields";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import '@pnp/sp/attachments';
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/attachments";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/security/web";
import "@pnp/sp/items/get-all";
import "@pnp/sp/security";
import { PermissionKind } from "@pnp/sp/security";
import { ADMIN_USER_GROUP, } from "../common/constants";

export const checkUserHasPermissionForManageWeb = async () => {
    try {
        const sp: SPFI = getSP();
        return await sp.web.currentUserHasPermissions(PermissionKind.ManageSubwebs);
    } catch (ex) {
        console.log("checkUserHasPermissionForManageWeb...error...", JSON.stringify(ex));
        throw ex.message.value;
    }
};

export const getChoiceFieldItem = async (listName, fieldInternalName) => {
    const sp: SPFI = getSP();

    return await sp.web.lists.getByTitle(listName).fields.getByInternalNameOrTitle(fieldInternalName)().then((res) => {
        return res
    }).catch((err) => {
        console.log("err..", JSON.stringify(err));
        return err;
    });
};

export const getAllSPListItems = async (listName: string, selectProperties: string[], expandProperties: string[], filterQuery: string, topCount: number, orderByColumn: string, orderBy: boolean) => {
    const sp: SPFI = getSP();
    return sp.web.lists.getByTitle(listName).items.select(...selectProperties).expand(...expandProperties).filter(filterQuery).orderBy(orderByColumn, orderBy).top(topCount).getAll(topCount).then((res) => {
        return res;
    }).catch((err: any) => {
        console.log("err..", JSON.stringify(err));
        return err;
    });
};

export const getSPListItems = async (listName: string, selectProperties: string[], expandProperties: string[], filterQuery: string, topCount: number, orderByColumn: string, orderBy: boolean) => {
    const sp: SPFI = getSP();
    return sp.web.lists.getByTitle(listName).items.select(...selectProperties).expand(...expandProperties).filter(filterQuery).orderBy(orderByColumn, orderBy).top(topCount)().then((res) => {
        return res;
    }).catch((err: any) => {
        console.log("err..", JSON.stringify(err));
        return err;
    });
};

export const addItemToSPList = async (listName: string, item: any) => {
    try {
        const sp: SPFI = getSP();
        const insertedItem = await sp.web.lists.getByTitle(listName).items.add(item);
        return insertedItem;
    } catch (ex) {
        console.log("addItemToSPList...error...", JSON.stringify(ex));
        throw ex.message.value;
    }
};

export const updateItemToSPList = async (listName: string, item: any) => {
    try {
        const sp: SPFI = getSP();
        const updatedItem = await sp.web.lists.getByTitle(listName).items.getById(item.Id).update(item);
        return updatedItem;
    } catch (ex) {
        console.log("updateItemToSPList...error...", JSON.stringify(ex));
        throw ex.message.value;
    }
};

export const deleteItemFromSPList = async (listName: string, itemId: number) => {
    try {
        const sp: SPFI = getSP();
        return await sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
    }
    catch (err) {
        console.log("deleteItemFromSPList...error...", JSON.stringify(err));
        return err;
    }
};

export const deleteSPListItemAttachmentFile = async (listName: string, itemId: number, fileName: string) => {
    const sp: SPFI = getSP();
    return sp.web.lists.getByTitle(listName).items.getById(itemId).attachmentFiles.getByName(fileName).delete().then((res) => {
        return res;
    }).catch((err) => {
        console.log("Service...deleteSPListItemAttachmentFile...error...", JSON.stringify(err));
        return err;
    });
};

export const updateSingleFieldValueToSPList = async (listName: string, itemId: number, fieldInternalName: string, fieldValue: any) => {
    try {
        const sp: SPFI = getSP();
        return sp.web.lists.getByTitle(listName).items.getById(itemId).update({
            [fieldInternalName]: fieldValue
        }).then(res => {
            console.log("..................", fieldValue);

            return res;
        }).catch((err) => {
            console.log("error...updateSingleFieldValueToSPList...", JSON.stringify(err));
            return err;
        });
    } catch (ex) {
        console.log("updateSingleFieldValueToSPList...error...", JSON.stringify(ex));
        throw ex.message.value;
    }
};

export const checkCurrentUserGroups = async () => {
    const sp: SPFI = getSP();
    let groups = await sp.web.currentUser.groups();
    let filterAdminUserGroup = groups.filter(({ LoginName }) => LoginName === ADMIN_USER_GROUP);
    if (filterAdminUserGroup.length > 0) {
        return true;
    }
    else {
        return false;
    }
};

export const updateInventoryProductMultipleFields = async (listName, itemId, newMtWtFoB, newMtWtFeed, newFOBMountingCost, newLDMountCost) => {
    const sp: SPFI = getSP();
    await sp.web.lists.getByTitle(listName).items.getById(itemId).update({
        "MtWtFOB": newMtWtFoB,
        "MtWtFeed": newMtWtFeed,
        "FOBMountingCost": newFOBMountingCost,
        "LDMountCost": newLDMountCost
    }).then(res => {
        return res;
    }).catch((err) => {
        console.log("err..", JSON.stringify(err));
        return err;
    });
}
export const updateInventoryOrderMultipleFields = async (listName, itemId, officeQty, onOrder) => {
    const sp: SPFI = getSP();
    await sp.web.lists.getByTitle(listName).items.getById(itemId).update({
        "OfficeQty": officeQty,
        "OnOrder": onOrder
    }).then(res => {
        return res;
    }).catch((err) => {
        console.log("err..", JSON.stringify(err));
        return err;
    });
}