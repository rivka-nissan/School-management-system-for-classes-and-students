import { Table, Button, Popconfirm, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} from '../../api';
import { QueryWrapper } from '../../components/QueryWrapper';
import { ClassFormModal } from '../../components/ClassForm/ClassFormModal';
import type { Class, CreateClassDto, UpdateClassDto } from '../../types';

export function ClassesPage() {
  const navigate = useNavigate();
  const { data: classes, isLoading, isError } = useGetClassesQuery();
  const [createClass, { isLoading: creating }] = useCreateClassMutation();
  const [updateClass, { isLoading: updating }] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | undefined>();

  const openAdd = () => { setEditingClass(undefined); setModalOpen(true); };
  const openEdit = (cls: Class, e: React.MouseEvent) => { e.stopPropagation(); setEditingClass(cls); setModalOpen(true); };

  const handleSubmit = async (values: CreateClassDto | UpdateClassDto) => {
    if (editingClass) {
      await updateClass({ id: editingClass.id, body: values as UpdateClassDto }).unwrap();
      message.success('הכיתה עודכנה בהצלחה');
    } else {
      await createClass(values as CreateClassDto).unwrap();
      message.success('הכיתה נוספה בהצלחה');
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await deleteClass(id).unwrap();
    message.success('הכיתה נמחקה');
  };

  const columns = [
    { title: 'שם הכיתה', dataIndex: 'name', key: 'name' },
    { title: 'שכבה', dataIndex: 'grade', key: 'grade' },
    { title: 'מחנכת', dataIndex: 'homeroomTeacher', key: 'homeroomTeacher' },
    { title: 'מספר תלמידים', dataIndex: 'studentsCount', key: 'studentsCount' },
    {
      title: 'פעולות',
      key: 'actions',
      render: (_: unknown, record: Class) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button icon={<EditOutlined />} size="small" onClick={(e) => openEdit(record, e)} />
          <Popconfirm title="למחוק את הכיתה?" onConfirm={(e) => handleDelete(record.id, e as React.MouseEvent)} okText="כן" cancelText="לא">
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>כיתות</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>הוסף כיתה</Button>
      </div>
      <QueryWrapper isLoading={isLoading} isError={isError}>
        <Table
          dataSource={classes}
          columns={columns}
          rowKey="id"
          onRow={(record) => ({ onClick: () => navigate(`/classes/${record.id}/students`), style: { cursor: 'pointer' } })}
        />
      </QueryWrapper>
      <ClassFormModal
        open={modalOpen}
        cls={editingClass}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
        loading={creating || updating}
      />
    </div>
  );
}
