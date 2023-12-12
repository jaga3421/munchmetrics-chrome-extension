import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import MiniStats from "./MiniStats";
import Top10 from "./Top10";
import { generateYearlyReview } from '../helpers/zomato';


function Main() {
  const [data, setData] = useState({});

  useEffect(() => {
    chrome.storage.local.get('zomato').then((res) => {

      setData(generateYearlyReview(res.zomato));
    });
  }, []);
  return (
    <div style={{ minHeight: "calc(100vh - 104px" }}>
      {Object.keys(data).length !== 0 ? (
        <>

          <Hero data={data} />
          <MiniStats data={data} />
          <Top10 data={data} />
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Main;
