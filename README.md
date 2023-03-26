## Node.js 客户端服务器交互练习 📱

##### <font color=grey>姓名：宣正吉</font>

##### 源代码链接：

---

#### 要求

- 提供一个 http 服务（express）
- 用户提供一个网络图片地址作为参数
- 读取网络的一张图片
- 基于图片内容做 md5 文件名
- 将内容保存到本地
- 将执行的结果响应给用户
- 结合携程 cat 模块将访问数据发送到监控平台

首先创建新的文件夹并初始化项目`npm init`，生成 json 配置文件：

```json
{
  "name": "xzj-node",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.20.2",
    "chai": "^4.3.7",
    "express": "^4.18.2",
    "mocha": "^10.2.0"
  }
}
```

安装所需依赖：`npm install express body-parser mocha chai --save`。

#### 提供一个 HTTP 服务

使用 axios 包实现服务器和客户端的请求处理，首先通过 express 创建一个服务，端口号设置为 3000：

```js
const express = require("express");
const axios = require("axios");
const fs = require("fs");

const getFileName = require("./getFileName");

const app = express();
const port = 3000;
```

#### 用户提供一个网络图片地址作为参数

如果用户没有提供 url，则返回状态码 400，并给出提示；在用户提供的请求中，通过将参数提取出来获得图片地址，通过 axios 下载图片后将图片读入 buffer，根据二进制文件计算出 md5 码，最后和 url 拼接成存储文件名，下面是生成文件名的 js 代码：

```js
// getFileName.js
const crypto = require("crypto");
const path = require("path");

const getFileName = (imageBuffer, imageUrl) => {
  const hash = crypto.createHash("md5");
  hash.update(imageBuffer);
  const filename = `${hash.digest("hex")}${path.extname(imageUrl)}`;

  return path.resolve(__dirname, "data", filename);
};

module.exports = getFileName;
```

下面是服务器的整体逻辑脚本：

```js
const express = require("express");
const axios = require("axios");
const fs = require("fs");

const getFileName = require("./getFileName");

const app = express();
const port = 3000;

app.get("/download", (req, res) => {
  const imageUrl = req.query.imageUrl;
  if (!imageUrl) {
    res.status(400).send("No image URL provided!");
    return;
  }

  axios
    .get(imageUrl, { responseType: "arraybuffer" })
    .then((response) => {
      const imageBuffer = Buffer.from(response.data, "binary");

      const filename = getFileName(imageBuffer, imageUrl);

      fs.writeFileSync(filename, imageBuffer);

      res.send(`Image saved as ${filename}.`);
    })
    .catch((error) => {
      res.status(500).send();
    });
});
```

现在可以暂时跑一下看看效果，在本地服务器 localhost:3000 上进行测试，输入 url：`http://localhost:3000/download?imageUrl=`，现在没有给具体的网络图片地址，将显示如下界面：
<image src="1.png"/>
现在提供一个网络图片的 url`https://cdn-icons-png.flaticon.com/512/2194/2194807.png`，但是现在出现了访问失败的问题：
<image src="2.png"/>
原因是我没有创建 data 文件夹导致服务器内部文件读取发生错误，创建好文件夹之后的效果如下：
<image src="3.png"/>
现在通过浏览器请求 url 后，服务器自动将图片保存在了 data 文件夹下：
<image src="4.png"/>
现在通过 inspect 调试工具查看服务器的性能情况：
<image src="5.png"/>
<image src="6.png"/>
<font color=red>携程 CAT 的部分如何实现呢？参考链接：https://blog.csdn.net/xiaoyi52/article/details/109671668</font>
