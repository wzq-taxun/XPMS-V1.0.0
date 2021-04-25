import { Modal, Transfer, Switch, message } from 'antd';
import { useEffect, useState } from 'react';
import { getUserRoles, updateUserRoles } from '@/services/system/userManage';
import Constants from '@/constans';

const UserRole = props => {
  const [allRoles, setAllRoles] = useState([]);
  const [meRoles, setMeRoles] = useState([]);
  const [meRoleIds, setMeRoleIds] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (props.visible && props.userId) {
      getUserRoles(props.userId).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const all = (rsp.data && rsp.data.all) || [];
          setAllRoles(all);
          const me = (rsp.data && rsp.data.me) || [];
          setMeRoles(me);
          let ids = [];
          me.map(item => {
            ids.push(item.roleid);
          });
          setMeRoleIds(ids);
          let targetIds = [];
          all.map(item => {
            if (ids.includes(item.id)) {
              targetIds.push(item.id);
            }
          });
          setTargetKeys(targetIds);
        }
      });
    }
  }, [props.visible]);

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const handleSubmit = () => {
    setLoading(true);
    const addRoleIds = [];
    targetKeys.map(item => {
      if (!meRoleIds.includes(item)) {
        addRoleIds.push(item);
      }
    });
    const removeIds = [];
    meRoles.map(item => {
      if (!targetKeys.includes(item.roleid)) {
        removeIds.push(item.id);
      }
    });
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const params = {
      removeIds: removeIds.toString(),
      addRoleIds: addRoleIds.toString(),
      addUserId: props.userId,
      userId: currentUser.id,
    };
    console.log(params);
    updateUserRoles(params).then(rsp => {
      setLoading(false);
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '修改成功');
        props.handleCancel(true);
      }
    });
  };

  return (
    <Modal
      title="用户"
      visible={props.visible}
      width={600}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Transfer
        dataSource={allRoles}
        rowKey={record => record.id}
        titles={['不属', '所属']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        showSearch
        listStyle={{
          width: 250,
          height: 400,
        }}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        render={item => item.name + '-' + item.description}
      />
    </Modal>
  );
};

export default UserRole;
