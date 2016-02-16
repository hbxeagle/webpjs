# webpjs

此插件是针对移动平台做的，考虑到移动平台的特殊性，所以提供两个版本：<br/>
一个是没有lazy效果的webp.js，需要通过手动调用。<br/>
另一个是有lazy效果的webp.lazy.js（基于jquery.lazy.js修改）。<br/>
可视情况选择不同的版本。

## 2016.02.16更新
1、修改目录替换规则，当不配置orgDir和webpDir时，不替换目录，只提换后缀。<br/>
2、修改example中的gulp文件，将webp文件生成至image同目录。

## jquery/zepto webp插件

### 调用方式1：
<code>
  // 简化方式
  $.webp();
</code>
处理所有的有 lsrc 属性，且lsrc属性的目录中包含 images 目录的标签。<br/>
如果是img标签，则赋值src属性，其他类型的标签修改background-image属性。

### 调用方式2:
<code>
  $('.p3').webp();
</code>
查找处理.page.p3 这个dom节点下所有有 lsrc 属性， 且lsrc属性的目录中包含 images 目录的标签。<br/>
处理过程同上。<br/>

### options
#### origSrc 
用于存放图片原文件地址（png,jpg,jpeg,gif)的标签属性，默认为 lsrc
#### origDir 
图片原文件根目录，会替换为webp的根目录，支持自定义配置，默认为空，即不需要替换目录，只替换后缀
#### webpDir 
图片原webp文件目录，支持自定义配置，默认为空，即不需要替换目录，只替换后缀

## 注意1
由于采用lsrc的形式，所以img标签不要设定src属性，防止重复加载。<br/>
对于设置了背景图片的标签，请将css中的background-image单独拎出来注释掉。

## 注意2
由于是采用替换目录的方式修改webp图片的路径，所以必须保证orgDir和webpDir两个目录结构是相同的。<br/>
建议使用gulp之类的工具自动生成文件。example中有具体示例。


