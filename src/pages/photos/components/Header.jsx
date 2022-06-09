import { useState, useEffect } from 'react';
import { PageHeader, Descriptions, Tooltip } from 'antd';
import { TrademarkOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function Header(props) {
  const navigate = useNavigate()
  const [operations, setOperations] = useState([])

  useEffect(() => {
    const type = props.tags?.type
    const list = []

    if (type === 'needrecognition') {
      list.push(
        (
          <Tooltip title="重新识别" key="recoginition">
            <TrademarkOutlined onClick={handleRecognition} />
          </Tooltip>
        )
      )
    }

    setOperations(list)
  }, [props.tags?.type])

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
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="创建时间">{dayjs(props.date).format('YYYY-MM-DD')}</Descriptions.Item>
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
