/**
 * Project's customized Webpack Configuration Extension
 * ----------------------------------------------------
 *
 * this file is heavily inspired by `react-app-rewired` mechanism.
 *
 * it simply gives you the chance to hook into the default Webpack
 * configuration as it is provided by `create-react-app`, and to
 * change it so to match your project's needs.
 *
 * If you want to check out the default values look into:
 * `./node_modules/marcopeg-react-scripts/config/webpack.config.${env}.js`
 *
 */

module.exports = (webpackConfig, env, { paths }) => {
  // here you can extend your webpackConfig at will

  webpackConfig.externals = {
    'react': 'React', // Case matters here 
    'react-dom' : 'ReactDOM', // Case matters here
  }

  if (env == "production") {
      webpackConfig.output.library = "demo_plugin"
      webpackConfig.output.libraryTarget = "window"

      webpackConfig.output.filename = '[name].js'
      webpackConfig.output.chunkFilename = '[name].chunk.js'

      delete webpackConfig.optimization.splitChunks
      webpackConfig.optimization.runtimeChunk = false
  }

  return webpackConfig
}
