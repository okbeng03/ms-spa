import requst from '../lib/requst'
import { groupBy } from 'lodash'
import dayjs from 'dayjs'

export const fetchAlbums = async function() {
  try {
    const list = await requst({
      url: '/api/sso/albums'
    })

    const idx = list.findIndex(item => item.name === 'ms-nogroup')
    const noGroup = list.splice(idx, 1)[0]
    noGroup.type = 'upload'
    list.unshift(noGroup)

    return list
  } catch (err) {
    throw err
  }
}

export const fetchPhotos = async function(id) {
  try {
    const bucket = await requst({
      url: `/api/sso/photos/${id}`
    })

    // 时间聚合
    if (bucket.total) {
      const group = groupBy(bucket.objects, item => {
        return dayjs(item.orginTime || item.lastModified).format('YYYY-MM-DD')
      })
      const list = []

      for (const key in group) {
        list.push({
          date: key,
          list: group[key]
        })
      }

      bucket.objects = list.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
    }

    return bucket
  } catch (err) {
    throw err
  }
}
