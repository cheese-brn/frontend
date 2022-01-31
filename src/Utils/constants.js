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
    restoreFunc: (id) => fetch(`/strain/restore/${id}`, {method: 'POST', headers: {'Content-Type': 'application/json'}})
  }
]