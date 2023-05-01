import React from 'react'
import Card from '../../../components/shared/card/Card'
import Button from '../../../components/shared/Button/Button'
import TextInput from '../../../components/shared/TextInput/TextInput'
import { useState } from 'react'
import styles from './StepName.module.css'
import { setNameAction } from '../../../store/activationSlice'
import {useDispatch, useSelector} from 'react-redux'

const StepName = ({onNext}) => {
  const storedName = useSelector(state => state.activation.name);
  const [name, setName] = useState(storedName);
  const dispatch = useDispatch();

  function nextStep () {
    if(!name) {
      return;
    }
    dispatch(setNameAction(name));
    onNext();
  }

  return (
    <>
        <Card title='What’s your full name?' icon='goggle-emoji'>
            <TextInput value={name} onChange={(e) => setName(e.target.value)}/>
            <p className={styles.bottomPara}>People use real names at codershouse :) </p>
            <div className={styles.actionButtonWrap}>
              <Button text='Next' onClick={nextStep} disable={!name}/>
            </div>
        </Card>
    </>
  )
}

export default StepName