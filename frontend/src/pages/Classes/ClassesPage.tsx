import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useGetClassesQuery } from '../../api';
import { QueryWrapper } from '../../components/QueryWrapper';
import type { Class } from '../../types';

const columns = [
  { title: 'שם הכיתה', dataIndex: 'name', key: 'name' },
  { title: 'שכבה', dataIndex: 'grade', key: 'grade' },
  { title: 'מחנכת', dataIndex: 'homeroomTeacher', key: 'homeroomTeacher' },
  { title: 'מספר תלמידים', dataIndex: 'studentsCount', key: 'studentsCount' },
];

export function ClassesPage() {
  const navigate = useNavigate();
  const { data: classes, isLoading, isError } = useGetClassesQuery();

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>כיתות</h2>
      <QueryWrapper isLoading={isLoading} isError={isError}>
        <Table
          dataSource={classes}
          columns={columns}
          rowKey="id"
          onRow={(record: Class) => ({
            onClick: () => navigate(`/classes/${record.id}/students`),
            style: { cursor: 'pointer' },
          })}
        />
      </QueryWrapper>
    </div>
  );
}
