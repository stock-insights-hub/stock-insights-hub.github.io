import React, { useState, useEffect } from "react"
import styled from "styled-components"

import useOffsetTop from "hooks/useOffsetTop"

import Toc from "./Toc"
import StyledMarkdown from "./StyledMarkdown"
import PrismTheme from "./PrismTheme"
import { Helmet } from "react-helmet"

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 112px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const Body = ({ html, hideToc }) => {
  const [toc, setToc] = useState([])

  const [ref, offsetTop] = useOffsetTop()

  useEffect(() => {
    setToc(
      Array.from(
        document.querySelectorAll("#article-body > h2, #article-body > h3")
      )
    )
  }, [])

  return (
    <Wrapper>
      {hideToc || <Toc items={toc} articleOffset={offsetTop} />}

      <PrismTheme />
      <Helmet>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2327476184552798"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-2327476184552798"
          data-ad-slot="4877038723"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </Helmet>
      <StyledMarkdown
        id="article-body"
        dangerouslySetInnerHTML={{ __html: html }}
        itemProp="articleBody"
        ref={ref}
      />
      <Helmet>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2327476184552798"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-2327476184552798"
          data-ad-slot="4877038723"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </Helmet>
    </Wrapper>
  )
}

export default Body
