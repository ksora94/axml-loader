# axml-loader
> 针对支付宝小程序 axml 文件的 webpack 加载器，支持SFC（Single File Component）。

## Install
```
    npm i axml-loader --save-dev
```
推荐安装 multi-entry-plugin 自动配置多个entry
```
    npm i multi-entry-plugin --save-dev
```

## SFC(单文件组件)

### Example

```html
<template>
	<view class="container">
		<view class="item"></view>
	</view>
</template>

<script type="application/json">
	{
		"usingComponents": {
			"component1": "/components1"
		}
	}
</script>

<script>
  const app = getApp();

  Page({
    onLoad() {
      console.log('onLoad')
    },

    onShow() {
      console.log('onShow')
    }
  });
</script>

<style>
	.container{
		font-size: 18px;
	}
	.item{
		width: 200Px;
	}
</style>

```

单文件组件分为四部分：模板（template）、配置（config）、js和样式（style），对应原生小程序单一模块的 axml 文件、json 文件、js 文件、acss 文件。

### template

使用 template 标签。

| 原生写法                                               | 简化写法                       |
| ------------------------------------------------------ | ------------------------------ |
| a:if="{{isShow}}"                                      | a-if="isShow"                  |
| a:else                                                 | a-else                         |
| a:elif="{{isShow}}"                                    | a-else-if="isShow"             |
| a:for="{{list}}" a:for-item="item" a:for-index="index" | a-for="(item,  index) in list" |
| a:key="key"                                            | a-key="key"                    |
| attr="{{data}}"                                        | :attr="data"                   |

原生写法可与简化写法同时使用，不受影响。 

```html
<template>
	<view class="container">
		<view class="item" a-if="value > 3">
			>3
		</view>
		<view class="item" a-else-if="value > 2">
			>2
		</view>
		<view class="item" a-else="value > 1">
			>1
		</view>
		<view class="item" a-for="(item, index) in list" a-key="*this">
			{{index}} -> {{item}}
		</view>
	</view>
</template>
```

### config

使用带  type="application/json" 属性的 script 标签，或使用 config 标签。

```html
<config>
	{
		"usingComponents": {
			"component1": "/components1"
		}
	}
</config>
```

### js

使用 script 标签，支持使用 src 属性引入文件，此时会忽略标签中的 js 代码。

```html
<script src="./index.js">
  const app = getApp();

  Page({
    onLoad() {
      console.log('onLoad')
    },

    onShow() {
      console.log('onShow')
    }
  });
</script>
```

### style

使用 style 标签，支持使用 sass 和 less 等语法，需要手动安装对应语法的 loader。支持使用 src 属性引入文件。

```html
<style lang='sass'>
	.container{
		font-size: 18px;
    .item{
      width: 200Px;
    }
	}
</style>
```

```html
<style lang='sass' src="./style.scss"></style>
```



