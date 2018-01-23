
// 定义一个基础工厂类 用于创建表单域 其他更明确的表单域创建工厂类将继承该类
function FormFieldFactory () {
  this.availableTypes = {
    TEXT: 'text',
    EMAIL: 'email',
    BUTTON: 'button'
  }
}

// 将被子类的多态方式重写 因此该方法不支持直接在父类中被调用 如果被调用则抛出错误
FormFieldFactory.prototype.makeField = {
  makeField: function () {
    throw new Error('This method should not be called directly.')
  }
}

// 定义一个工厂类 继承于基础工厂类FormFieldFactory 用于HTML5表单域的创建
function Html5FormFieldFactory () {}
function Html4FormFieldFactory () {}

Html5FormFieldFactory.prototype = new FormFieldFactory()
Html4FormFieldFactory.prototype = new FormFieldFactory()

console.log(Html5FormFieldFactory, Html4FormFieldFactory)

// 针对此工厂类重写makeField方法
Html5FormFieldFactory.prototype.makeField = function (options) {
  var options = options || {},
    type = options.type || this.availableTypes.TEXT,
    displayText = options.displayText || '', field;

  switch (type) {
    case this.availableTypes.TEXT:
      field = new Html5TextField(displayText);
      break;
    case this.availableTypes.EMAIL:
      field = new Html5EmailField(displayText);
      break;
    case this.availableTypes.BUTTON:
      field = new ButtonField(displayText);
      break;

    default:
      throw new Error('Invalid field type specified: ' + type)
      break;
  }

  return field
}

Html4FormFieldFactory.prototype.makeField = function (options) {
  var options = options || {},
    type = options.type || this.availableTypes.TEXT,
    displayText = options.displayText || '', field;

  switch (type) {
    case this.availableTypes.TEXT:
    case this.availableTypes.EMAIL:
      field = new Html4TextField(displayText);
      break;
    case this.availableTypes.BUTTON:
      field = new ButtonField(displayText);
      break;

    default:
      throw new Error('Invalid field type specified: ' + type)
      break;
  }

  return field
}

function Html5TextField(displayText) {
  this.displayText = displayText
}

Html5TextField.prototype.getElement = function () {
  var textField = document.createElement('input');
  textField.setAttribute('type', 'text')
  textField.setAttribute('placeholder', this.displayText)

  return textField
}


// 因为html4 不支持placeholder标签特性 作为代替我们使用一个div元素当中包含着文本域和相关联的placeholder的文本label
function Html4TextField(displayText) {
  this.displayText = displayText
}

Html4TextField.prototype.getElement = function () {
  var wrapper = document.createElement('div'),
   textField = document.createElement('input'),
   textFieldId = 'text-field' + Math.floor(Math.random() * 999),
   label = document.createElement('label'),
   labelText = document.createTextNode(this.displayText);

  textField.setAttribute('type', 'text')
  textField.setAttribute('id', textFieldId)

  label.setAttribute('for', textFieldId)
  label.appendChild(labelText)

  wrapper.appendChild(textField)
  wrapper.appendChild(label)

  return wrapper
}


function Html5EmailField(displayText) {
  this.displayText = displayText
}

Html5EmailField.prototype.getElement = function () {
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


window.addEventListener('load', function () {
  var supportsHtml5FormFields = (function() {
    var field = document.createElement('input')   // html5
    // var field = document.createElement('form')    // html4
    field.setAttribute('type', 'email')

    // 如果正确返回type 则表明当前表单支持html5属性
    return field.type === 'email'
  }()),
  formFieldFactory = supportsHtml5FormFields ? new Html5FormFieldFactory() : new Html4FormFieldFactory(),
  textField = formFieldFactory.makeField({
    type: 'text',
    displayText: 'Enter the first line of your address'
  }),
  emailField = formFieldFactory.makeField({
    type: 'email',
    displayText: 'Enter your email address'
  }),
  buttonField = formFieldFactory.makeField({
    type: 'button',
    displayText: 'Submit'
  })

  var form = document.createElement('form')
  form.appendChild(textField.getElement())
  form.appendChild(emailField.getElement())
  form.appendChild(buttonField.getElement())

  document.body.appendChild(form)
}, false)

