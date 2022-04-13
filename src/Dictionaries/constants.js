export const OPEN_GENUSES = 'rods';
export const OPEN_TYPES = 'vids';
export const OPEN_PROPERTIES = 'properties';


export const OPEN_NEW_ELEM_MODAL = 'open-new-elem-modal';

export const EDIT_ITEM = 'edit-item';

export const editItem = (id) => ({type: EDIT_ITEM, payload: id});

export const openNewElem = (elemType) => ({type: OPEN_NEW_ELEM_MODAL, payload: elemType});