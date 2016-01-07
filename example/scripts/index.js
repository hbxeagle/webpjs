(function() {
  
  /* --- webp start--- */
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
   * });
   * 查找处理 .page.p3 这个dom节点下所有有 lsrc 属性，且lsrc属性的目录中包含 images 目录的标签。
   * 处理过程同上。
   *
   * 注意：由于采用lsrc的形式，所以img标签不要设定src属性，防止重复加载。
   * 对于设置了背景图片的标签，请将css中的background-image单独拎出来注释掉。
   */

  
  $.webp();
  

  /* --- webp end--- */
  

})();
