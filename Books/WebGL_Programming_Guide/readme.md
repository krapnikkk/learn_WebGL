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
  - [Author](#author)
## WebGL入门
| 标题(预览)                                                                                      |                源码                |
| :--------------------- | :---------------------: |
| [清空绘图区](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/01_HelloCanvas/)       |  [查看](./01_HelloCanvas/main.js)  |
| [使用glsl绘制一个点](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/02_HelloPoint1/)       |  [查看](./02_HelloPoint1/main.js)  |
| [动态设置attribute绘制一个点](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/03_HelloPoint2/)       |  [查看](./03_HelloPoint2/main.js)  |
| [通过鼠标点击绘点](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/04_ClickedPoints/) | [查看](./04_ClickedPoints/main.js) |
| [改变点的颜色](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/05_ColoredPoints/)     | [查看](./05_ColoredPoints/main.js) |

[/placeholder]:p

## 绘制和变换三角形
| 标题                                                                                                     |                     详情                      |
| :------------------------------------------------------------------------------------------------------- | :-------------------------------------------: |
| [绘制多个点](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/06_MultiPoints/)                        |       [查看](./06_MultiPoints/main.js)        |
| [绘制三角形](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/07_HelloTriangle/)                      |      [查看](./07_HelloTriangle/main.js)       |
| [绘制矩形](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/08_HelloRectangle/)                       |      [查看](./08_HelloRectangle/main.js)      |
| [移动图形](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/09_TranslatedTriangle/)                   |    [查看](./09_TranslatedTriangle/main.js)    |
| [旋转图形](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/10_RotatedTriangle/)                      |     [查看](./10_RotatedTriangle/main.js)      |
| [使用变换矩阵旋转图形](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/11_RotatedTriangle_Matrix/)   |  [查看](./11_RotatedTriangle_Matrix/main.js)  |
| [使用变换矩阵移动图形](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/12_TranslateTriangle_Matrix/) | [查看](./12_TranslateTriangle_Matrix/main.js) |
| [使用变换矩阵缩放图形](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/13_ScaledTriangle_Matrix/)    |  [查看](./13_ScaledTriangle_Matrix/main.js)   |
| [使用变换矩阵缩放图形](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/13_ScaledTriangle_Matrix/)    |  [查看](./14_ScaledTriangle_Matrix/main.js)   |

[/placeholder]:p

## 高级变换与动画基础
| 标题                                                                                                                        |                       详情                        |
| :-------------------------------------------------------------------------------------------------------------------------- | :-----------------------------------------------: |
| [使用Matrix4库变换矩阵旋转图形](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/14_RotatedTriangle_Matrix4/)            |   [查看](./14_RotatedTriangle_Matrix4/main.js)    |
| [使用Matrix4库复合变换矩阵旋转&移动图形](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/15_RotatedTranslatedTriangle/) |  [查看](./15_RotatedTranslatedTriangle/main.js)   |
| [旋转变换动画](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/16_RotatingTriangle/)                                    |       [查看](./16_RotatingTriangle/main.js)       |
| [复合变换动画](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/17_RotatingTranslatedTriangle/)                          |  [查看](./17_RotatingTranslatedTriangle/main.js)  |
| [可控复合变换动画](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/18_RotatingTriangle_withButtons/)                    | [查看](./18_RotatingTriangle_withButtons/main.js) |

[/placeholder]:p

## 颜色与纹理
| 标题                                                                                                                               |                        详情                         |
| :--------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------: |
| [创建多个缓冲区对象](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/19_MultiAttributeSize/)                                   |       [查看](./19_MultiAttributeSize/main.js)       |
| [gl.vertexAttribPointer的步进和偏移参数](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/20_MultiAttributeSize_Interleaved/) | [查看](./20_MultiAttributeSize_Interleaved/main.js) |
| [将顶点着色器中的数据传递到片元着色器](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/21_MultiAttributeColor/)                |      [查看](./21_MultiAttributeColor/main.js)       |
| [片元着色器的颜色内插](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/22_ColoredTriangle/)                                    |        [查看](./22_ColoredTriangle/main.js)         |
| [片元着色器的颜色编程指定](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/23_HelloTriangle_FragCoord/)                        |    [查看](./23_HelloTriangle_FragCoord/main.js)     |
| [使用WebGLTexture对象](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/24_TexturedQuad/)                                       |          [查看](./24_TexturedQuad/main.js)          |
| [修改纹理坐标](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/25_TexturedQuad_Repeat/)                                        |      [查看](./25_TexturedQuad_Repeat/main.js)       |
| [修改纹理参数](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/26_TexturedQuad_Clamp_Mirror/)                                  |   [查看](./26_TexturedQuad_Clamp_Mirror/main.js)    |
| [多幅纹理绘制](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/27_MultiTexture/)                                               |          [查看](./27_MultiTexture/main.js)          |

[/placeholder]:p


## 进入三维世界
| 标题                                                                                                                      |                              详情                              |
| :------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------: |
| [三维世界的深度](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/28_LookAtTriangles/)                                 |              [查看](./28_LookAtTriangles/main.js)              |
| [从指定视点观察旋转后的三角形](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/29_LookAtRotatedTriangles/)            |          [查看](./29_LookAtRotatedTriangles/main.js)           |
| [模型视图矩阵](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/30_LookAtRotatedTriangles_mvMatrix/)                   |      [查看](./30_LookAtRotatedTriangles_mvMatrix/main.js)      |
| [使用键盘控制视点](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/31_LookAtRotatedTrianglesWithKeys/)                |      [查看](./31_LookAtRotatedTrianglesWithKeys/main.js)       |
| [正射投影](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/32_orthoView/)                                             |                 [查看](./32_orthoView/main.js)                 |
| [增大正射投影可视区域](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/33_LookAtRotatedTrianglesWithKeys_ViewVolume/) | [查看](./33_LookAtRotatedTrianglesWithKeys_ViewVolume/main.js) |
[/placeholder]:p
| [透视投影可视空间](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/34_PerspectiveView/)    | [查看](./34_PerspectiveView/main.js) |
[/placeholder]:p
| [模型矩阵、视图矩阵和投影矩阵](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/35_PerspectiveView_mvp/)    | [查看](./35_PerspectiveView_mvp/main.js) |
| [模型视图投影矩阵](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/36_PerspectiveView_mvpMatrix/)    | [查看](./36_PerspectiveView_mvpMatrix/main.js) |
| [隐藏面消除](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/37_DepthBuffer/)    | [查看](./37_DepthBuffer/main.js) |
| [使用多边形偏移去解决深度冲突](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/38_Zfighting/)    | [查看](./38_Zfighting/main.js) |
| [使用drawElements绘制立方体](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/39_HelloCube/)    | [查看](./39_HelloCube/main.js) |
| [为立方体的每个表面指定颜色](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/40_ColoredCube/)    | [查看](./40_ColoredCube/main.js) |
| [绘制一个纯白色的立方体](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/41_ColoredCube_singleColor/)    | [查看](./41_ColoredCube_singleColor/main.js) |
[/placeholder]:p

## 光照原理
| 标题                                                                                                                        |                       详情                        |
| :-------------------------------------------------------------------------------------------------------------------------- | :-----------------------------------------------: |
| [环境光下的漫反射](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/42_LightedCube/)            |   [查看](./42_LightedCube/main.js)    |
| [在环境光下接受漫反射的旋转的立方体](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/43_LightedCube_animation/)            |   [查看](./43_LightedCube_animation/main.js)    |
| [环境光下的漫反射和环境反射光线](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/44_LightedCube_ambient/)            |   [查看](./44_LightedCube_ambient/main.js)    |
| [用逆转置矩阵来处理坐标变换引起的法向量变化](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/45_LightedTranslatedRotatedCube/)            |   [查看](./45_LightedTranslatedRotatedCube/main.js)    |
| [点光源光下的立方体](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/46_PointLightedCube/)            |   [查看](./46_PointLightedCube/main.js)    |
| [点光源光下的旋转的立方体](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/47_PointLightedCube_animation/)            |   [查看](./47_PointLightedCube_animation/main.js)    |
| [点光源光下的球体(逐顶点计算)](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/48_PointLightedSphere/)            |   [查看](./48_PointLightedSphere/main.js)    |
| [点光源光下的球体(逐片元计算)](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/49_PointLightedSphere_perFragment/)            |   [查看](./49_PointLightedSphere_perFragment/main.js)    |
| [点光源光下的旋转的立方体(逐片元计算)](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/50_PointLightedCube_perFragment/)            |   [查看](./50_PointLightedCube_perFragment/main.js)    |
[/placeholder]:p

## 层次模型
| 标题                                                                                                                        |                       详情                        |
| :-------------------------------------------------------------------------------------------------------------------------- | :-----------------------------------------------: |
| [单关节模型](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/51_JointMode/)            |   [查看](./51_JointMode/main.js)    |
| [绘制部件模型](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/52_MultiJointMode/)            |   [查看](./52_MultiJointMode/main.js)    |
[/placeholder]:p
| [分段绘制部件模型](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/53_MultiJointModel_segment/)            |   [查看](./53_MultiJointModel_segment/main.js)    |
[/placeholder]:p

## 高级技术
| 标题                                                                                                                        |                       详情                        |
| :-------------------------------------------------------------------------------------------------------------------------- | :-----------------------------------------------: |
| [通过鼠标旋转立方体]](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/54_RotateObject/)            |   [查看](./54_RotateObject/main.js)    |
| [像素校验立方体是否被点击到]]](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/55_PickObject/)            |   [查看](./55_PickObject/main.js)    |
| [利用a分量标记表面编号比对立方体是否被点击到]]](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/56_PickFace/)            |   [查看](./56_PickFace/main.js)    |
| [平视显示器（Head up display）]]](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/57_HeadUpDisplay/)            |   [查看](./57_HeadUpDisplay/main.js)    |
| [在网页上方显示三维物体]]](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/58_3DoverWeb/)            |   [查看](./58_3DoverWeb/main.js)    |
| [线性雾化]]](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/59_Fog/)            |   [查看](./59_Fog/main.js)    |
| [线性雾化（使用视图坐标系的负z值来近似顶点和视点的距离）]]](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/60_Fog_w/)            |   [查看](./60_Fog_w/main.js)    |
| [使用discard绘制圆]]](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/61_RoundPoint/)            |   [查看](./61_RoundPoint/main.js)    |
| [使用混合功能实现半透明效果]]](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/62_LookAtBlendedTriangles/)            |   [查看](./62_LookAtBlendedTriangles/main.js)    |
| [使用混合功能和关闭隐藏面消除功能实现三维物体半透明效果]]](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/63_BlendedCube/)            |   [查看](./63_BlendedCube/main.js)    |
| [切换着色器]]](https://krapnikkk.github.io/learn_WebGL/WebGL_Programming_Guide/64_ProgramObject/)            |   [查看](./64_ProgramObject/main.js)    |
## Author
krapnik

