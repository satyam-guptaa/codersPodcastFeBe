//created to call a cb function each time after the state is updated which was not possible by react hooks,
import { useCallback, useEffect, useState, useRef } from 'react';

export const useStateWithCallback = (initialState) => {
	const [state, setState] = useState(initialState);
	const cbRef = useRef(null);

	const updateState = useCallback((newState, cb) => {
		cbRef.current = cb;
		//checking if someone is calling prev state template of setting state we are providing that too
		setState((prev) => {
			return typeof newState === 'function' ? newState(prev) : newState;
		});
	}, []);

	useEffect(() => {
		if (cbRef.current) {
			cbRef.current(state);
			cbRef.current = null;
		}
	}, [state]);

	return [state, updateState];
};
