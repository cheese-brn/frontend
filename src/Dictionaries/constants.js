export const OPEN_GENUSES = 'rods';
export const OPEN_TYPES = 'vids';
export const OPEN_PROPERTIES = 'properties';

export const OPEN_NEW_ELEM_MODAL = 'open-new-elem-modal';

export const OPEN_EDIT_MODAL = 'open-edit-modal';
export const openEditModal = (id) => ({type: OPEN_EDIT_MODAL, payload: id});

export const CLOSE_MODAL = 'close-edit-modal';
export const closeModal = () => ({type: CLOSE_MODAL});


export const openNewElem = (elemType) => ({type: OPEN_NEW_ELEM_MODAL, payload: elemType});