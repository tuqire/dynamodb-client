import { DynamoDB } from './setup'
import { buildDBItem, parseDBItem } from './helpers'

export default class DynamoTable {
  constructor ({
    tableName = '',
    schema = {},
    primaryKey = ''
  }) {
    if (!DynamoDB) {
      throw new Error('need to call `setAwsConfig` to setup connection. Read readme for more info')
    }

    this.DynamoDB = DynamoDB
    this.tableName = tableName
    this.schema = schema
    this.primaryKey = primaryKey
  }

  setTableName (tableName) {
    if (!tableName) {
      throw new Error('tableName needs to be set')
    }
    this.tableName = tableName

    return this
  }

  setSchema (schema) {
    if (!schema) {
      throw new Error('schema needs to be set')
    }
    this.schema = schema

    return this
  }

  setPrimaryKey (primaryKey) {
    if (!primaryKey) {
      throw new Error('primaryKey needs to be set')
    }
    this.primaryKey = primaryKey

    return this
  }

  add (item, options = {}) {
    const Item = buildDBItem(item, this.schema)

    this.validateInstance()

    return new Promise((resolve, reject) =>
      DynamoDB.putItem({
        TableName: this.tableName,
        ReturnValues: 'NONE',
        Item,
        ...options
      }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    )
  }

  delete (itemId, options = {}) {
    this.validateInstance()

    return new Promise((resolve, reject) =>
      DynamoDB.deleteItem({
        TableName: this.tableName,
        Key: this.buildPrimaryKey(itemId),
        ...options
      }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    )
  }

  get (itemId, options = {}) {
    this.validateInstance()

    return new Promise((resolve, reject) =>
      DynamoDB.getItem({
        TableName: this.tableName,
        Key: this.buildPrimaryKey(itemId),
        ...options
      }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(parseDBItem(res.Item || {}, this.schema))
        }
      })
    )
  }

  update (itemId, item, options = {}) {
    const keys = Object.keys(item)
    const Item = buildDBItem(item, this.schema)
    const keyMap = this.buildKeyMap(keys)
    const updateExpression = this.buildUpdateExpression(keys, keyMap)

    this.validateInstance()

    return new Promise((resolve, reject) =>
      DynamoDB.updateItem({
        TableName: this.tableName,
        Key: this.buildPrimaryKey(itemId),
        ExpressionAttributeNames: keys.reduce((acc, key) => ({
          ...acc,
          [`#${keyMap[key].toUpperCase()}`]: key
        }), {}),
        ExpressionAttributeValues: keys.reduce((acc, key) => ({
          ...acc,
          [`:${keyMap[key]}`]: Item[key]
        }), {}),
        ReturnValues: 'ALL_NEW',
        UpdateExpression: `SET ${updateExpression}`,
        ...options
      }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    )
  }

  validateInstance () {
    if (!this.tableName || !this.schema || !this.primaryKey) {
      throw new Error('tableName, schema, and primaryKey should be set to make requests to DynamoDB')
    } else if (!this.schema[this.primaryKey]) {
      throw new Error('Primary key needs to exist within schema')
    } else {
      return true
    }
  }

  buildPrimaryKey (itemId) {
    return {
      [this.primaryKey]: { [this.schema[this.primaryKey]]: `${itemId}` }
    }
  }

  buildKeyMap (keys) {
    let keyCounter = 96

    return keys.reduce((acc, key) => {
      keyCounter++

      return {
        ...acc,
        [key]: String.fromCharCode(keyCounter).toLowerCase()
      }
    }, {})
  }

  buildUpdateExpression (keys, keyMap) {
    return keys.reduce((acc, key) => {
      acc.push(`#${keyMap[key].toUpperCase()} = :${keyMap[key]}`)

      return acc
    }, []).join(', ')
  }
}
