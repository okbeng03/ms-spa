import { useState, useEffect } from 'react';
import { Empty, Checkbox } from 'antd';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Player } from 'video-react';
import className from 'classname';
import moment from 'moment';
import PhotoItem from './Photo';
import CropperModal from './CropperModal';

import 'react-photo-view/dist/react-photo-view.css';
import 'video-react/dist/video-react.css';

const regVideoFile = /(avi|wmv|mpe?g|mov|ra?m|swf|flv|mp4)$/

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
              item.source = item.source || ''
              item.width = item.tags.width - 0
              item.height = item.tags.height - 0

              if (regVideoFile.test(item.source)) {
                // 视频
                const wWidth = window.innerWidth
                const wHeight = window.innerHeight
                const wFit = wWidth >= item.width
                const hFit = wHeight >= item.height
                let eWidth
                let eHeight

                if (wFit && hFit) {
                  // 屏幕比视频大，按视频尺寸
                  eWidth = item.width
                  eHeight = item.height
                } else {
                  let scale

                  if (!wFit && !hFit) {
                    // 视频比屏幕都大，按差更多的那边适配
                    const wSuit = (item.width / wWidth) >= (item.height / wHeight)
                    scale = wSuit > 0 ? wWidth / item.width : wHeight / item.height
                  } else if (!wFit) {
                    scale = wWidth / item.width
                  } else {
                    scale = wHeight / item.height
                  }

                  eWidth = item.width * scale
                  eHeight = item.height * scale
                }
                // 视频
                return (
                  <PhotoView
                    key={item.name}
                    width={eWidth}
                    height={eHeight}
                    render={({ scale, attrs }) => {
                      const width = attrs.style.width;
                      const offset = (width - eWidth) / eWidth;
                      // 保持子节点的 scale 的稳定
                      const childScale = scale === 1 ? scale + offset : 1 + offset;

                      return (
                        <div
                          {...attrs}
                          className={`flex-none flex flex-col items-center justify-center bg-white ${attrs.className}`}
                        >
                          <div style={{ transform: `scale(${childScale})` }}>
                            <Player>
                              <source src={item.source} />
                            </Player>
                          </div>
                        </div>
                      );
                    }}
                  >
                    <div className="photo-item video-item">
                      <PhotoItem
                        photo={item}
                        onView={handlerView}
                      ></PhotoItem>
                    </div>
                  </PhotoView>
                )
              } else {
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
              }
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
      <PhotoProvider loop={true}>
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
