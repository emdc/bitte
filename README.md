# bitte

Simple client- and server-side JavaScript library

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)
[![Travis CI]](https://travis-ci.org/emdc/bitte.svg?branch=master)

## Installation

`npm i bitte`

## Features

* Simple init and using
* No dependencies
* Browser-ready without build-system (add-and-use)

## Examples

Two examples you may see in `./examples/` folder. It is two .html files with simple case - several properties, which must be localized.

For example:

```javascript
var Bitte = require('bitte') // or link script before this code

// ...

var bitte = new Bitte()
bite.add(localeName, propertiesObjct)
var value = bitte.get(propertyName, localeName)
```

In `.add` method you can transfer object, where key is property and value is localized string:

`bitte.add('en-US', { title: 'Localization example' })`

Or you may transfer array of objects: 

```
bitte.add([
  {
    locale: 'en-US',
    data: {
      title: 'Localization example'
    }
  }
])
```

## License 

[MIT](https://github.com/emdc/bitte/blob/master/LICENSE)
