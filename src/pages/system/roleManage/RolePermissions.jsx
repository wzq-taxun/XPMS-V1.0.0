import { Modal, Transfer, message } from 'antd';
import { useEffect, useState } from 'react';
import Constants from '@/constans';
import { getRoleRights, updateRoleRights } from '@/services/system/roleManage';

const RolePermissions = props => {
  const [allRights, setAllRights] = useState([]);
  const [meRights, setMeRights] = useState([]);
  const [meRightIds, setMeRightIds] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (props.visible && props.roleId) {
      getRoleRights(props.roleId).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const all = (rsp.data && rsp.data.all) || [];
          setAllRights(all);
          const me = (rsp.data && rsp.data.me) || [];
          setMeRights(me);
          let ids = [];
          me.map(item => {
            ids.push(item.rightid);
          });
          setMeRightIds(ids);
          let targetIds = [];
          all.map(item => {
            if (ids.includes(item.rightid)) {
              targetIds.push(item.rightid);
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
    const addRightIds = [];
    targetKeys.map(item => {
      if (!meRightIds.includes(item)) {
        addRightIds.push(item);
      }
    });
    const removeIds = [];
    meRights.map(item => {
      if (!targetKeys.includes(item.rightid)) {
        removeIds.push(item.id);
      }
    });
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const params = {
      removeIds: removeIds.toString(),
      addRightIds: addRightIds.toString(),
      addRoleId: props.roleId,
      userId: currentUser.id,
    };
    console.log(params);
    updateRoleRights(params).then(rsp => {
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
        dataSource={allRights}
        rowKey={record => record.rightid}
        titles={['未授权', '已授权']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        showSearch
        listStyle={{
          width: 250,
          height: 400,
        }}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        render={item => item.right_name + '-' + item.right_url}
      />
    </Modal>
  );
};

export default RolePermissions;
