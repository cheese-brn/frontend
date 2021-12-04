export const OPEN_GENUSES = 'open-genuses';
export const OPEN_TYPES = 'open-types';
export const OPEN_PROPERTIES = 'open-properties';
export const OPEN_MODAL = 'open-modal';
export const CLOSE_MODAL = 'close-modal';
export const CHANGE_PAGE = 'change-page';

export const changePage = (targetPage) => {
	return {type: CHANGE_PAGE, payload: targetPage};
};

export const closeModal = () => {
	return {type: CLOSE_MODAL};
}