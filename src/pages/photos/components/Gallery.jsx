import { Empty } from 'antd';
import dayjs from 'dayjs';
import PhotoItem from './Photo';

function Gallery(props) {
  const { objects, total } = props

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
                <PhotoItem photo={item} key={item.name}></PhotoItem>
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
    </div>
  )
}

export default Gallery
