import React from "react"
import SEO from "components/SEO"
import { graphql } from "gatsby"

import Layout from "components/Layout"
import Article from "components/Article"

import { siteUrl } from "../../blog-config"

function replaceAds(html){
  /*html = html.replace(/<adsense><\/adsense>/g,'' +
    '<ins class="adsbygoogle"\n' +
    '     style="display:block; text-align:center;"\n' +
    '     data-ad-layout="in-article"\n' +
    '     data-ad-format="fluid"\n' +
    '     data-ad-client="ca-pub-2327476184552798"\n' +
    '     data-ad-slot="8895372459"></ins>\n' +
    '<script>\n' +
    '     (adsbygoogle = window.adsbygoogle || []).push({});\n' +
    '</script>');*/
  return html;
}

const Post = ({ data }) => {
  const post = data.markdownRemark
  const { previous, next, seriesList } = data

  const { title, date, update, tags, series, emoji } = post.frontmatter
  const { excerpt } = post
  const { readingTime, slug } = post.fields

  let filteredSeries = []
  if (series !== null) {
    filteredSeries = seriesList.edges.map(seriesPost => {
      if (seriesPost.node.id === post.id) {
        return {
          ...seriesPost.node,
          currentPost: true,
        }
      } else {
        return {
          ...seriesPost.node,
          currentPost: false,
        }
      }
    })
  }

  return (
    <Layout>
      <SEO title={title} description={excerpt} url={`${siteUrl}${slug}`} />
      <Article>
        <Article.Header
          emoji={emoji}
          title={title}
          date={date}
          update={update}
          tags={tags}
          minToRead={Math.round(readingTime.minutes)}
        />
        {filteredSeries.length > 0 && (
          <Article.Series header={series} series={filteredSeries} />
        )}
        <Article.Body html={replaceAds(post.html)} />
        {filteredSeries.length > 0 && (
          <Article.Series header={series} series={filteredSeries} />
        )}
        <Article.Footer previous={previous} next={next} />
      </Article>
    </Layout>
  )
}

export default Post

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $series: String
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 200, truncate: true)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        update(formatString: "MMMM DD, YYYY")
        tags
        series
        emoji
      }
      fields {
        slug
        readingTime {
          minutes
        }
      }
    }
    seriesList: allMarkdownRemark(
      sort: { order: ASC, fields: [frontmatter___date] }
      filter: { frontmatter: { series: { eq: $series } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            emoji
          }
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
        emoji
      }
    }
  }
`
