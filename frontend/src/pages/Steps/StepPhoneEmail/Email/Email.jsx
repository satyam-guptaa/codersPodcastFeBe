import React, { useState } from 'react'
import Card from '../../../../components/shared/card/Card'
import Button from '../../../../components/shared/Button/Button'
import TextInput from '../../../../components/shared/TextInput/TextInput'
import styles from '../StepPhoneEmail.module.css'

const Email = ({onNext}) => {
  const [email, setEmail] = useState('')
  return (
    <Card title="Enter Your Email ID" icon='email-emoji'>
       <TextInput value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <div className={styles.actionButtonWrap}><Button text="Next" onClick={onNext}/></div>
        <p className={styles.bottomPara}>
         By entering your number, you’re agreeing to our Terms of Service and Privacy Policy. Thanks!
        </p>
    </Card>
  )
}

export default Email