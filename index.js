(function () {
  Array.isArray = Array.isArray ? Array.isArray : function (arg) { return Object.prototype.toString.call(arg) === '[object Array]' }

  var Bitte = function () {
    this._get = {}
    this._currentLocale = undefined
    this._links = {}
  }

  Bitte.prototype.add = function () {
    var localeName
    var translation

    if (arguments.length === 1) {
      if (Array.isArray(arguments[0])) {
        var scope = this
        arguments[0].forEach(function (translationObj) {
          if (!translationObj.locale || typeof translationObj.locale !== 'string') throw new Error('Invalid locale name')
          if (typeof translationObj.data !== 'object') throw new Error('Invalid translation object')
          scope._get[translationObj.locale] = translationObj.data
        })
      } else {
        localeName = arguments[0]
        translation = arguments[1]
        if (typeof localeName !== 'string') throw new Error('Incorrect locale name')
        this._get[localeName] = translation || {}
      }
    } else if (arguments.length === 2) {
      localeName = arguments[0]
      translation = arguments[1]
      if (!localeName || typeof localeName !== 'string') throw new Error('Invalid locale name')
      if (typeof translation !== 'object') throw new Error('Invalid translation object')
      this._get[localeName] = translation
    }

    if (!this._currentLocale) {
      var localesList = Object.keys(this._get)
      if (localesList.length) {
        this._currentLocale = localesList[0]
      }
    }

    return this
  }

  Bitte.prototype.set = function (property, value, localeName) {
    localeName = localeName || this._currentLocale
    if (!localeName) throw new Error('Undefined or incorrect locale name')
    if (!this._get[localeName]) throw new Error('No stored locale "' + localeName + '" for setting property')
    if (typeof value !== 'string') throw new Error('Set property value from no string type')
    this._get[localeName][property] = value
  }

  Bitte.prototype.get = function (property, localeName) {
    if (!property) throw new Error('No property or it\'s invalid.')
    localeName = localeName || this._currentLocale
    if (!localeName) throw new Error('Undefined or incorrect locale name')

    if (this._get[localeName]) {
      if (this._get[localeName][property]) {
        return this._get[localeName][property]
      } else {
        throw new Error('Can\'t find property "' + property + '" for locale "' + localeName + '".')
      }
    } else {
      throw new Error('No translation "' + localeName + '" in storage.')
    }
  }

  Bitte.prototype.locales = function () {
    return Object.keys(this._get)
  }

  Bitte.prototype.currentLocale = function (locale) {
    if (locale) {
      if (!this._get[locale]) throw new Error('No locale with name "' + locale + '"')
      this._currentLocale = locale
      if (Object.keys(this._links).length) this._updateLinks()
    } else {
      return this._currentLocale
    }
  }

  Bitte.prototype.link = function (item, property, setter) {
    this._links[property] = this._links[property] || []
    this._links[property].push({ item: item, setter: setter })
  }

  Bitte.prototype._updateLinks = function () {
    var scope = this
    Object.keys(scope._links).forEach(function (prop) {
      if (scope._links[prop]) {
        scope._links[prop].forEach(function (link) {
          if (link.setter) {
            link.setter(link.item, scope.get(prop))
          } else {
            if (window) {
              link.item.textContent = scope.get(prop)
            } else {
              throw new Error('Can\'t apply changes to item because there is no setter function')
            }
          }
        })
      }
    })
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Bitte
  } else {
    window.Bitte = Bitte
  }
})()
