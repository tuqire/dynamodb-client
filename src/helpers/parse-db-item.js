const parseDbItem = (item, schema) =>
  Object.keys(item).reduce((acc, key) => ({
    ...acc,
    [key]: typeof schema[key] === 'string'
      ? item[key][schema[key]]
      : parseDbItem(item[key][schema[key].type], schema[key].schema)
  }), {})

export default parseDbItem
