import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, message } from "antd";
import Header from "./components/Header";
import Gallery from "./components/Gallery";
import { fetchPhotos, reRecognition } from "../../api";
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

  // 重新识别
  const hanlderRecognition = async () => {
    const objects = []
    bucket.objects.forEach(group => {
      group.list.forEach(obj => {
        objects.push({
          name: obj.name
        })
      })
    })

    try {
      await reRecognition(bucket.name, objects)

      message.success('已提交重新识别，识别耗时较长，请耐心等待结果，稍后刷新页面试试!')
    } catch (err) {
      message.error('提交重新识别失败::' + err.message)
    }
  }

  return (
    <div className="page-photos page">
      <Header
        name={bucket?.name || params.id}
        date={bucket?.creationDate}
        total={bucket?.total || 0}
        tags={bucket?.tags}
        onRecognition={hanlderRecognition}
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
