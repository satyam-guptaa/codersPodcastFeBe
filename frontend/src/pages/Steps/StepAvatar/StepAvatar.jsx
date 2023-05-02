import React, { useEffect, useState } from "react"
import styles from "./StepAvatar.module.css"
import Card from "../../../components/shared/card/Card"
import Button from "../../../components/shared/Button/Button"
import { useSelector, useDispatch } from "react-redux"
import { setAvatarAction } from "../../../store/activationSlice"
import { activate } from "../../../http"
import { setAuth } from "../../../store/authSlice"
import Loader from "../../../components/shared/Loader/Loader"

const StepAvatar = () => {
	const avatar = useSelector((state) => state.activation.avatar)
	const [image, setImage] = useState("/images/monkey-avatar.png")
	//to check if component unmounted, to perform cleanup of asynchronous event
	const [unmounted, setUnmounted] = useState(false)
	const name = useSelector((state) => state.activation.name)
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)

	function captureImage(e) {
		const file = e.target.files[0]
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onloadend = function () {
			setImage(reader.result)
			dispatch(setAvatarAction(reader.result))
		}
	}

	async function submit() {
		if (!avatar || !name) return
		setLoading(true)
		try {
			const { data } = await activate({ name, image: avatar })
			// server work completed
			if (data.auth) {
				//check
				// if(!unmounted) {
				//   dispatch(setAuth(data));
				// }
				dispatch(setAuth(data))
			}
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	// useEffect(()=>{
	//   return () => {
	//     setUnmounted(true);
	//   }
	// })

	//activation loader
	if (loading) return <Loader message='Activation in Progress...'></Loader>
	return (
		<>
			<Card title={`Okay, ${name}!`} icon='monkey-emoji'>
				<p className={styles.upperPara}>How's this photo?</p>
				<div className={styles.avatarWrapper}>
					<img className={styles.avatar} src={image} alt='avatar' />
				</div>
				<div>
					<input
						id='avatarInput'
						type='file'
						className={styles.avatarInput}
						onChange={captureImage}
					/>
					<label
						htmlFor='avatarInput'
						className={styles.avatarInputLabel}
					>
						Choose a different photo
					</label>
				</div>
				<div className={styles.actionButtonWrap}>
					<Button
						text='Next'
						onClick={submit}
						disable={!avatar || !name}
					/>
				</div>
			</Card>
		</>
	)
}

export default StepAvatar
