import { PageHeader, Descriptions } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function Header(props) {
  const navigate = useNavigate();

  return (
    <PageHeader
      className="page-header"
      onBack={() => navigate(-1)}
      title={props.tags?.name || props.name}
      subTitle={props.total + '张'}
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
