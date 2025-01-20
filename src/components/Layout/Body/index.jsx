import React from "react"
import styled from "styled-components"
import Adsense from "../../Adsense"

const BodyWrapper = styled.div`
  margin: 0 auto;
  padding-top: 80px;
  max-width: 680px;
  & > code[class*="language-"], pre[class*="language-"], blockquote {
      border-radius: 6px;
  }
`

const Body = ({ children }) => {
  return <BodyWrapper><Adsense/>{children}<Adsense/></BodyWrapper>
}

export default Body
