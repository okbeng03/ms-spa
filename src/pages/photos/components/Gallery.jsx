import { useState } from 'react';
import { Empty } from 'antd';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import dayjs from 'dayjs';
import PhotoItem from './Photo';
import CropperModal from './CropperModal';
import 'react-photo-view/dist/react-photo-view.css';

function Gallery(props) {
  const { bucket } = props
  const { objects, total } = bucket
  const [ cropperVisible, setCropperVisible ] = useState(false)
  const [ cropper, setCropper ] = useState(null)

  const handlerView = (e, photo) => {
    if (bucket.tags?.type === 'needrecognition') {
      e.stopPropagation()
      // 裁剪
      setCropper(photo)
      setCropperVisible(true)
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
                <PhotoView key={item.name} src={item.source}>
                  <div>
                    <PhotoItem
                      photo={item}
                      onView={handlerView}
                    ></PhotoItem>
                  </div>
                </PhotoView>
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

    return (
      <PhotoProvider>
        {gallerys}
      </PhotoProvider>
    )
  }

  return (
    <div className="mod-gallery">
      {
        total
          ? renderGallery()
          : <div className="empty"><Empty description="暂无图片"></Empty></div>
      }
      {
        bucket.tags?.type === 'needrecognition'
          ? <CropperModal
              visible={cropperVisible}
              photo={cropper}
              onCancel={() => setCropperVisible(false)}
            ></CropperModal>
          : null
      }
    </div>
  )
}

export default Gallery
