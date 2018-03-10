const buildDbItem = (item, schema) =>
  Object.keys(item).reduce((acc, key) => {
    let value

    switch (schema[key]) {
      case 'N':
        value = `${item[key]}`
        break

      default:
        value = item[key]
    }

    return {
      ...acc,
      [key]: {
        [typeof schema[key] === 'object' ? schema[key].type : schema[key]]:
          typeof schema[key] === 'object' ? buildDbItem(item[key], schema[key].schema) : value
      }
    }
  }, {})

export default buildDbItem
