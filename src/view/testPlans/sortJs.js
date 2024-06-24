// import Sortablejs from 'sortablejs'
import Sortable, { MultiDrag } from 'sortablejs'

Sortable.mount(new MultiDrag())

export function createSortable(dom, config = {}) {
  return new Sortable(dom, {
    animation: 150,
    multiDrag: true,
    selectedClass: 'selected',
    // multiDragKey: 'id',
    ...config,
  })
}
