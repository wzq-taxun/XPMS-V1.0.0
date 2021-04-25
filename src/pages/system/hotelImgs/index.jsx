import { Upload, Modal, Icon, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import { getHotelImages, updateHotelImags } from '@/services/system/hotel';
import Constants from '@/constans';

const HotelImgs = props => {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVis, setPreviewVis] = useState(false);
  const [removeIds, setRemoveIds] = useState([]);

  useEffect(() => {
    fetchHotelImages();
  }, []);

  const fetchHotelImages = () => {
    getHotelImages().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        list.map(item => (item.uid = -item.id + ''));
        setFileList(list);
      }
    });
  };

  const handleSubmit = () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const { hotel_group_id, hotel_id, id: user_id } = currentUser;
    let imgs = [];
    fileList.map(item => {
      if (!item.id) {
        const { size: file_size } = item;
        const url = item.response && item.response.data && item.response.data[0];
        const file_name = url && url.substring(url.lastIndexOf('/') + 1);
        const img = {
          hotel_group_id,
          hotel_id,
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

    updateHotelImags(imgs).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '修改成功');
        fetchHotelImages();
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
    '&filePath=/hotel/' +
    currentUser.hotel_group_id +
    '/' +
    currentUser.hotel_id +
    '/';

  return (
    <GridContent>
      <div className={styles.header}>酒店图片</div>
      <div className={styles.content}>
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
      </div>
      <div className={styles.footer}>
        <Button type="primary" onClick={() => handleSubmit()}>
          提交
        </Button>
      </div>
    </GridContent>
  );
};

export default HotelImgs;
