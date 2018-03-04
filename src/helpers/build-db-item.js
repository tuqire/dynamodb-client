const buildDbItem = (item, schema) =>
  Object.keys(item).reduce((acc, key) => ({
    ...acc,
    [key]: {
      [typeof schema[key] === 'string' ? schema[key] : schema[key].type]:
        typeof schema[key] === 'string' ? item[key] : buildDbItem(item[key], schema[key].schema)
    }
  }), {})

export default buildDbItem
