import React from 'react'
import styles from './StepAvatar.module.css'
import Card from '../../../components/shared/card/Card'
import Button from '../../../components/shared/Button/Button'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAvatarAction } from '../../../store/activationSlice'
import { activate } from '../../../http'

const StepAvatar = () => {
  const image = useSelector(state => state.activation.avatar);
  // const [image, setImage] = useState('/images/monkey-avatar.png');
  const name = useSelector(state => state.activation.name);
  const dispatch = useDispatch();

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      dispatch(setAvatarAction(reader.result));
    }
  }
  async function submit() {
    try {
      const {data} = await activate({name, image});
      console.log(data)
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <>
        <Card title={`Okay, ${name}!`} icon='monkey-emoji'>
            <p className={styles.upperPara}>How's this photo?</p>
            <div className={styles.avatarWrapper}>
              <img className={styles.avatar} src={image} alt="avatar" />
            </div>
            <div>
              <input id='avatarInput' type="file" className={styles.avatarInput} onChange={captureImage}/>
              <label htmlFor="avatarInput" className={styles.avatarInputLabel}>Choose a different photo</label>
            </div>
            <div className={styles.actionButtonWrap}>
              <Button text='Next' onClick={submit}/>
            </div>
        </Card>
    </>
  )
}

export default StepAvatar