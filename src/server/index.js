import express from 'express'
import proxy from 'express-http-proxy'
import { matchRoutes } from 'react-router-config'
import { serverRender } from './utils'
import { getStore } from '../store'
import routes from '../Routes'

const app = express()
app.use(express.static('public'))

// 将api请求代理到http://47.95.113.63
app.use('/api', proxy('http://47.95.113.63', {
  proxyReqPathResolver: function (req) {
    return `/ssr/api` + req.url
  }
}))

app.get('*', function (req, res) {
  const store = getStore(req)                                  // 获取新的store
  const matchedRoutes = matchRoutes(routes, req.path)       // 匹配路由

  const promises = []
  matchedRoutes.forEach(item => {
    if (item.route.loadData) {
      // 额外封装一层Promise:对应加载的组件无论成功或者失败，都让外层的Promise执行成功。
      const promise = new Promise((resolve, reject) => {
        item.route.loadData(store).then(resolve).catch(resolve)
      })
      promises.push(promise)
    }
  })

  // 等待promises数组里的所有promise全部执行完毕，再进行服务端渲染
  Promise.all(promises).then(() => {
    const context = { css: [] }
    const html = serverRender({ store, routes, req, context })      // 匹配的NotFound组件会修改context值

    if (context.action === 'REPLACE') {      // react-router-config会自动往context中注入参数
      res.redirect(301, context.url)
    } else if (context.NOT_FOUND) {
      res.status(404)
      res.send(html)
    } else {
      res.send(html)
    }
  })
})

const server = app.listen(4068)