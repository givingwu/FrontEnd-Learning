var FormFieldFactory = {
  /**
   * [makeField description]
   * @param    {[type]}                 options [description]
   * @return   {[type]}                 [description]
   */
  makeField: function (options) {
    options = options || {}
    var type = options.type || 'text',
      displayText = options.displayText || '',
      field;

    switch (type) {
      case "text":
        field = new TextField(displayText);
        break;
      case "email":
        field = new EmailField(displayText);
        break;
      case "button":
        field = new ButtonField(displayText);
        break;

      default:
        file = new TextField(displayText);
        break;
    }

    return field
  }
}

function TextField(displayText) {
  this.displayText = displayText
}

TextField.prototype.getElement = function () {
  var textField = document.createElement('input');
  textField.setAttribute('type', 'text')
  textField.setAttribute('placeholder', this.displayText)

  return textField
}

function EmailField(displayText) {
  this.displayText = displayText
}

EmailField.prototype.getElement = function () {
  var emailField = document.createElement('input');
  emailField.setAttribute('type', 'email')
  emailField.setAttribute('placeholder', this.displayText)

  return emailField
}

function ButtonField(displayText) {
  this.displayText = displayText
}

ButtonField.prototype.getElement  = function () {
  var button = document.createElement('button')
  button.setAttribute('type', 'submit')
  button.innerHTML = this.displayText

  return button
}
// console.log(textField.getElement(), emailField.getElement(), buttonField.getElement())

// use factory pattern to create a form element
window.addEventListener('load', function () {
  var textField = FormFieldFactory.makeField({
      type: 'text',
      displayText: 'Enter the first line of your address'
    }),
    emailField = FormFieldFactory.makeField({
      type: 'email',
      displayText: 'Enter your email address'
    }),
    buttonField = FormFieldFactory.makeField({
      type: 'button',
      displayText: 'Submit'
    })

  var form = document.createElement('form')
  form.appendChild(textField.getElement())
  form.appendChild(emailField.getElement())
  form.appendChild(buttonField.getElement())

  document.body.appendChild(form)
}, false)
