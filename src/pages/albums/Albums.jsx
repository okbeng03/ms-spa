import { useEffect, useState } from 'react'
import { Spin } from 'antd'
import AlbumItem from './components/Album'
import UploadItem from './components/Upload'
import { fetchAlbums } from '../../api'
import './Albums.less'

function Albums() {
  const [loading, setLoading] = useState(true)
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    async function fetch () {
      setLoading(true)
      const list = await fetchAlbums()
      setAlbums(list)
      setLoading(false)
    }
    
    fetch()
  }, [])

  const renderAlbums = () => {
    return (
      <div className='mod-alums'>
        {
          albums.map(album => {
            return (
              <div className="album-item" key={album.name}>
                {
                  album.tags?.type === 'nogroup'
                    ? <UploadItem album={album}></UploadItem>
                    : <AlbumItem album={album}></AlbumItem>
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  return (
    <div className="page-albums page">
      {
        loading
          ? <div className="loading"><Spin size="large"></Spin></div>
          : renderAlbums()
      }
    </div>
  )
}

export default Albums
