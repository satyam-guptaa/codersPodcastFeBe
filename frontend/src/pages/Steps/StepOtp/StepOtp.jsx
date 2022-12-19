import React, { useState } from 'react'
import styles from './StepOtp.module.css'
import Card from '../../../components/shared/card/Card'
import Button from '../../../components/shared/Button/Button'
import TextInput from '../../../components/shared/TextInput/TextInput'
import { verifyOtp } from '../../../http'
import { useSelector, useDispatch } from 'react-redux'
import {setAuth} from '../../../store/authSlice'

const StepOtp = () => {
  const [otp, setOtp] = useState('')
  const { phone, hash } = useSelector((state) => state.auth.otp);
  const dispatch = useDispatch();

  const submit = async () => {
    try {
      const {data} = await verifyOtp({ phone, hash, otp });
      dispatch(setAuth(data));
      // onNext(); not needed since protected route redirecting it
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    <div className='cardWrapper'>
      <Card title='Enter the code we just texted you' icon='lock-emoji'>
          <TextInput value={otp} onChange={(e) => setOtp(e.target.value)}/>
          <p className={styles.bottomPara}>Didn’t receive? Tap to resend</p>
          <div className={styles.actionButtonWrap}>
            <Button text='Next' onClick={submit}/>
          </div>
      </Card>
    </div>
  </>
  )
}

export default StepOtp