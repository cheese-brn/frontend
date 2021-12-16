export const OPEN_GENUSES = 'rod'
export const OPEN_TYPES = 'vid'
export const OPEN_PROPERTIES = 'property'
export const OPEN_MODAL = 'open-modal'
export const CLOSE_MODAL = 'close-modal'
export const CHANGE_PAGE = 'change-page'

export const changePage = (targetPage) => {
  return { type: CHANGE_PAGE, payload: targetPage }
}

export const closeModal = () => {
  return { type: CLOSE_MODAL }
}
