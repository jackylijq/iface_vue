import MyWebWorker from '../../worker'

// const JsonToTableData =
class JsonToTableData {
  constructor() {
    return new MyWebWorker(function (JsonData) {
      //高级转全景
      function getType(data) {
        return Object.prototype.toString.call(data).slice(8, -1)
      }
      function backTrans(obj, pid = '') {
        let res = []
        for (let key in obj) {
          let value = obj[key]
          let valueType = getType(value)
          let lowerValueType = valueType.toLowerCase()
          let item = {
            name: key,
            valueType: lowerValueType,
            id: `${pid}-${key}`,
          }
          switch (valueType) {
            case 'Array':
              if (['Object'].includes(getType(value[0])) && value.length > 1) {
                item.children = backTrans(value, item.id)
              } else if (['Object'].includes(getType(value[0])) && value.length === 1) {
                item.children = backTrans(value[0], item.id)
              } else {
                item.value = JSON.stringify(value)
              }
              break
            case 'Object':
              item.children = backTrans(value, item.id)
              break
            // case 'Null':
            // case 'Number':
            // case 'String':
            // case 'Boolean':
            // item.value = value
            // break
            default:
              item.value = value
          }
          res.push(item)
        }
        return res
      }
      return backTrans(JsonData)
    })
  }
}

export { JsonToTableData }
