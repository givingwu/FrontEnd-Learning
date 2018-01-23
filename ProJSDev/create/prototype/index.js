
function Field (type, displayText) {
  this.type = type
  this.displayText = displayText
}

Field.prototype.getElement = function (type, displayText) {
  var field = document.createElement('input')

  field.setAttribute('type', this.type || type)
  field.setAttribute('placeholder', this.displayText || displayText)

  return field
}

var textField = new Field('text', 'Enter the first line of your address'),
emailField = new Field('email', 'Enter your email address')

window.addEventListener('load', function () {
  var button = document.createElement('button')
  button.innerHTML = 'Submit'

  var form = document.createElement('form')
  form.id = "prototype-pattern-form"

  form.appendChild(textField.getElement())
  form.appendChild(emailField.getElement())
  form.appendChild(button)
  document.body.appendChild(form)
}, false)


// ECMAScript5
/**
 * Object.create(proto[, propertiesObject])
 * @description The Object.create() method creates a new object with the specified prototype object and properties.
 * @param {Object}    proto       The object which should be the prototype of the newly-created object.
 * @param {Object}    properties  Optional
 * @return {object}
 */

var field = {
  type: '',
  displayText: '',
  getElement () {
    return Field.prototype.getElement.call(this, this.type, this.displayText)
  }
}, textField1 = Object.create(field, {
  type: {
    value: 'text',
    enumerable: true
  },
  displayText: {
    value: 'Enter the first line of your address',
    enumerable: true
  }
}), emailField1 = Object.create(field, {
  type: {
    value: 'email',
    enumerable: true
  },
  displayText: {
    value: 'Enter your email address',
    enumerable: true
  }
})

window.addEventListener('load', function () {
  var button = document.createElement('button')
  button.innerHTML = 'Submit'

  var form = document.createElement('form')
  form.id = "ECMAScript5-pattern-form"

  form.appendChild(textField1.getElement())
  form.appendChild(emailField1.getElement())
  form.appendChild(button)
  document.body.appendChild(form)
}, false)

