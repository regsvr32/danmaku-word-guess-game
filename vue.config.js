const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ]
  },
  pages: {
    index: {
      title: '弹幕猜词・主播视角',
      entry: 'src/main.js'
    },
    public: {
      title: '弹幕猜词・观众视角',
      entry: 'src/public-window.js'
    },
  },
  pluginOptions: {
    electronBuilder: {
      preload: {
        'main-preload': 'src/main-preload.js',
        'public-preload': 'src/public-preload.js'
      },
      builderOptions: {
        artifactName: "弹幕猜词-${version}.${ext}",
        win: {
          executableName: "弹幕猜词",
          target: [{ target: "zip" }]
        },
        extraFiles: [
          //{ from: "manual.txt", to: "使用说明.txt" }
        ]
      }
    }
  }
}