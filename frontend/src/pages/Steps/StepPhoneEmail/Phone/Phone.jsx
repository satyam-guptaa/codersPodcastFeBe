import React, { useState } from "react"
import Card from "../../../../components/shared/card/Card"
import Button from "../../../../components/shared/Button/Button"
import TextInput from "../../../../components/shared/TextInput/TextInput"
import styles from "../StepPhoneEmail.module.css"
import { sendOtp } from "../../../../http"
import { useDispatch } from "react-redux"
import { setOtp } from "../../../../store/authSlice"

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const dispatch = useDispatch()

  async function submit() {
    //not to send on empty input
    if (!phoneNumber) return
    // server request
    const { data } = await sendOtp({ phone: phoneNumber })
    console.log(data)
    dispatch(setOtp({ phone: data.phone, hash: data.hash }))
    onNext()
  }

  return (
    <Card title="Enter your phone number" icon="phone">
      <TextInput
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div className={styles.actionButtonWrap}>
        <Button text="Next" onClick={submit} disable={!phoneNumber}/>
      </div>
      <p className={styles.bottomPara}>
        By entering your number, you’re agreeing to our Terms of Service and
        Privacy Policy. Thanks!
      </p>
    </Card>
  )
}

export default Phone
