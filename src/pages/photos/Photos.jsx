import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Spin, message } from "antd";
import Header from "./components/Header";
import Gallery from "./components/Gallery";
import GalleryEdit from "./components/GalleryEdit";
import GallerySelect from "./components/GallerySelect";
import { fetchPhotos, reRecognition, copyObjects, moveObjects, removeObjects } from "../../api";
import "./Photos.less";

function Photos() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [bucket, setBucket] = useState(null)
  const batchRef = useRef(false)
  const [batch, setBatch] = useState(batchRef.current)
  const [selects, setSelect] = useState([])
  const [type, setType] = useState('')

  useEffect(() => {
    async function fetch () {
      setLoading(true)
      const bucket = await fetchPhotos(params.id)
      setBucket(bucket)
      setLoading(false)
    }
    
    fetch()
  }, [])

  useEffect(() => {
    batchRef.current = batch
  }, [batch])

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

  // 批量管理
  const handleBatch = () => {
    setBatch(!batchRef.current)
  }

  // 批量选择
  const handleBatchSelect = (values) => {
    setSelect(values)
  }

  // 相册编辑
  const handleGalleryEdit = () => {
    setType('galleryEdit')
  }

  // 复制
  const handleCopy = () => {
    if (!selects || !selects.length) {
      message.error('请至少选择一个文件！')
      return
    }

    setType('copy')
  }

  // 移动
  const hanldeMove = () => {
    if (!selects || !selects.length) {
      message.error('请至少选择一个文件！')
      return
    }

    setType('move')
  }

  const handleCopyOrMove = async (newBucketName) => {
    const title = type === 'copy' ? '复制' : '移动'

    try {
      const method = type === 'copy' ? copyObjects : moveObjects
      await method({
        bucketName: bucket.name,
        list: selects,
        newBucketName
      })

      message.success(title + '成功，即将刷新页面!', function() {
        window.location.href = '/'
      })
    } catch (err) {
      setType('')
      message.error(title + '失败::' + err.message)
    }
  }

  // 批量删除
  const handleRemove = async () => {
    if (!selects || !selects.length) {
      message.error('请至少选择一个文件！')
      return
    }

    try {
      await removeObjects({
        bucketName: bucket.name,
        objectsList: selects
      })

      message.success('删除成功，即将刷新页面!', function() {
        window.location.href = '/'
      })
    } catch (err) {
      message.error('删除失败::' + err.message)
    }
  }

  return (
    <div className="page-photos page">
      <Header
        name={bucket?.name || params.id}
        date={bucket?.creationDate}
        total={bucket?.total || 0}
        tags={bucket?.tags}
        batch={batch}
        onRecognition={hanlderRecognition}
        onBatch={handleBatch}
        onEdit={handleGalleryEdit}
        onCopy={handleCopy}
        onMove={hanldeMove}
        onRemove={handleRemove}
      ></Header>
      {
        loading
          ? <div className="loading"><Spin size="large"></Spin></div>
          : <Gallery
              batch={batch}
              bucket={bucket}
              onSelect={handleBatchSelect}
            ></Gallery>
      }
      {
        bucket ? <GalleryEdit
          visible={type === 'galleryEdit'}
          bucketName={bucket?.name}
          tags={bucket?.tags}
          onCancel={() => setType('')}
        ></GalleryEdit> : null
      }
      <GallerySelect
        visible={type === 'copy' || type === 'move'}
        onCancel={() => setType('')}
        onOk={handleCopyOrMove}
      ></GallerySelect>
    </div>
  )
}

export default Photos
