import { useState, useEffect } from 'react';
import { Empty, Checkbox } from 'antd';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import className from 'classname';
import moment from 'moment';
import PhotoItem from './Photo';
import CropperModal from './CropperModal';
import 'react-photo-view/dist/react-photo-view.css';

function Gallery(props) {
  const { bucket, batch, onSelect } = props
  const { objects, total } = bucket
  const [ cropperVisible, setCropperVisible ] = useState(false)
  const [ cropper, setCropper ] = useState(null)
  const [objectList, setList] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)

  useEffect(() => {
    const list = []

    objects.forEach(group => {
      group.list.forEach(item => {
        list.push(item.name)
      })
    })

    setList(list)
  }, [bucket.objects])

  const handlerView = (e, photo) => {
    if (bucket.tags?.type === 'needrecognition') {
      e.stopPropagation()
      // 裁剪
      setCropper(photo)
      setCropperVisible(true)
    }
  }

  const handleSelect = (values) => {
    const len = values.length

    setCheckedList(values)
    setIndeterminate(len && len < total)
    setCheckAll(len === total)

    onSelect(values)
  }

  // 全选
  const handleSelectAll = (e) => {
    const checked = e.target.checked

    setCheckedList(checked ? objectList : [])
    setIndeterminate(false)
    setCheckAll(checked)

    onSelect(checked ? objectList : [])
  }

  const renderGroup = (group) => {
    return (
      <div className="group" key={group.date}>
        <div className="group-header">
          {moment(group.date).format('YYYY-MM-DD')}
        </div>
        <div className="group-body">
          {
            group.list.map(item => {
              return (
                <PhotoView key={item.name} src={item.source}>
                  <div className="photo-item">
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
        <Checkbox.Group value={checkedList} onChange={handleSelect}>
          {gallerys}
        </Checkbox.Group>
      </PhotoProvider>
    )
  }

  return (
    <div className={className({'mod-gallery': true, 'batch': batch})}>
      {
        batch ? <Checkbox className="select-all" indeterminate={indeterminate} checked={checkAll} onChange={handleSelectAll}>全选</Checkbox> : null
      }
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
