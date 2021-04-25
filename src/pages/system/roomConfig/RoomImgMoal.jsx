import { Modal, Upload, Icon, message } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { getRoomTypeImages, updateRoomTypeImages } from '@/services/system/roomConfig';
import Constants from '@/constans';

const RoomImgMoal = props => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVis, setPreviewVis] = useState(false);
  const [removeIds, setRemoveIds] = useState([]);

  useEffect(() => {
    if (props.visible && props.roomTypeId) {
      getRoomTypeImages(props.roomTypeId).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const list = rsp.data || [];
          list.map(item => (item.uid = -item.id + ''));
          setFileList(list);
        }
      });
    }
  }, [props.visible]);

  const handleSubmit = () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const { hotel_group_id, hotel_id, id: user_id } = currentUser;
    const room_type_id = props.roomTypeId;
    let imgs = [];
    fileList.map(item => {
      if (!item.id) {
        const { size: file_size } = item;
        const url = item.response && item.response.data && item.response.data[0];
        const file_name = url && url.substring(url.lastIndexOf('/') + 1);
        const img = {
          hotel_group_id,
          hotel_id,
          room_type_id,
          url,
          file_name,
          file_size,
          create_user: user_id,
          modify_user: user_id,
        };
        imgs.push(img);
      }
    });

    if (removeIds && removeIds.length > 0) {
      removeIds.map(item => {
        const img = { id: item };
        imgs.push(img);
      });
    }

    console.log(imgs);

    updateRoomTypeImages(imgs).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '修改成功');
        props.handleCancel();
      }
    });
  };

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVis(true);
  };

  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleChange = ({ file, fileList, event }) => {
    // console.log(file);
    // console.log(fileList);
    // console.log(event);
    const list = [...fileList];
    setFileList(list);
  };

  const handleRemove = file => {
    if (file && file.id) {
      const remove = [...removeIds];
      remove.push(file.id);
      setRemoveIds(remove);
    }
  };

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">上传图片</div>
    </div>
  );

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const token = sessionStorage.getItem('token');

  const url =
    '/api/common/uploadFile?user_id=' +
    currentUser.id +
    '&token=' +
    token +
    '&filePath=/room/' +
    props.roomTypeId +
    '/';

  return (
    <Modal
      title="房型图片"
      width={720}
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Upload
        action={url}
        listType="picture-card"
        fileList={fileList}
        multiple={true}
        onRemove={handleRemove}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 30 ? null : uploadButton}
      </Upload>
      <Modal visible={previewVis} width={900} footer={null} onCancel={() => setPreviewVis(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Modal>
  );
};

export default RoomImgMoal;
