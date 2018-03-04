import buildDBItem from '@/helpers/build-db-item'

describe('@/helpers/build-db-item', () => {
  describe('Update', () => {
    test('transforms data correctly', () => {
      const item = {
        myString: 'string',
        myBool: false,
        myStringSet: ['str', 'str2', 'str3'],
        myMap: {
          subString: 'string'
        }
      }

      const schema = {
        myString: 'S',
        myBool: 'B',
        myStringSet: 'SS',
        myMap: {
          type: 'M',
          schema: {
            subString: 'S'
          }
        }
      }

      console.log(buildDBItem(item, schema))
    })
  })
})
