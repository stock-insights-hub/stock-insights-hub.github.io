import React, { useEffect } from "react"

const Adsense = () => {

  useEffect(() => {
    if(window){
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    }
  })

  return (
    <div>
       <ins className="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-2327476184552798"
           data-ad-slot="4877038723"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  )
}
export default Adsense
