export const utilsList = [
  {
    name: 'restoreDeletedElements',
    label: 'Восстановление удалённых элементов',
    link:'utils/restoreDeletedElements',
  },
]

export const entityTypes = [
  {
    name: 'Штаммы',
    getElems: () => fetch('/deleted_strains'),
    restoreFunc: (id) => fetch(`/strain/restore/${id}`)
  },
  {
    name: 'Рода',
    getElems: () => fetch('/deleted_rods'),
    restoreFunc: (id) => fetch(`/rod/restore/${id}`)
  },
  {
    name: 'Виды',
    getElems: () => fetch('/deleted_vids'),
    restoreFunc: (id) => fetch(`/vid/restore/${id}`)
  },
  {
    name: 'Свойства',
    getElems: () => fetch('/deleted_properties'),
    restoreFunc: (id) => fetch(`/property/restore/${id}`)
  },
]