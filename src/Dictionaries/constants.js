export const OPEN_GENUSES = 'rods';
export const OPEN_TYPES = 'vids';
export const OPEN_PROPERTIES = 'properties';

export const CLOSE_ITEM = 'close-item';
export const CHANGE_PAGE = 'change-page';

export const OPEN_NEW_ELEM_MODAL = 'open-new-elem-modal';

export const SET_DATA = 'set-data';

export const ADD_ITEM = 'add-item';
export const DELETE_ITEM = 'delete-item';
export const EDIT_ITEM = 'edit-item';

export const changePage = (targetPage) => {
  return { type: CHANGE_PAGE, payload: targetPage };
};

export const setData = (data) => {
  return {type: SET_DATA, payload: data};
};

export const deleteItem = (id) => {
  return {type: DELETE_ITEM, payload: id};
};

export const editItem = (id) => {
  return {type: EDIT_ITEM, payload: id};
};

export const openNewElem = (elemType) => ({type: OPEN_NEW_ELEM_MODAL, payload: elemType});

export const addElem = (elemData) => ({type: ADD_ITEM, payload: elemData});