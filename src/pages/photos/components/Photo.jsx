import { Checkbox } from 'antd';

function PhotoItem(props) {
  const { photo } = props

  const handleClick = (e) => {
    props.onView(e, photo)
  }

  return (
    <dl onClick={(e) => handleClick(e)}>
      <dt>
        <span onClick={(e) => {e.stopPropagation()}}>
          <Checkbox value={photo.name}></Checkbox>
        </span>
        <img src={photo.thumb}></img>
      </dt>
    </dl>
  )
}

export default PhotoItem
