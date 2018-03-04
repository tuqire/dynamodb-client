# DynamoDB Client

A lightweight JS / Node DynamoDB client which uses the `AWS SDK`, but abstracts out some of its complexities. Also replaces callbacks with promises.

**NOTE:** This lib is still in it's early stages. Only a few of the `DynamoDB` methods have been abstracted out. All the original methods are available on the `this.DynamoDB` attribute.

## How it Works

The `DynamoTable` class takes the following data on initialisation:

1. `tableName`: The table name.
2. `schema`: Schema according to `DynamoDB` requirements. [read more](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html)
3. `primaryKey`: The primary key of the table.

```js
import { setAwsConfig, DynamoTable } from 'dynamodb-client'

setAwsConfig({
  accessKeyId,
  secretAccessKey,
  region
})

const table = new DynamoTable({
  tableName = 'MyTable',
  schema = {
    myPrimaryKey: 'S',
    myString: 'S',
    myStringSet: 'SS',
    map: {
      type: 'M',
      schema: {
        mySubString: 'S',
        mySubBoolean: 'B'
      }
    }
  },
  primaryKey = 'myPrimaryKey'
})

const testLib = async () => {
  await table.add({
    myPrimaryKey: '3',
    myString: 'val',
    myStringSet: ['val1', 'val2', 'val3']
  })

  await table.get(itemId)

  await table.update(itemId, {
    myString: 'newVal',
    myStringSet: 'newVal'
  })

  await table.delete(itemId)
}
```

The library also exports two methods which help in the construction and deconstruction of  traditional JS objects into `DynamoDB` valid object.

1. `buildDBItem(item, schema)`: converts `item` into an object which is understood by DynamoDB API in relation to the `schema` [read more](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html)
2. `parseDBItem(Item, schema)`: transform `Item` from DynamoDB API returned object into a traditional object in relation to the `schema` [read more](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html)

```js
import { buildDBItem, parseDBItem } from 'dynamodb-client'

const schema =

const item = {
  myString: 'string'
  myBool: false,
  myStringSet: ['str', 'str2', 'str3'],
  myMap: {
    subString: 'string'
  }
}

const transformedItem = buildDBItem(item)

/**
transformedItem === {
  myString: { S: 'string' },
  myBool: { B: false },
  myStringSet: { SS: ['str', 'str2', 'str3'] },
  myMap: {
    M: {
      subString: { S: 'string' }
    }
  }
}
**/

const convertedItem = parseDBItem(transformedItem)

/**
convertedItem === item
**/
```

## Todo

1. Add unit tests.
2. Convert more methods from DynamoDB SDK.
3. Register dynamoDB in a cleaner way.

## Contributors

* Tuqire Hussain <me@tuqire.com>
