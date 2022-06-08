import { Link } from "react-router-dom";

function AlbumItem(props) {
  const { album } = props

  return (
    <Link to={`/photos/${album.name}`}>
      <dl className="album-normal">
        <dt>
          <img src={album.thumb}></img>
        </dt>
        <dd className="name">
          {album.tags?.name || album.name}
        </dd>
        <dd className="total">
          {album.objects ? album.objects + '张' : '无'}
        </dd>
      </dl>
    </Link>
  )
}

export default AlbumItem
