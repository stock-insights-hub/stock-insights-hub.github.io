/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// You can delete this file if you're not using it
const React = require("react")
exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  setHeadComponents(
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2327476184552798"
      crossOrigin="anonymous"
    ></script>
  )
}