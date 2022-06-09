import { useState } from 'react';
import { Empty } from 'antd';
import dayjs from 'dayjs';
import PhotoItem from './Photo';
import CropperModal from './CropperModal';

function Gallery(props) {
  const { bucket } = props
  const { objects, total } = bucket
  const [ cropperVisible, setCropperVisible ] = useState(false)
  const [ cropper, setCropper ] = useState(null)

  const handlerView = (photo) => {
    if (bucket.tags?.type === 'needrecognition') {
      // 裁剪
      setCropper(photo)
      setCropperVisible(true)
    } else {
      // 预览
    }
  }

  const renderGroup = (group) => {
    return (
      <div className="group" key={group.date}>
        <div className="group-header">
          {dayjs(group.date).format('YYYY-MM-DD')}
        </div>
        <div className="group-body">
          {
            group.list.map(item => {
              return (
                <PhotoItem
                  photo={item}
                  key={item.name}
                  onView={handlerView}
                ></PhotoItem>
              )
            })
          }
        </div>
      </div>
    )
  }

  const renderGallery = () => {
    const gallerys = []

    for (const group of objects) {
      gallerys.push(renderGroup(group))
    }

    return gallerys
  }

  return (
    <div className="mod-gallery">
      {
        total
          ? renderGallery()
          : <div className="empty"><Empty description="暂无图片"></Empty></div>
      }
      {
        bucket.tags?.type === 'needrecognition' ? <CropperModal
          visible={cropperVisible}
          photo={cropper}
          onCancel={() => setCropperVisible(false)}
        ></CropperModal> : null
      }
    </div>
  )
}

export default Gallery
