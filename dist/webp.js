"use strict";

/**
   * webp插件
   * 调用方式1：
   * $.webp();
   * 处理所有的有 lsrc 属性，且lsrc属性的目录中包含 images 目录的标签。
   * 如果是img标签，则赋值src属性，其他类型的标签修改background-image属性。
   *
   * 调用方式2:
   * $('.p3').webp({
   *   origSrc: "lsrc", // 用于存放图片原文件地址（png,jpg,jpeg,gif)的标签属性
   *   origDir: "images",// 图片原文件根目录，会替换为webp的根目录
   *   webpDir: "webps"// 图片原webp文件目录
   *
   }); * 查找处理.page.p3 这个dom节点下所有有 lsrc 属性， 且lsrc属性的目录中包含 images 目录的标签。

   * 处理过程同上。
   *
   * 注意：由于采用lsrc的形式，所以img标签不要设定src属性，防止重复加载。
   * 对于设置了背景图片的标签，请将css中的background-image单独拎出来注释掉。
   */

(function (window, $) {

  var __supportwebp = false;

  var __checked = false;

  var supportWebp = function supportWebp(callback) {

    if (__checked) {
      callback();
      return;
    }

    (function () {
      var webp = new Image();
      webp.onload = webp.onerror = function () {
        __checked = true;
        __supportwebp = webp.height === 2;
        webp.onload = webp.onerror = null;
        webp = null;
        callback();
      };
      //高度为2的一个webp图片
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    })();
  };

  $.fn.webp = function (options) {

    var elements = this;

    var settings = {
      origSrc: "lsrc",
      origDir: "",
      webpDir: ""
    };

    /**
     * 先对elements进行处理，找到所以包含 origSrc 的子元素。
     */
    function adjust() {

      var _elements = undefined;

      elements.each(function () {
        var $this = $(this),
            _tmp = undefined;
        if (settings.skip_invisible && !$this.is(":visible")) {
          return;
        }

        var original = $this.attr(settings.origSrc);

        // 如果当前对象没有origSrc属性，同时当前对象不是图片节点，
        // 则查找子节点中有origSrc属性的节点，进行webp处理
        if (!original) {
          _tmp = $this.find("[" + settings.origSrc + "*=" + settings.origDir + "]");
        } else {
          _tmp = $this;
        }

        if (_elements && _elements.length > 0) {
          if ($.merge) {
            // jquery merge
            _elements = $.merge(_elements, _tmp);
          } else {
            // zepto merge
            _elements.concat(_tmp);
          }
        } else {
          _elements = _tmp;
        }
      });

      elements = _elements;
    }

    adjust();

    function update() {

      elements.each(function () {
        $(this).trigger("appear");
      });
    }

    if (options) {
      $.extend(settings, options);
    }
    if (options.origDir && !options.webpDir) {
      throw new Error('option webpDir undefined!');
    }

    elements.each(function () {
      var self = this;
      var $self = $(self);

      self.loaded = false;

      /* 触发appear事件时，控制替换或直接显示原图片 */
      $self.one("appear", function () {

        if (!this.loaded) {
          (function () {

            var original = $self.attr(settings.origSrc);

            // 替换webp目录和图片后缀
            if (__supportwebp) {
              original = original.replace(settings.origDir, settings.webpDir).replace(/\.(jpg|png|jpeg|gif)$/ig, '.webp');
            }

            $("<img />").bind("load", function () {

              if ($self.is("img")) {
                // 如果当前节点是图片，则赋值src属性
                $self.attr("src", original);
              } else {
                // 如果当前节点不是图片，则赋值background-image属性
                $self.css("background-image", "url('" + original + "')");
              }

              self.loaded = true;

              /* Remove image from array so it is not looped next time. */
              var temp = $.grep(elements, function (element) {
                return !element.loaded;
              });
              elements = $(temp);
            }).attr("src", original);
          })();
        }
      });
    });

    supportWebp(function () {
      update();
    });

    return this;
  };

  $.extend($, {
    webp: function webp(options) {
      $(document).ready(function () {
        $(document).webp(options);
      });
    }
  });
})(window, $);