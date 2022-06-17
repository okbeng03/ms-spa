import { Checkbox } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

function PhotoItem(props) {
  const { photo } = props

  const handleClick = (e) => {
    props.onView(e, photo)
  }

  return (
    <dl className='' onClick={(e) => handleClick(e)}>
      <dt>
        <span onClick={(e) => {e.stopPropagation()}}>
          <Checkbox value={photo.name}></Checkbox>
        </span>
        <img src={photo.thumb}></img>
        <div className="play">
          <PlayCircleOutlined />
        </div>
      </dt>
    </dl>
  )
}

export default PhotoItem
