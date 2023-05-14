import React from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/shared/card/Card';
import Button from '../../components/shared/Button/Button';

const Home = () => {
	const navigate = useNavigate();

	const startRegister = () => {
		navigate('/authenticate');
	};

	return (
		<div className='cardWrapper'>
			<Card
				title='Welcome to coder house!!!'
				icon='logo'
			>
				<p className={styles.text}>
					We’re working hard to get Codershouse ready for everyone!
					While we wrap up the finishing touches, we’re adding people
					gradually to make sure nothing breaks
				</p>
				<Button
					onClick={startRegister}
					text="Let's Go"
				/>
				<div className={styles.signinWrapper}>
					<span className={styles.hadInvite}>
						Have an invite text?
					</span>
				</div>
			</Card>
		</div>
	);
};
export default Home;
