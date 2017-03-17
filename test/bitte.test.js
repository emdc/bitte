var assert = require('assert')
var Bitte = require('../')

describe('Bitte package', function () {
  describe('Create object', function () {
    it('Create object with no translation', function() {
      var bitte = new Bitte()
      assert.equal(undefined, bitte._currentLocale)

      assert.deepEqual({}, bitte._get)
    })

    it('Error, when create object with translation. but without locale', function() {
      var exceptionWasFound = false

      try {
        var bitte = new Bitte().add(null, { test: 'value'})
      } catch (e) {
        exceptionWasFound = true
      }
      
      assert.ok(exceptionWasFound)
    })

    it('Create object with translate', function() {
      var bitte = new Bitte().add('en-US', { test: 'value' })
      assert.equal('en-US', bitte._currentLocale)
      assert.equal('value', bitte._get['en-US'].test)
    })

    it('Create object with multiple translations', function () {
      var bitte = new Bitte().add([
        { locale: 'en-US', data: { test: 'value one' } },
        { locale: 'de-DE', data: { test: 'value two' } }
      ])

      assert.equal('value one', bitte._get['en-US'].test)
      assert.equal('value two', bitte._get['de-DE'].test)
    })
  })

  describe('Setter', function () {
    it('Successful setting of the property for default locale', function () {
      var bitte = new Bitte().add('en-US', { })
      bitte.set('key', 'value')

      assert.equal('value', bitte._get['en-US']['key'])
    })

    it('Error when setting property for undefined default locale', function () {
      var bitte = new Bitte()
      var exceptionWasFound = false

      try {
        bitte.set('key', 'value')
      } catch (e) {
        exceptionWasFound = true
      }
      
      assert.ok(exceptionWasFound)
    })

    it('Successful setting of the property for some locale, if it exist', function () {
      var bitte = new Bitte().add('en-US', { })

      try {
        bitte.set('key', 'value', 'en-US')
      } catch (e) {
        assert.ok(false)
      }
      assert.equal('value', bitte._get['en-US']['key'])
    })

    it('Error when setting of the property for some locale, but it not exist', function () {
      var bitte = new Bitte().add('en-US', { })
      var exceptionWasFound = false

      try {
        bitte.set('key', 'value', 'ru-RU')
      } catch (e) {
        exceptionWasFound = true
      }
      assert.ok(exceptionWasFound)
    })

    it('Error when setting property with no-string type', function () {
      var bitte = new Bitte().add('en-US', { })
      var exceptionWasFound = false

      try {
        bitte.set('key', 10, 'en-US')
      } catch (e) {
        exceptionWasFound = true
      }
      assert.ok(exceptionWasFound)
    })
  })

  describe('Getter', function () {
    it('Successful getting property from default locale', function () {
      var bitte = new Bitte().add('en-US', { key: 'value' })
      assert.equal('value', bitte.get('key'))
    })

    it('Error when getting property with incorrect name', function () {
      var bitte = new Bitte('en-US', { })
      var undefinedFound = false
      var nullFound = false
      var nanFound = false
      var numberFound = false
      var objectFound = false

      try {
        var value = bitte.get()
      } catch (e) {
        undefinedFound = true
      }

      try {
        var value = bitte.get(null)
      } catch (e) {
        nullFound = true
      }

      try {
        var value = bitte.get(NaN)
      } catch (e) {
        nanFound = true
      }

      try {
        var value = bitte.get(10)
      } catch (e) {
        numberFound = true
      }

      try {
        var value = bitte.get({ prop: 10 })
      } catch (e) {
        objectFound = true
      }

      assert.ok(undefinedFound && nullFound && nanFound && numberFound && objectFound)
    })

    it('Error when no property in trnaslation', function () {
      var bitte = new Bitte().add('en-US', { key: 'value' })
      var exceptionWasFound = false
      try {
        var value = bitte.get('prop')
      } catch (e) {
        exceptionWasFound = true
      }
      assert.ok(exceptionWasFound)
    })

    it('Error when no default translation', function () {
      var bitte = new Bitte()
      var exceptionWasFound = false
      try {
        var value = bitte.get('prop')
      } catch (e) {
        exceptionWasFound = true
      }
      assert.ok(exceptionWasFound)
    })

    it('Error when no translation', function () {
      var bitte = new Bitte().add('en-US', { key: 'value' })
      var exceptionWasFound = false

      try {
        var value = bitte.get('prop', 'ru-RU')
      } catch (e) {
        exceptionWasFound = true
      }
      assert.ok(exceptionWasFound)
    })
  })

  describe('Add new translation', function() {
    it('Add incorrect translation gives error', function () {
      var bitte = new Bitte()
      var exceptionWasFound = false
      try {
        bitte.add('en-US', 'value')
      } catch (e) {
        exceptionWasFound = true
      }
      assert.ok(exceptionWasFound)
    })

    it('Add translation with inclorrect locale gives error', function () {
      var bitte = new Bitte()
      var exceptionWasFound = false
      try {
        bitte.add('en-US', 'value')
      } catch (e) {
        exceptionWasFound = true
      }
      assert.ok(exceptionWasFound)
    })

    it('Correctly add translations array', function () {
      var bitte = new Bitte().add([ {locale: 'en-US', data: {}}, {locale: 'ru-RU', data: {}}])
      assert.deepEqual(['en-US', 'ru-RU'], Object.keys(bitte._get))
    })

    it('Add empty translation', function () {
      var bitte = new Bitte().add('en-US')
      assert.deepEqual({}, bitte._get['en-US'])
    })

    it('Add invalid locale name make error', function () {
      var bitte = new Bitte()
      var exceptionWasFound = false
      try {
        bitte.add(10)
      } catch (e) {
        exceptionWasFound = true
      }
      assert.ok(exceptionWasFound)
    })

    it('Add invalid translation data in array make error', function () {
      var exceptionWasFound = false
      try {
        var bitte = new Bitte().add([ {locale: 'en-US', data: {}}, {locale: 'ru-RU', data: 15}])
      } catch (e) {
        exceptionWasFound = true
      }
      assert.ok(exceptionWasFound)
    })

    it('Add invalid translation data in array make error', function () {
      var exceptionWasFound = false
      try {
        var bitte = new Bitte().add([ {locale: 'en-US', data: {}}, {locale: 23, data: {}}])
      } catch (e) {
        exceptionWasFound = true
      }
      assert.ok(exceptionWasFound)
    })
  })

  describe('Set current locale', function () {
    it('Default current locale is undefined', function () {
      var bitte = new Bitte()
      assert.equal(undefined, bitte._currentLocale)
    })

    it('Current locale after add translations is the first added locale', function () {
      var bitte = new Bitte().add([ {locale: 'en-US', data: {}}, {locale: 'ru-RU', data: {}}])
      assert.equal('en-US', bitte._currentLocale)
    })

    it('Correctly setting current locale if it exist', function () {
      var bitte = new Bitte().add([ {locale: 'en-US', data: {}}, {locale: 'ru-RU', data: {}}])
      bitte.currentLocale('ru-RU')
      assert.equal('ru-RU', bitte._currentLocale)
    })

    it('Get current locale', function () {
      var bitte = new Bitte().add([ {locale: 'en-US', data: {}}, {locale: 'ru-RU', data: {}}])
      assert.equal('en-US', bitte.currentLocale())
    })

    it('Correct locales list', function () {
      var bitte = new Bitte().add([ {locale: 'en-US', data: {}}, {locale: 'ru-RU', data: {}}])
      assert.deepEqual(['en-US', 'ru-RU'], bitte.locales())
    })

    it('Set an unknown translation as current make error', function () {
      var bitte = new Bitte().add([ {locale: 'en-US', data: {}}, {locale: 'ru-RU', data: {}}])
      var exceptionWasFound = false

      try {
        bitte.currentLocale('de-DE')
      } catch (e) {
        exceptionWasFound = true
      }
      assert.ok(exceptionWasFound)
    })
  })

  var testTranslations = [
    {locale: 'en-US', data: { test: 'value' }}, 
    {locale: 'ru-RU', data: { test: 'prop' }}
  ]
  describe('Auto update registered properties', function () {
    it('Register link', function () {
      var bitte = new Bitte().add(testTranslations)
      var someObject = {}
      bitte.link(someObject, 'test')
      assert.deepEqual([{ item: {}, setter: undefined }], bitte._links['test'])
    })

    it('Update link', function () {
      var bitte = new Bitte().add(testTranslations)
      var someObject = { text: ''}
      bitte.link(someObject, 'test', function(item, value) {
        item.text = value
      })
      bitte.currentLocale('ru-RU')
      assert.equal('prop', someObject.text)
    })

    it('If link is no DOM and no setter for this, throw err', function () {
      var bitte = new Bitte().add(testTranslations)
      var exceptionWasFound = false
      var someObject = { text: ''}
      bitte.link(someObject, 'test')
      try {
        bitte.currentLocale('ru-RU')
      } catch (e) {
        exceptionWasFound = true
      }
      
      assert.ok(exceptionWasFound)
    })
  })
})
