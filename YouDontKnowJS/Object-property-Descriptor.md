
# Object-Descriptors

## writable

> writable 是否可修改属性的值

## configurable

> configurable 是否可以使用 Ob=0]'
'[l];
jol;'
-78=990-=\
]ect.def]\  ,0+                                                                     eProperty() 方法修改描述符，是否可删除该属性

** NOTE： 即使属性 `configurable` 为 `false` 我们还是可以修改 `writable` 由 `true` 到 `false`，但是无法由 `false`　 到 `true` **

### enumerable

> enumerable 是否可以迭代该属性。

# Object changeable

## 属性常量

> 属性 `wirtable: false` 和 `configurable: false` 即可。

```
var foo = {}

Object.defineProperty(foo, 'bar', {
  value: 'bar',
  writable: false,
  configuable: false
})
```

## 禁止扩展

> 禁止一个对象添加新属性并且保留已有属性 - `Object.preventExtensions(...)`

```
var foo = {}

Object.preventExtensions(foo)

foo.b = 3
f00.b // undefined
```

## 密封

> 密封之后不能添加新属性，也不能重新配置和删除现有属性（虽然可以修改所有属性的值）。 - `Object.seal()` 会在现有对象上调用 `Object.preventExtensions(...)` 并把现有属性标记为 `configurable: false`


## 冻结

> 创建一个冻结对象 - `Object.freeze(...)` 会在现有对象上调用 `Object.seal(...)` 并把所有数据访问属性标记为 `writable:false`

它是可以应用在对象上级别最高的不可变性，禁止对于对象本身及其任意直接属性的修改。



# Object property check

## 属性存在性检查

### 'key' in obj

> `in` 操作符会检查属性是否存在对象及其 `[[prototype]]` 原型链中

### obj.hasOwnProperty('key')

> `hasOwnProperty` 方法之会检查属性是否存在该对象中，不会检查`[[prototype]]` 原型链

## 枚举

### for ... in ...

> 遍历所有 `enumerable: true` 的属性

### obj.propertyIsEnumerable('key')

> 检查给定属性是否直接存在于该对象中（而不是原型链中）并且属性满足 `enumerable: true`

### Object.keys(obj)

> 返回一个数组，包含所有可枚举属性

### Object.getOwnPropertyNames(obj)

> 返回一个数组，包含所有属性，无论该属性是否可枚举

