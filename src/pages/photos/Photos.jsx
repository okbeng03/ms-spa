import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import Header from "./components/Header";
import Gallery from "./components/Gallery";
import { fetchPhotos } from "../../api";
import "./Photos.less";

function Photos() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [bucket, setBucket] = useState(null)

  useEffect(() => {
    async function fetch () {
      setLoading(true)
      const bucket = await fetchPhotos(params.id)
      setBucket(bucket)
      setLoading(false)
    }
    
    fetch()
  }, [])

  return (
    <div className="page-photos page">
      <Header
        name={bucket?.name || params.id}
        date={bucket?.creationDate}
        total={bucket?.total || 0}
        tags={bucket?.tags}
      ></Header>
      {
        loading
          ? <div className="loading"><Spin size="large"></Spin></div>
          : <Gallery bucket={bucket}></Gallery>
      }
    </div>
  )
}

export default Photos
