# Amazon Rekognition Demo

这是一个Amazon Rekognition服务的示例项目。在本演示项目中，我们将展示AWS图像识别技术分别应用于对象场景检测，图像审核，面部分析，面孔比较以及面部识别等方面的实际效果。您可以通过页面演示来体验图像识别技术的准确性与效果。

本演示仅用于试验和参考用途，如果您想开发自己的图像识别应用，请登录AWS官网查看详细信息。如果您发现了项目中的任何错误或有任何建议，请发送邮件至：<mailto:lintchen@amazon.com>, <mailto:davwan@amazon.com>进行探讨，谢谢！

## 示例页面

<https://s3-us-west-2.amazonaws.com/amazon-rekognition-demo/index.html>

## 特别感谢

***@David Wang***	项目整体开发，梳理展示  
***@Leo Chen***	想法完善，安全性建议  
***@Fei Zhao***	面部分析部分的代码，用于客户活动的Demo  

## 项目架构

本项目主要利用Amazon S3的静态页面功能，通过AWS JavaScript SDK访问AWS各类服务实现功能。主要使用了Amazon Cognito用户池给访问用户分配权限，使用Amazon S3存储展示静态页面，存储人脸库源图片，Amazon Rekognition处理图像返回结果，等。

## 项目部署

1. 将整体项目文件克隆至本地。
2. 修改js文件夹下的common.js文件。
	- 常量BUCKET_NAME，替换为项目S3存储桶名
	- 常量POOL_ID，替换为项目Cognito用户池ID
	- 其余常量按照实际情况酌情修改
3. 将修改好的项目文件全部上传至S3项目存储桶中。
4. 修改S3项目存储桶配置，包括
	- 静态网站设置，主页为index.html,错误页面为error.html
	- 日志功能激活
	- 权限设置所有人可读
	- 存储桶权限设置所有桶内资源给所有人**"Action": "s3:GetObject"**
	- CORS配置网站地址获得GET, PUT, POST, DELETE操作权限
	- 其他个性化设置
5. 配置Cognito用户池所对应的IAM角色具有至少S3项目存储桶全部操作权限，以及Amazon Rekognition全部操作权限
6. 面部识别功能的正常使用前需要先创建Collection，使用AWS CLI可以实现

以上所有操作如果遇到问题，请参阅AWS官方文档
