import { useState, useEffect } from 'react';
import { Space, PageHeader, Descriptions, Tooltip, Divider } from 'antd';
import { TrademarkOutlined, EditOutlined, DownloadOutlined, CopyOutlined, SwapOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import className from 'classname'

function Header(props) {
  const { batch } = props
  const navigate = useNavigate()
  const [operations, setOperations] = useState([])

  useEffect(() => {
    const type = props.tags?.type
    const list = []

    list.push(
      (
        <Tooltip title="编辑" key="edit">
          <EditOutlined onClick={handleEdit} />
        </Tooltip>
      )
    )

    if (type === 'needrecognition') {
      list.push(
        (
          <Tooltip title="重新识别" key="recoginition">
            <TrademarkOutlined onClick={handleRecognition} />
          </Tooltip>
        )
      )
    }

    list.push(<Divider type="vertical" key="divider"></Divider>)

    list.push(
      (
        <Tooltip title="批量管理" key="batch">
          <MoreOutlined onClick={handleBatchOperation} />
        </Tooltip>
      )
    )

    setOperations(list)
  }, [props.tags?.type])

  // 编辑相册
  const handleEdit = () => {
    props.onEdit()
  }

  // 批量操作
  const handleBatchOperation = function() {
    props.onBatch()
  }

  // 下载
  const handleDownload = () => {
    props.onDownload()
  }

  // 复制
  const handleCopy = () => {
    props.onCopy()
  }

  // 移动
  const handleMove = () => {
    props.onMove()
  }

  // 删除
  const handleRemove = () => {
    props.onRemove()
  }

  // 重新识别
  const handleRecognition = () => {
    props.onRecognition()
  }

  return (
    <PageHeader
      className="page-header"
      onBack={() => navigate(-1)}
      title={props.tags?.name || props.name}
      subTitle={props.total + '张'}
      extra={operations}
    >
      <div className={className({'batch-operation': true, 'show': batch})}>
        <Space size={12}>
          <Tooltip title="下载" key="download">
            <DownloadOutlined onClick={handleDownload} />
          </Tooltip>
          <Tooltip title="复制" key="copy">
            <CopyOutlined onClick={handleCopy} />
          </Tooltip>
          <Tooltip title="移动" key="move">
            <SwapOutlined onClick={handleMove} />
          </Tooltip>
          <Tooltip title="删除" key="remove">
            <DeleteOutlined onClick={handleRemove} />
          </Tooltip>
        </Space>
      </div>
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="创建时间">{moment(props.date).format('YYYY-MM-DD')}</Descriptions.Item>
        {
          props.tags?.description ? <Descriptions.Item label="描述">
            {props.tags?.description}
          </Descriptions.Item> : null
        }
      </Descriptions>
    </PageHeader>
  )
}

export default Header
