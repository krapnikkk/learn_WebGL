# WebGL_Programming_Guide

- [WebGL_Programming_Guide](#webgl_programming_guide)
  - [WebGL入门](#webgl入门)
  - [绘制和变换三角形](#绘制和变换三角形)
  - [高级变换与动画基础](#高级变换与动画基础)
  - [颜色与纹理](#颜色与纹理)
  - [进入三维世界](#进入三维世界)
  - [光照原理](#光照原理)
  - [层次模型](#层次模型)
  - [高级技术](#高级技术)
## WebGL入门

| 标题                                           | 简介                                         | 预览                                                         |
| ---------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| [清空绘图区](./01_HelloCanvas/main.js)         | 使用gl.clear清空绘图区                       | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/01_HelloCanvas/) |
| [绘制一个点v1](./02_HelloPoint1/main.js)       | 使用gl.drawArrays和gl.POINTS绘制一个点       | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/02_HelloPoint1/) |
| [绘制一个点v2](./03_HelloPoint2/main.js)       | 使用vertexAttrib1f设置gl_PointSize绘制一个点 | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/03_HelloPoint2/) |
| [通过鼠标点击绘点](./04_ClickedPoints/main.js) | 使用vertexAttrib3f设置gl_Position绘制多个点  | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/04_ClickedPoints/) |
| [改变点的颜色](./05_ColoredPoints/main.js)     | 使用uniform4f设置gl_FragColor改变点的颜色    | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/05_ColoredPoints/) |



## 绘制和变换三角形

| 标题                                                         | 简介                                             | 预览                                                         |
| ------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------ |
| [绘制多个点](./06_MultiPoints/main.js)                       | 使用缓冲区对象绘制多个点                         | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/06_MultiPoints/) |
| [绘制三角形](./07_HelloTriangle/main.js)                     | 使用gl.drawArrays和gl.TRIANGLES绘制一个三角形    | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/07_HelloTriangle/) |
| [绘制矩形](./08_HelloRectangle/main.js)                      | 使用gl.drawArrays和gl.TRIANGLE_STRIP绘制一个矩形 | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/08_HelloRectangle/) |
| [移动图形](./09_TranslatedTriangle/main.js)                  | glsl中点位置相加移动图形                         | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/09_TranslatedTriangle/) |
| [旋转图形](./10_RotatedTriangle/main.js)                     | glsl中通过三角函数旋转图形                       | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/10_RotatedTriangle/) |
| [使用变换矩阵旋转图形](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/11_RotatedTriangle_Matrix/) | glsl中通过旋转变换矩阵旋转图形                   | [查看](./11_RotatedTriangle_Matrix/main.js)                  |
| [使用变换矩阵移动图形](./12_TranslateTriangle_Matrix/main.js) | glsl中通过平移变换矩阵移动图形                   | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/12_TranslateTriangle_Matrix/) |
| [使用变换矩阵缩放图形](./13_ScaledTriangle_Matrix/main.js)   | glsl中通过缩放变换矩阵缩放图形                   | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/13_ScaledTriangle_Matrix/) |



## 高级变换与动画基础

| 标题                                                         | 简介                              | 预览                                                         |
| ------------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------ |
| [使用Matrix4库变换矩阵旋转图形](./14_RotatedTriangle_Matrix4/main.js) | 使用线代计算变换矩阵区变换图形    | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/14_RotatedTriangle_Matrix4/) |
| [使用Matrix4库复合变换矩阵旋转&移动图形](./15_RotatedTranslatedTriangle/main.js) | 使用计算好的modelMatrix变换图形   | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/15_RotatedTranslatedTriangle/) |
| [旋转变换图形动画](./16_RotatingTriangle/main.js)            | 使用requestAnimationFrame更新图形 | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/16_RotatingTriangle/) |

 

## 颜色与纹理

| 标题                                                         | 简介                                                  | 预览                                                         |
| ------------------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| [创建多个缓冲区对象](./17_MultiAttributeSize/main.js)        | 创建多个缓冲区对象设置glsl                            | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/17_MultiAttributeSize/) |
| [gl.vertexAttribPointer的步进和偏移参数](./18_MultiAttributeSize_Interleaved/main.js) | 使用gl.vertexAttribPointer按步进和偏移设置参数        | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/18_MultiAttributeSize_Interleaved/) |
| [将顶点着色器中的数据传递到片元着色器](./19_MultiAttributeColor/main.js) | 使用varying内置限定符将顶点着色器向片元着色器传递数据 | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/19_MultiAttributeColor/) |
| [片元着色器的颜色内插](./20_ColoredTriangle/main.js)         | 使用varying变量触发的颜色内插过程                     | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/20_ColoredTriangle/) |
| [片元着色器的颜色编程指定](./23_HelloTriangle_FragCoord/main.js) | 对gl_FragColor在glsl中进行颜色编程指定                | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/23_HelloTriangle_FragCoord/) |
| [使用WebGLTexture对象](./22_TexturedQuad/main.js)            | 使用gl.TEXTURE_2D设置图片纹理                         | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/24_TexturedQuad/) |
| [修改纹理平铺方式1](./23_TexturedQuad_Repeat/main.js)        | 使用gl.textParameteri设置纹理的平铺方式【纵横平铺】   | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/23_TexturedQuad_Repeat/) |
| [修改纹理平铺方式2](./24_TexturedQuad_Clamp_Mirror/main.js)  | 使用gl.textParameteri设置纹理的平铺方式【拉伸镜像】   | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/24_TexturedQuad_Clamp_Mirror/) |
| [多幅纹理混合绘制](./25_MultiTexture/main.js)                | 使用uniform1i设置纹理不同的绘制纹理单元               | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/25_MultiTexture/) |



## 进入三维世界

| 标题                                                         | 简介                                                 | 预览                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------ |
| [三维世界的深度](./26_LookAtTriangles/main.js)               | 通过设置不同的z分量呈现图形的深度关系                | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/26_LookAtTriangles/) |
| [从指定视点观察旋转后的三角形](./27_LookAtRotatedTriangles/main.js) | 使用计算好的viewMatrix变换图形                       | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/27_LookAtRotatedTriangles/) |
| [模型视图矩阵](./28_LookAtRotatedTriangles_mvMatrix/main.js) | 使用modelViewMatrix变换图形                          | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/28_LookAtRotatedTriangles_mvMatrix/) |
| [使用键盘控制视点](./29_LookAtRotatedTrianglesWithKeys/main.js) | 使用键盘控制viewMatrix变换图形                       | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/29_LookAtRotatedTrianglesWithKeys/) |
| [正交投影可视空间](./30_orthoView/main.js)                   | 使用正交投影矩阵观察图形                             | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/30_orthoView/) |
| [增大正交投影可视区域](./31_LookAtRotatedTrianglesWithKeys_ViewVolume/main.js) | 使用viewMartix调整正交投影可视区域                   | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/31_LookAtRotatedTrianglesWithKeys_ViewVolume/) |
| [透视投影可视空间](./32_PerspectiveView/main.js)             | 使用透视投影矩阵观察图形                             | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/32_PerspectiveView/) |
| [模型矩阵、视图矩阵和投影矩阵](./33_PerspectiveView_mvp/main.js) | 使用modelMatrix、viewModel和projModel矩阵变换图形    | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/33_PerspectiveView_mvp/) |
| [模型视图投影矩阵](./34_PerspectiveView_mvpMatrix/main.js)   | 使用mvpMatrix矩阵变换图形                            | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/34_PerspectiveView_mvpMatrix/) |
| [隐藏面消除](./35_DepthBuffer/main.js)                       | 开启gl.DEPTH_TEST消除被遮挡的表面                    | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/35_DepthBuffer/) |
| [解决深度冲突](./36_Zfighting/main.js)                       | 使用多边形偏移去解决Z分量相同导致的深度冲突          | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/36_Zfighting/) |
| [绘制立方体](./37_HelloCube/main.js)                         | 使用drawElements根据顶点索引绘制立方体               | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/37_HelloCube/) |
| [绘制多颜色立方体](./38_ColoredCube/main.js)                 | 使用drawElements结合不重复的顶点索引构成的面绘制颜色 | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/38_ColoredCube/) |
| [绘制纯白色立方体](./39_ColoredCube_singleColor/main.js)     | 使用drawElements根据顶点索引绘制纯白色立方体         | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/39_ColoredCube_singleColor/) |

## 光照原理
| 标题                                                         | 简介                                             | 预览                                                         |
| :----------------------------------------------------------- | :----------------------------------------------- | ------------------------------------------------------------ |
| [环境光下的漫反射](./40_LightedCube/main.js)                 | 使用光照原理模拟环境光下的漫反射                 | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/40_LightedCube/) |
| [环境光下的漫反射和环境反射光线](./41_LightedCube_ambient/main.js) | 使用漫反射和环境反射叠加模拟真实光照             | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/41_LightedCube_ambient/) |
| [变换后物体的光照](./42_LightedTranslatedRotatedCube/main.js) | 使用模型矩阵的逆转置矩阵计算变换后的法向量       | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/42_LightedTranslatedRotatedCube/) |
| [点光源光下的立方体(逐顶点计算)](./43_PointLightedCube/main.js) | 使用光源位置计算光线方向来模拟点光源下的光照效果 | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/43_PointLightedCube/) |
| [点光源光下的立方体(逐片元计算)](./44_PointLightedSphere_perFragment/main.js) | 在片元着色器中计算光照效果【优化内插过程效果】   | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/44_PointLightedSphere_perFragment/) |


## 层次模型
| 标题                                                         | 简介                                        |                             预览                             |
| :----------------------------------------------------------- | :------------------------------------------ | :----------------------------------------------------------: |
| [单关节模型](./45_JointMode/main.js)                         | 利用modelMatrix重复设置不同属性绘制层次模型 | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/45_JointMode/) |
| [多关节模型](./52_MultiJointMode/main.js)                    | 利用栈存储modelMartix更新多个节点模型的部件 | [查看](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/46_MultiJointMode/) |
| [分段绘制部件模型](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/53_MultiJointModel_segment/) |                                             |         [查看](./53_MultiJointModel_segment/main.js)         |


## 高级技术
| 标题                                                         | 简介 |                    预览                     |
| :----------------------------------------------------------- | :--: | :-----------------------------------------: |
| [通过鼠标旋转立方体](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/54_RotateObject/) |      |      [查看](./54_RotateObject/main.js)      |
| [像素校验立方体是否被点击到](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/55_PickObject/) |      |       [查看](./55_PickObject/main.js)       |
| [利用a分量标记表面编号比对立方体是否被点击到](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/56_PickFace/) |      |        [查看](./56_PickFace/main.js)        |
| [平视显示器（Head up display）](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/57_HeadUpDisplay/) |      |     [查看](./57_HeadUpDisplay/main.js)      |
| [在网页上方显示三维物体](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/58_3DoverWeb/) |      |       [查看](./58_3DoverWeb/main.js)        |
| [线性雾化](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/59_Fog/) |      |          [查看](./59_Fog/main.js)           |
| [线性雾化（使用视图坐标系的负z值来近似顶点和视点的距离）](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/60_Fog_w/) |      |         [查看](./60_Fog_w/main.js)          |
| [使用discard绘制圆](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/61_RoundPoint/) |      |       [查看](./61_RoundPoint/main.js)       |
| [使用混合功能实现半透明效果](https://krapnikkk.github.io/learn_WebGL/Books/WebGL_Programming_Guide/62_LookAtBlendedTriangles/) |      | [查看](./62_LookAtBlendedTriangles/main.js) |


